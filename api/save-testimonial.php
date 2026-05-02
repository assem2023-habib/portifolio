<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Only POST method allowed']);
    exit();
}

// ==================== Configuration ====================
$config = [
    'timeWindow' => 300,        // 5 minutes
    'maxAttempts' => 5,         // Max 5 attempts per 5 minutes
    'maxFileSize' => 2 * 1024 * 1024, // 2MB
    'allowedMimeTypes' => ['image/jpeg', 'image/png', 'image/jpg'],
    'allowedExtensions' => ['jpg', 'jpeg', 'png'],
    'jsonFile' => '../data/testimonials.json',
    'logFile' => '../logs/testimonials.log',
    'uploadDir' => '../assets/img/testimonials/',
    'defaultImage' => 'assets/img/testimonials/testimonials-1.jpg'
];

// ==================== Initialize Session for Rate Limiting ====================
session_start();

$ip = $_SERVER['REMOTE_ADDR'];

// Initialize session array if not set
if (!isset($_SESSION['testimonial_attempts'])) {
    $_SESSION['testimonial_attempts'] = [];
}

// Clean old attempts (older than time window)
$_SESSION['testimonial_attempts'] = array_filter($_SESSION['testimonial_attempts'], function($attempt) use ($config) {
    return (time() - $attempt['time']) < $config['timeWindow'];
});

// Count attempts from this IP
$ipAttempts = array_filter($_SESSION['testimonial_attempts'], function($attempt) use ($ip) {
    return $attempt['ip'] === $ip;
});

if (count($ipAttempts) >= $config['maxAttempts']) {
    echo json_encode(['success' => false, 'message' => 'Too many attempts. Please try again in 5 minutes.']);
    exit();
}

// ==================== Helper Functions ====================

// Sanitize input for storage
function sanitizeInput($input) {
    $input = trim($input);
    $input = stripslashes($input);
    return $input;
}

// Generate unique ID
function generateId($name) {
    $clean = preg_replace('/[^a-z0-9\s]/', '', strtolower($name));
    $clean = preg_replace('/\s+/', '_', $clean);
    return substr($clean, 0, 20) . '_' . time() . '_' . bin2hex(random_bytes(4));
}

// Handle image upload with security checks
function handleImageUpload($file, $config) {
    if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
        return null; // No image or upload error
    }

    // Check file MIME type using finfo
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);
    
    if (!in_array($mime, $config['allowedMimeTypes'])) {
        return ['error' => 'Only JPEG and PNG images are allowed'];
    }

    // Check file extension
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $config['allowedExtensions'])) {
        return ['error' => 'Invalid file extension'];
    }

    // Check file size
    if ($file['size'] > $config['maxFileSize']) {
        return ['error' => 'Image size must be less than 2MB'];
    }

    // Verify it's actually an image
    $check = getimagesize($file['tmp_name']);
    if ($check === false) {
        return ['error' => 'File is not a valid image'];
    }

    // Generate cryptographically secure filename
    $secureName = bin2hex(random_bytes(16)) . '_' . time() . '.' . $ext;
    
    // Ensure upload directory exists
    if (!is_dir($config['uploadDir'])) {
        mkdir($config['uploadDir'], 0755, true);
    }

    $uploadPath = $config['uploadDir'] . $secureName;

    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
        chmod($uploadPath, 0644);
        return 'assets/img/testimonials/' . $secureName;
    }

    return ['error' => 'Failed to upload image'];
}

// Log attempts
function logAttempt($logFile, $name, $ip) {
    $logDir = dirname($logFile);
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    $logEntry = date('Y-m-d H:i:s') . " - New testimonial submitted: {$name} (IP: {$ip})\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

// ==================== Main Logic ====================
try {
    // Get input (JSON or POST)
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        $input = $_POST;
    }

    // Validate required fields
    $requiredFields = ['name', 'role', 'content', 'rating'];
    foreach ($requiredFields as $field) {
        if (empty($input[$field])) {
            echo json_encode(['success' => false, 'message' => "Field '{$field}' is required"]);
            exit();
        }
    }

    // Validate rating range
    $rating = intval($input['rating']);
    if ($rating < 1 || $rating > 5) {
        echo json_encode(['success' => false, 'message' => 'Rating must be between 1 and 5']);
        exit();
    }

    // Sanitize inputs for storage
    $testimonial = [
        'id' => generateId($input['name']),
        'name' => sanitizeInput($input['name']),
        'role' => sanitizeInput($input['role']),
        'content' => sanitizeInput($input['content']),
        'rating' => $rating,
        'approved' => false, // Requires approval
        'created_at' => date('Y-m-d H:i:s'),
        'ip_address' => $ip,
        'image' => $config['defaultImage']
    ];

    // Add Arabic fields if provided
    if (!empty($input['nameAr'])) {
        $testimonial['nameAr'] = sanitizeInput($input['nameAr']);
    }
    if (!empty($input['roleAr'])) {
        $testimonial['roleAr'] = sanitizeInput($input['roleAr']);
    }
    if (!empty($input['contentAr'])) {
        $testimonial['contentAr'] = sanitizeInput($input['contentAr']);
    }

    // Handle image upload
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $imageResult = handleImageUpload($_FILES['image'], $config);
        if (is_array($imageResult) && isset($imageResult['error'])) {
            echo json_encode(['success' => false, 'message' => $imageResult['error']]);
            exit();
        }
        if ($imageResult) {
            $testimonial['image'] = $imageResult;
        }
    }

    // Read existing testimonials
    $jsonFile = $config['jsonFile'];
    
    if (!file_exists($jsonFile)) {
        echo json_encode(['success' => false, 'message' => 'Testimonials data file not found']);
        exit();
    }

    $jsonData = file_get_contents($jsonFile);
    $data = json_decode($jsonData, true);

    if (!$data || !isset($data['testimonials'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON structure']);
        exit();
    }

    // Add new testimonial
    $data['testimonials'][] = $testimonial;
    $data['metadata']['lastUpdated'] = date('Y-m-d');
    $data['metadata']['totalTestimonials'] = count($data['testimonials']);

    // Save back to JSON file with locking
    $fp = fopen($jsonFile, 'c');
    if (flock($fp, LOCK_EX)) {
        ftruncate($fp, 0);
        fwrite($fp, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        fflush($fp);
        flock($fp, LOCK_UN);
        fclose($fp);
    } else {
        fclose($fp);
        echo json_encode(['success' => false, 'message' => 'Failed to lock file for writing']);
        exit();
    }

    // Log the attempt
    $_SESSION['testimonial_attempts'][] = [
        'ip' => $ip,
        'time' => time(),
        'name' => $testimonial['name']
    ];

    // Write to log file
    logAttempt($config['logFile'], $testimonial['name'], $ip);

    echo json_encode([
        'success' => true,
        'message' => 'Testimonial submitted successfully! It will appear after approval.',
        'data' => $testimonial
    ]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
