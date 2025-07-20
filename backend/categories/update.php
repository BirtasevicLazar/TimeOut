<?php
require_once '../database/cors.php';
require_once '../database/db.php';
require_once '../utils/session.php';

// Proveri da li je korisnik ulogovan
requireLogin();

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
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

// Validacija ID-ja
if (!isset($input['id']) || !filter_var($input['id'], FILTER_VALIDATE_INT) || $input['id'] <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Nevaljan ID kategorije']);
    exit;
}

// Validacija imena
if (!isset($input['name']) || empty(trim($input['name']))) {
    http_response_code(400);
    echo json_encode(['error' => 'Ime kategorije je obavezno']);
    exit;
}

$category_id = (int)$input['id'];
$name = trim($input['name']);

// Proveri da ime nije predugačko
if (strlen($name) > 100) {
    http_response_code(400);
    echo json_encode(['error' => 'Ime kategorije ne može biti duže od 100 karaktera']);
    exit;
}

try {
    // Prvo proveri da li kategorija postoji
    $stmt = $conn->prepare("SELECT id FROM categories WHERE id = ?");
    $stmt->bind_param("i", $category_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Kategorija nije pronađena']);
        exit;
    }
    
    // Proveri da li već postoji kategorija sa istim imenom (osim trenutne)
    $stmt = $conn->prepare("SELECT id FROM categories WHERE name = ? AND id != ?");
    $stmt->bind_param("si", $name, $category_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        http_response_code(409);
        echo json_encode(['error' => 'Kategorija sa tim imenom već postoji']);
        exit;
    }
    
    // Ažuriraj kategoriju
    $stmt = $conn->prepare("UPDATE categories SET name = ? WHERE id = ?");
    $stmt->bind_param("si", $name, $category_id);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Kategorija je uspešno ažurirana',
            'category' => [
                'id' => $category_id,
                'name' => $name
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Greška pri ažuriranju kategorije']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Greška na serveru: ' . $e->getMessage()]);
}

$conn->close();
?>