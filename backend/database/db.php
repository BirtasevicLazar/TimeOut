<?php
// Učitaj environment varijable iz .env fajla
function loadEnv($path) {
    if (!file_exists($path)) {
        die("Environment fajl ne postoji: " . $path);
    }
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue; // Preskoči komentare
        }
        
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        
        if (!array_key_exists($name, $_ENV)) {
            $_ENV[$name] = $value;
        }
    }
}

// Učitaj .env fajl
loadEnv(__DIR__ . '/.env');

// Database konfiguracija iz environment varijabli
$host = $_ENV['DB_HOST'];
$dbname = $_ENV['DB_NAME'];
$username = $_ENV['DB_USERNAME'];
$password = $_ENV['DB_PASSWORD'];

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    if ($_ENV['APP_DEBUG'] === 'true') {
        die("Greška pri konekciji: " . $conn->connect_error);
    } else {
        die("Greška pri konekciji sa bazom podataka");
    }
}

$conn->set_charset("utf8");
?>