<?php
require_once '../database/cors.php';
require_once '../database/db.php';
require_once '../utils/session.php';

// Proveri da li je korisnik ulogovan
requireLogin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metoda nije dozvoljena']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

// Validacija JSON podataka
if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Nevaljan JSON format']);
    exit;
}

// Validacija imena
if (!isset($input['name']) || empty(trim($input['name']))) {
    http_response_code(400);
    echo json_encode(['error' => 'Ime kategorije je obavezno']);
    exit;
}

$name = trim($input['name']);

// Proveri da ime nije predugačko
if (strlen($name) > 100) {
    http_response_code(400);
    echo json_encode(['error' => 'Ime kategorije ne može biti duže od 100 karaktera']);
    exit;
}

try {
    // Proveri da li već postoji kategorija sa istim imenom
    $stmt = $conn->prepare("SELECT id FROM categories WHERE name = ?");
    $stmt->bind_param("s", $name);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        http_response_code(409);
        echo json_encode(['error' => 'Kategorija sa tim imenom već postoji']);
        exit;
    }
    
    // Kreiraj novu kategoriju
    $stmt = $conn->prepare("INSERT INTO categories (name) VALUES (?)");
    $stmt->bind_param("s", $name);
    
    if ($stmt->execute()) {
        $category_id = $conn->insert_id;
        echo json_encode([
            'success' => true,
            'message' => 'Kategorija je uspešno kreirana',
            'category' => [
                'id' => $category_id,
                'name' => $name
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Greška pri kreiranju kategorije']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Greška na serveru: ' . $e->getMessage()]);
}

$conn->close();
?>