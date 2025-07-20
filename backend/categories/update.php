<?php
require_once '../database/cors.php';
require_once '../database/db.php';
require_once '../utils/session.php';
require_once '../utils/image_upload.php';

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
$category_id = isset($_POST['id']) ? filter_var($_POST['id'], FILTER_VALIDATE_INT) : null;
$name = isset($_POST['name']) ? trim($_POST['name']) : '';

// Validacija ID-ja
if (!$category_id || $category_id <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Nevaljan ID kategorije']);
    exit;
}

// Validacija obaveznih polja
if (empty($name)) {
    http_response_code(400);
    echo json_encode(['error' => 'Ime kategorije je obavezno']);
    exit;
}

// Validacija dužine polja
if (strlen($name) > 100) {
    http_response_code(400);
    echo json_encode(['error' => 'Ime kategorije ne može biti duže od 100 karaktera']);
    exit;
}

try {

    // Prvo uzmi trenutne podatke o kategoriji
    $stmt = $conn->prepare("SELECT id, image_url FROM categories WHERE id = ?");
    $stmt->bind_param("i", $category_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Kategorija nije pronađena']);
        exit;
    }
    
    $current_category = $result->fetch_assoc();
    $old_image_url = $current_category['image_url'];
    
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
    
    // Upravljaj slikom
    $image_url = $old_image_url; // Zadrži staru sliku po default-u
    
    // Ako je nova slika upload-ovana
    if (isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
        $upload_result = uploadCategoryImage($_FILES['image']);
        
        if (!$upload_result['success']) {
            http_response_code(400);
            echo json_encode(['error' => $upload_result['error']]);
            exit;
        }
        
        $image_url = $upload_result['image_url'];
    }
    
    // Ažuriraj kategoriju
    $stmt = $conn->prepare("UPDATE categories SET name = ?, image_url = ? WHERE id = ?");
    $stmt->bind_param("ssi", $name, $image_url, $category_id);
    
    if ($stmt->execute()) {
        // Ako je slika uspešno ažurirana i bila je nova slika, obriši staru
        if ($image_url !== $old_image_url && $old_image_url) {
            deleteCategoryImage($old_image_url);
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Kategorija je uspešno ažurirana',
            'category' => [
                'id' => $category_id,
                'name' => $name,
                'image_url' => $image_url
            ]
        ]);
    } else {
        // Obriši novu sliku ako se ažuriranje nije uspešno izvršilo
        if ($image_url !== $old_image_url && $image_url) {
            deleteCategoryImage($image_url);
        }
        http_response_code(500);
        echo json_encode(['error' => 'Greška pri ažuriranju kategorije']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Greška na serveru: ' . $e->getMessage()]);
}

$conn->close();
?>