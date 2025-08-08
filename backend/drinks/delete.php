<?php
require_once '../database/cors.php';
require_once '../database/db.php';
require_once '../utils/session.php';

// Proveri da li je korisnik ulogovan
requireLogin();

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['error' => 'Metoda nije dozvoljena']);
    exit;
}

// Uzmi ID iz URL-a ili iz JSON body-ja
$drink_id = null;

// Prvo pokušaj da uzmeš iz GET parametra
if (isset($_GET['id'])) {
    $drink_id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
} else {
    // Ako nije u GET-u, pokušaj iz JSON body-ja
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input && isset($input['id'])) {
        $drink_id = filter_var($input['id'], FILTER_VALIDATE_INT);
    }
}

// Validacija ID-ja
if (!$drink_id || $drink_id <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Nevaljan ID pića']);
    exit;
}

try {
    // Prvo proveri da li piće postoji i uzmi podatke za odgovor
    $stmt = $conn->prepare("
        SELECT d.id, d.name, d.price, d.category_id, c.name as category_name
        FROM drinks d 
        LEFT JOIN categories c ON d.category_id = c.id 
        WHERE d.id = ?
    ");
    $stmt->bind_param("i", $drink_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Piće nije pronađeno']);
        exit;
    }
    
    $drink = $result->fetch_assoc();
    
    // Formatuj cenu za odgovor
    $drink['price'] = $drink['price'] ? floatval($drink['price']) : null;
    
    // Obriši piće iz baze
    $stmt = $conn->prepare("DELETE FROM drinks WHERE id = ?");
    $stmt->bind_param("i", $drink_id);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Piće je uspešno obrisano',
            'deleted_drink' => $drink
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Greška pri brisanju pića']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Greška na serveru: ' . $e->getMessage()]);
}

$conn->close();
?>