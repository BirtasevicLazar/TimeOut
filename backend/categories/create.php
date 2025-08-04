<?php
require_once '../database/cors.php';
require_once '../database/db.php';
require_once '../utils/session.php';
require_once '../utils/image_upload.php';

// Proveri da li je korisnik ulogovan
requireLogin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metoda nije dozvoljena']);
    exit;
}

// Uzmi podatke iz form-data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$is_party = isset($_POST['is_party']) ? filter_var($_POST['is_party'], FILTER_VALIDATE_BOOLEAN) : false;

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

// Upload slike (opcionalno)
$image_url = null;
if (isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
    $upload_result = uploadCategoryImage($_FILES['image']);
    
    if (!$upload_result['success']) {
        http_response_code(400);
        echo json_encode(['error' => $upload_result['error']]);
        exit;
    }
    
    $image_url = $upload_result['image_url'];
}

try {
   
    // Proveri da li već postoji kategorija sa istim imenom
    $stmt = $conn->prepare("SELECT id FROM categories WHERE name = ?");
    $stmt->bind_param("s", $name);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        // Obriši upload-ovanu sliku ako postoji greška
        if ($image_url) {
            deleteCategoryImage($image_url);
        }
        http_response_code(409);
        echo json_encode(['error' => 'Kategorija sa tim imenom već postoji']);
        exit;
    }
    
    // Kreiraj novu kategoriju
    $stmt = $conn->prepare("INSERT INTO categories (name, image_url, is_party) VALUES (?, ?, ?)");
    $stmt->bind_param("ssi", $name, $image_url, $is_party);
    
    if ($stmt->execute()) {
        $category_id = $conn->insert_id;
        echo json_encode([
            'success' => true,
            'message' => 'Kategorija je uspešno kreirana',
            'category' => [
                'id' => $category_id,
                'name' => $name,
                'image_url' => $image_url,
                'is_party' => $is_party
            ]
        ]);
    } else {
        // Obriši upload-ovanu sliku ako se kreiranje nije uspešno
        if ($image_url) {
            deleteCategoryImage($image_url);
        }
        http_response_code(500);
        echo json_encode(['error' => 'Greška pri kreiranju kategorije']);
    }
} catch (Exception $e) {
    // Obriši upload-ovanu sliku ako ima greške
    if ($image_url) {
        deleteCategoryImage($image_url);
    }
    http_response_code(500);
    echo json_encode(['error' => 'Greška na serveru: ' . $e->getMessage()]);
}

$conn->close();
?>