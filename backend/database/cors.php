<?php

header('Content-Type: application/json');

// CORS konfiguracija - restriktivnija
$allowed_origins = [
    'http://localhost:3000',    // React dev server
    'http://localhost:8080',    // Vue/Angular dev
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5500',    // Live Server
    'https://yourdomain.com'    // Production domain
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Za development, možete dodati localhost fallback
    if (strpos($origin, 'localhost') !== false || strpos($origin, '127.0.0.1') !== false) {
        header("Access-Control-Allow-Origin: $origin");
    }
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 3600");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

?>