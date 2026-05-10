// Portfolio data - separated for reuse across multiple files
const portfolioData = {
  smartship: {
    title: "SmartShip",
    category: "web",
    image: "assets/img/masonry-portfolio/masonry-portfolio-1.jpg",
    description: "Integrated parcel management system with advanced tracking and user management features for efficient logistics operations",
    detailsUrl: "project.html",
    gallery: "portfolio-gallery-web",
    technologies: "Laravel, PHP, MySQL, RESTful APIs, Bootstrap",
    status: "Completed",
    url: "#",
    features: [
      "Real-time package tracking",
      "Automated notifications",
      "Multi-warehouse support",
      "Advanced reporting dashboard",
      "Mobile-responsive design",
      "Secure payment integration"
    ],
    galleryImages: [
      "assets/img/masonry-portfolio/masonry-portfolio-1.jpg",
      "assets/img/portfolio/app-1.jpg",
      "assets/img/portfolio/product-1.jpg"
    ]
  },
  stitchhub: {
    title: "Sewing Store",
    category: "web",
    image: "assets/img/Projects_Images/Sweing/Main/Sweing_WebSite_Main_Page_Light.jpeg",
    imageDark: "assets/img/Projects_Images/Sweing/Main/Sweing_WebSite_Main_Page_Dark.jpeg",
    description: "Comprehensive e-commerce platform for sewing and tailoring supplies with multi-language support, advanced admin dashboard, and hierarchical micro-inventory management",
    detailsUrl: "project.html",
    gallery: "portfolio-gallery-web",
    technologies: "Laravel 10.x, PHP 8.1+, MySQL, Spatie Translatable, MVC Architecture",
    status: "Completed",
    url: "#",
    features: [
      "Multi-language support (Arabic/English) with deep i18n and RTL",
      "Hierarchical product and category management (Micro-Inventory)",
      "Advanced admin dashboard with real-time statistics",
      "Role-based access control with Admin Middleware",
      "Multilingual SEO with meta data optimization",
      "Image management with automatic cleanup on update",
      "Shopping cart system with secure quantity management",
      "Admin authority: ban, freeze, and role upgrade controls",
      "Promotional offers management system"
    ],
    galleryImages: [
      "assets/img/Projects_Images/Sweing/Main/Sweing_WebSite_Main_Page_Light.jpeg",
      "assets/img/Projects_Images/Sweing/Main/Sweing_WebSite_Main_Page_Dark.jpeg",
      "assets/img/Projects_Images/Sweing/_login.png",
      "assets/img/Projects_Images/Sweing/_en_categories.png",
      "assets/img/Projects_Images/Sweing/_en_cart.png",
      "assets/img/Projects_Images/Sweing/_en_admin_dashboard.png"
    ]
  },
  cutoptimizer: {
    title: "CutOptimizer",
    category: "desktop",
    image: "assets/img/Projects_Images/CutOptimizer/Desktop/main_page.png",
    description: "Smart carpet cutting optimization tool for textile industry efficiency and waste reduction",
    detailsUrl: "project.html",
    gallery: "portfolio-gallery-desktop",
    technologies: "C#, WPF, SQL Server, Optimization Algorithms",
    status: "Completed",
    url: "#",
    features: [
      "AI-powered cutting optimization",
      "Material waste reduction",
      "Multiple format support",
      "Real-time cost calculation",
      "Export to CNC machines",
      "Batch processing"
    ],
    galleryImages: [
      "assets/img/Projects_Images/CutOptimizer/Desktop/main_page.png",
      "assets/img/Projects_Images/CutOptimizer/Desktop/Screenshot (612).png",
      "assets/img/Projects_Images/CutOptimizer/sjade/main_page.png",
      "assets/img/Projects_Images/CutOptimizer/sjade/Screenshot_٢٠٢٦٠٥٠٨-٠٧٤٨١٢.png"
    ]
  },
  socialbackend: {
    title: "Social Backend",
    category: "web",
    image: "assets/img/masonry-portfolio/masonry-portfolio-4.jpg",
    description: "Real-time messaging system backend with advanced chat features and media sharing capabilities",
    detailsUrl: "project.html",
    gallery: "portfolio-gallery-web",
    technologies: "Node.js, Socket.io, MongoDB, Express.js, JWT",
    status: "Completed",
    url: "#",
    features: [
      "Real-time messaging",
      "File and media sharing",
      "Group chat support",
      "Message encryption",
      "User authentication",
      "Scalable architecture"
    ],
    galleryImages: [
      "assets/img/masonry-portfolio/masonry-portfolio-4.jpg",
      "assets/img/portfolio/branding-2.jpg",
      "assets/img/portfolio/books-1.jpg"
    ]
  },
  taskflow: {
    title: "TaskFlow Mobile",
    category: "mobile",
    image: "assets/img/masonry-portfolio/masonry-portfolio-5.jpg",
    description: "Advanced task management application with team collaboration and progress tracking features",
    detailsUrl: "project.html",
    gallery: "portfolio-gallery-mobile",
    technologies: "Flutter, Firebase, Dart, Cloud Functions",
    status: "Completed",
    url: "#",
    features: [
      "Team collaboration tools",
      "Progress tracking",
      "File attachments",
      "Real-time updates",
      "Offline synchronization",
      "Advanced filtering"
    ],
    galleryImages: [
      "assets/img/masonry-portfolio/masonry-portfolio-5.jpg",
      "assets/img/portfolio/app-4.jpg",
      "assets/img/portfolio/product-3.jpg"
    ]
  },
  dataanalyzer: {
    title: "DataAnalyzer",
    category: "desktop",
    image: "assets/img/masonry-portfolio/masonry-portfolio-6.jpg",
    description: "Desktop data analysis tool with advanced visualization and reporting capabilities for business intelligence",
    detailsUrl: "project.html",
    gallery: "portfolio-gallery-desktop",
    technologies: "Python, PyQt, Pandas, Matplotlib, SQLite",
    status: "Completed",
    url: "#",
    features: [
      "Interactive data visualization",
      "Multiple data source support",
      "Custom report generation",
      "Statistical analysis tools",
      "Export to multiple formats",
      "Real-time data processing"
    ],
    galleryImages: [
      "assets/img/masonry-portfolio/masonry-portfolio-6.jpg",
      "assets/img/portfolio/app-5.jpg",
      "assets/img/portfolio/branding-3.jpg"
    ]
  },
  inventorypro: {
    title: "InventoryPro",
    category: "web",
    image: "assets/img/masonry-portfolio/masonry-portfolio-7.jpg",
    description: "Web-based inventory management system with barcode scanning and automated reporting for retail businesses",
    detailsUrl: "project.html",
    gallery: "portfolio-gallery-web",
    technologies: "Laravel, PHP, MySQL, Barcode API, Chart.js",
    status: "Completed",
    url: "#",
    features: [
      "Barcode scanning integration",
      "Automated stock alerts",
      "Sales reporting dashboard",
      "Multi-location support",
      "Purchase order management",
      "Inventory forecasting"
    ],
    galleryImages: [
      "assets/img/masonry-portfolio/masonry-portfolio-7.jpg",
      "assets/img/portfolio/books-2.jpg",
      "assets/img/portfolio/product-4.jpg"
    ]
  },
  expensetracker: {
    title: "ExpenseTracker",
    category: "mobile",
    image: "assets/img/masonry-portfolio/masonry-portfolio-8.jpg",
    description: "Personal expense tracking application with budget management and financial insights for better money management",
    detailsUrl: "project.html",
    gallery: "portfolio-gallery-mobile",
    technologies: "React Native, AsyncStorage, React Navigation",
    status: "Completed",
    url: "#",
    features: [
      "Expense categorization",
      "Budget planning tools",
      "Financial goal setting",
      "Receipt scanning",
      "Monthly reports",
      "Multi-currency support"
    ],
    galleryImages: [
      "assets/img/masonry-portfolio/masonry-portfolio-8.jpg",
      "assets/img/portfolio/app-6.jpg",
      "assets/img/portfolio/branding-4.jpg"
    ]
  },
  codeeditor: {
    title: "CodeEditor Pro",
    category: "desktop",
    image: "assets/img/masonry-portfolio/masonry-portfolio-9.jpg",
    description: "Professional code editor with syntax highlighting and project management features for developers",
    detailsUrl: "project.html",
    gallery: "portfolio-gallery-desktop",
    technologies: "Electron, Monaco Editor, Node.js, TypeScript",
    status: "Completed",
    url: "#",
    features: [
      "Syntax highlighting",
      "Code completion",
      "Project file tree",
      "Multiple theme support",
      "Plugin system",
      "Git integration"
    ],
    galleryImages: [
      "assets/img/masonry-portfolio/masonry-portfolio-9.jpg",
      "assets/img/portfolio/app-7.jpg",
      "assets/img/portfolio/product-5.jpg"
    ]
  },
  shehrezad: {
    title: "Shehrezad Backend",
    category: "web",
    image: "assets/img/Projects_Images/shahrazad/shahrazad_customer/main_page.png",
    description: "Integrated e-commerce and CRM backend system with advanced APIs for product, order, and debt management",
    detailsUrl: "project.html",
    gallery: "portfolio-gallery-web",
    technologies: "Node.js, Express, MySQL, Firebase, JWT, Puppeteer, PDFKit",
    status: "Completed",
    url: "#",
    features: [
      "Integrated e-commerce and CRM platform",
      "Complete order management (Cart to Invoice)",
      "Customer debt and account tracking",
      "RBAC (Customer, Employee, Super Admin)",
      "Firebase Push Notifications",
      "Automated PDF Invoice generation",
      "Cron Jobs for system maintenance"
    ],
    galleryImages: [
      "assets/img/Projects_Images/shahrazad/shahrazad_customer/main_page.png",
      "assets/img/Projects_Images/shahrazad/shahrazad_customer/Screenshot_٢٠٢٦٠٥٠٨-٠٨١٨١٨.png",
      "assets/img/Projects_Images/shahrazad/shahrazad_customer/Screenshot_٢٠٢٦٠٥٠٨-٠٨١٨٢١.png",
      "assets/img/Projects_Images/shahrazad/shahrazad_dashboard/main_page.png"
    ]
  },
  mizaneyati: {
    title: "Mizaneyati Pro",
    category: "mobile",
    image: "assets/img/Projects_Images/mezanyti/main_page.png",
    description: "Comprehensive personal financial management system built with Clean Architecture standards, featuring advanced tracking, visual documentation, and interactive intelligence.",
    detailsUrl: "project.html",
    gallery: "portfolio-gallery-mobile",
    technologies: "Flutter, Riverpod, Drift (SQLite), Clean Architecture",
    status: "Completed",
    url: "#",
    features: [
      "Integrated transactions and internal transfers system",
      "Advanced visual documentation (Receipt scanning)",
      "Interactive financial intelligence with fl_chart",
      "Clean Architecture with Feature-First structure",
      "Offline-first database with Drift (Type-safe)",
      "Robust validation logic and automated testing"
    ],
    galleryImages: [
      "assets/img/Projects_Images/mezanyti/main_page.png",
      "assets/img/Projects_Images/mezanyti/Screenshot_٢٠٢٦٠٥٠٨-٠٨١١٠٧.png",
      "assets/img/Projects_Images/mezanyti/Screenshot_٢٠٢٦٠٥٠٨-٠٨١١١٥.png",
      "assets/img/Projects_Images/mezanyti/Screenshot_٢٠٢٦٠٥٠٨-٠٨١١١٧.png",
      "assets/img/Projects_Images/mezanyti/Screenshot_٢٠٢٦٠٥٠٨-٠٨١١٤٠.png",
      "assets/img/Projects_Images/mezanyti/Screenshot_٢٠٢٦٠٥٠٨-٠٨١٣٤٠.png"
    ]
  },
  shiftpay: {
    title: "Shift Pay",
    category: "mobile",
    image: "assets/img/Projects_Images/ShiftPay/main_image/Shidt_pay_Main_card_LightMode.png",
    imageDark: "assets/img/Projects_Images/ShiftPay/main_image/Shift_pay_Main_card_DarkMode.png",
    description: "Smart employee and finance management system with an advanced voice assistant supporting Egyptian dialect, built for offline efficiency",
    detailsUrl: "project.html",
    gallery: "portfolio-gallery-mobile",
    technologies: "Flutter, Bloc, Drift (SQLite), Speech To Text, Clean Architecture",
    status: "Completed",
    url: "#",
    features: [
      "Advanced Voice Assistant (Egyptian Dialect support)",
      "Automated Payroll and Financial management",
      "Offline-first architecture with SQLite (Drift)",
      "Professional PDF Reporting System",
      "Inventory and Branch management",
      "Smart Attendance and Shift tracking"
    ],
    galleryImages: [
      "assets/img/Projects_Images/ShiftPay/main_page.png",
      "assets/img/Projects_Images/ShiftPay/ShiftPay_Statistics.png",
      "assets/img/Projects_Images/ShiftPay/ShiftPay_Attendance.png",
      "assets/img/Projects_Images/ShiftPay/ShiftPay_BracnchPage.png",
      "assets/img/Projects_Images/ShiftPay/ShiftPay_Employees.png",
      "assets/img/Projects_Images/ShiftPay/ShiftPay_Salaries.png"
    ]
  },
  rma: {
    title: "RMA - Parcel Management System",
    category: "web",
    image: "assets/img/Projects_Images/RMA/FULL_STACK_DASHBOARD_WEB/Admin_home_page.png",
    description: "Comprehensive parcel management and shipping system built with Laravel 12 and Filament Admin Panel. Features real-time tracking, multi-branch support, customer and employee chat, and advanced shipping management with WebSocket support.",
    detailsUrl: "project.html",
    gallery: "portfolio-gallery-web",
    technologies: "Laravel 12, Filament 3.3, MySQL, WebSocket, Firebase",
    status: "Completed",
    url: "#",
    features: [
      "Real-time parcel tracking with unique tracking numbers",
      "Multi-branch and route management",
      "Appointment booking system",
      "Parcel authorization with OTP codes",
      "Real-time chat between customers and employees",
      "WebSocket support via Laravel Reverb",
      "Filament Admin Panel with 20+ resources",
      "Multi-step parcel creation wizard"
    ],
    galleryImages: [
      "assets/img/Projects_Images/RMA/FULL_STACK_DASHBOARD_WEB/Admin_home_page.png",
      "assets/img/Projects_Images/RMA/FULL_STACK_DASHBOARD_WEB/Admin_login.png",
      "assets/img/Projects_Images/RMA/FULL_STACK_DASHBOARD_WEB/Parcel/Admin_Show_Parcels.png",
      "assets/img/Projects_Images/RMA/FULL_STACK_DASHBOARD_WEB/users/Admin_users.png",
      "assets/img/Projects_Images/RMA/FULL_STACK_DASHBOARD_WEB/Employee/Admin_Show_Employees.png",
      "assets/img/Projects_Images/RMA/FULL_STACK_DASHBOARD_WEB/shipments/admin_shipments.png",
      "assets/img/Projects_Images/RMA/FULL_STACK_DASHBOARD_WEB/trucks/admin_trucks.png"
    ]
  }
};
