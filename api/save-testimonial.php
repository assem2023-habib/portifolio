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

// Function to sanitize input
function sanitizeInput($input) {
    $input = trim($input);
    $input = stripslashes($input);
    $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    return $input;
}

// Function to generate unique ID
function generateId($name) {
    return strtolower(preg_replace('/[^a-z0-9]/', '', $name)) . '_' . time();
}

// Function to handle image upload
function handleImageUpload($file) {
    if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
        return null; // No image or upload error
    }

    $allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    $maxFileSize = 2 * 1024 * 1024; // 2MB

    // Check file type
    if (!in_array($file['type'], $allowedTypes)) {
        return ['error' => 'Only JPG and PNG images are allowed'];
    }

    // Check file size
    if ($file['size'] > $maxFileSize) {
        return ['error' => 'Image size must be less than 2MB'];
    }

    // Generate unique filename
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = 'testimonial_' . time() . '_' . uniqid() . '.' . $ext;
    $uploadPath = '../assets/img/testimonials/' . $filename;

    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
        return 'assets/img/testimonials/' . $filename;
    }

    return ['error' => 'Failed to upload image'];
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    // If not JSON, try POST
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

    // Sanitize inputs
    $testimonial = [
        'id' => generateId($input['name']),
        'name' => sanitizeInput($input['name']),
        'role' => sanitizeInput($input['role']),
        'content' => sanitizeInput($input['content']),
        'rating' => intval($input['rating']),
        'approved' => false, // Requires approval
        'created_at' => date('Y-m-d H:i:s'),
        'image' => 'assets/img/testimonials/testimonials-1.jpg' // Default image
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

    // Handle image upload (if using FormData)
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $imageResult = handleImageUpload($_FILES['image']);
        if (is_array($imageResult) && isset($imageResult['error'])) {
            echo json_encode(['success' => false, 'message' => $imageResult['error']]);
            exit();
        }
        if ($imageResult) {
            $testimonial['image'] = $imageResult;
        }
    }

    // Read existing testimonials
    $jsonFile = '../data/testimonials.json';
    
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

    // Save back to JSON file
    $result = file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
    if ($result === false) {
        echo json_encode(['success' => false, 'message' => 'Failed to save testimonial. Check file permissions.']);
        exit();
    }

    echo json_encode([
        'success' => true,
        'message' => 'Testimonial submitted successfully! It will appear after approval.',
        'data' => $testimonial
    ]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>
