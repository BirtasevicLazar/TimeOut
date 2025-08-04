<?php
require_once '../database/cors.php';
require_once '../database/db.php';
require_once '../utils/security.php';
require_once '../utils/session.php';

// Proveri da li je korisnik ulogovan
requireLogin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { // Koristimo POST umesto PUT za form-data
    http_response_code(405);
    echo json_encode(['error' => 'Metoda nije dozvoljena']);
    exit;
}

// Proveri da li je update operacija (mora biti postavljen _method=PUT)
if (!isset($_POST['_method']) || $_POST['_method'] !== 'PUT') {
    http_response_code(400);
    echo json_encode(['error' => 'Nedostaje _method=PUT parametar']);
    exit;
}

// Uzmi podatke iz form-data
$drink_id = isset($_POST['id']) ? filter_var($_POST['id'], FILTER_VALIDATE_INT) : null;
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$description = isset($_POST['description']) ? trim($_POST['description']) : null;
$price = isset($_POST['price']) ? $_POST['price'] : null;
$category_id = isset($_POST['category_id']) ? $_POST['category_id'] : null;

// Validacija ID-ja
if (!$drink_id || $drink_id <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Nevaljan ID pića']);
    exit;
}

// Validacija obaveznih polja
if (empty($name)) {
    http_response_code(400);
    echo json_encode(['error' => 'Ime pića je obavezno']);
    exit;
}

// Validacija dužine polja
if (strlen($name) > 255) {
    http_response_code(400);
    echo json_encode(['error' => 'Ime pića ne može biti duže od 255 karaktera']);
    exit;
}

// Validacija cene
if ($price !== null && $price !== '') {
    if (!is_numeric($price) || $price < 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Cena mora biti pozitivna vrednost']);
        exit;
    }
    $price = floatval($price);
} else {
    $price = null;
}

// Validacija kategorije
if ($category_id !== null && $category_id !== '') {
    $category_id = filter_var($category_id, FILTER_VALIDATE_INT);
    if (!$category_id || $category_id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Nevaljan ID kategorije']);
        exit;
    }
    
    // Proveri da li kategorija postoji
    $stmt = $conn->prepare("SELECT id FROM categories WHERE id = ?");
    $stmt->bind_param("i", $category_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Kategorija ne postoji']);
        exit;
    }
} else {
    $category_id = null;
}

try {
    // Prvo uzmi trenutne podatke o piću
    $stmt = $conn->prepare("SELECT id FROM drinks WHERE id = ?");
    $stmt->bind_param("i", $drink_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Piće nije pronađeno']);
        exit;
    }
    
    // Ažuriraj piće
    $stmt = $conn->prepare("UPDATE drinks SET name = ?, description = ?, price = ?, category_id = ? WHERE id = ?");
    $stmt->bind_param("ssdii", $name, $description, $price, $category_id, $drink_id);
    
    if ($stmt->execute()) {
        // Vrati ažurirano piće sa podacima o kategoriji
        $stmt = $conn->prepare("
            SELECT d.id, d.name, d.description, d.price, d.category_id, c.name as category_name
            FROM drinks d 
            LEFT JOIN categories c ON d.category_id = c.id 
            WHERE d.id = ?
        ");
        $stmt->bind_param("i", $drink_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $drink = $result->fetch_assoc();
        
        // Formatuj cenu
        $drink['price'] = $drink['price'] ? floatval($drink['price']) : null;
        
        echo json_encode([
            'success' => true,
            'message' => 'Piće je uspešno ažurirano',
            'drink' => $drink
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Greška pri ažuriranju pića']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Greška na serveru: ' . $e->getMessage()]);
}

$conn->close();
?>