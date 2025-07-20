<?php
require_once '../database/cors.php';
require_once '../database/db.php';
require_once '../utils/session.php';
require_once '../utils/image_upload.php';

// Proveri da li je korisnik ulogovan
requireLogin();

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['error' => 'Metoda nije dozvoljena']);
    exit;
}

// Uzmi ID iz URL-a ili iz JSON body-ja
$category_id = null;

// Prvo pokušaj da uzmeš iz GET parametra
if (isset($_GET['id'])) {
    $category_id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
} else {
    // Ako nije u GET-u, pokušaj iz JSON body-ja
    $input = json_decode(file_get_contents('php://input'), true);
    if ($input && isset($input['id'])) {
        $category_id = filter_var($input['id'], FILTER_VALIDATE_INT);
    }
}

// Validacija ID-ja
if (!$category_id || $category_id <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Nevaljan ID kategorije']);
    exit;
}

try {

    // Prvo proveri da li kategorija postoji i uzmi podatke uključujući image_url
    $stmt = $conn->prepare("SELECT id, name, image_url FROM categories WHERE id = ?");
    $stmt->bind_param("i", $category_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Kategorija nije pronađena']);
        exit;
    }
    
    $category = $result->fetch_assoc();
    
    // Proveri da li postoje pića u ovoj kategoriji
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM drinks WHERE category_id = ?");
    $stmt->bind_param("i", $category_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $drinks_count = $result->fetch_assoc()['count'];
    
    if ($drinks_count > 0) {
        http_response_code(409);
        echo json_encode([
            'error' => 'Ne možete obrisati kategoriju koja sadrži pića',
            'drinks_count' => $drinks_count
        ]);
        exit;
    }
    
    // Obriši kategoriju
    $stmt = $conn->prepare("DELETE FROM categories WHERE id = ?");
    $stmt->bind_param("i", $category_id);
    
    if ($stmt->execute()) {
        // Obriši sliku sa servera ako postoji
        if ($category['image_url']) {
            deleteCategoryImage($category['image_url']);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Kategorija je uspešno obrisana',
            'deleted_category' => [
                'id' => $category['id'],
                'name' => $category['name'],
                'image_url' => $category['image_url']
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Greška pri brisanju kategorije']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Greška na serveru: ' . $e->getMessage()]);
}

$conn->close();
?>