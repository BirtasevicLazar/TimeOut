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
$description = isset($_POST['description']) ? trim($_POST['description']) : null;
$price = isset($_POST['price']) ? $_POST['price'] : null;
$category_id = isset($_POST['category_id']) ? $_POST['category_id'] : null;

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

// Upload slike (opcionalno)
$image_url = null;
if (isset($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
    $upload_result = uploadDrinkImage($_FILES['image']);
    
    if (!$upload_result['success']) {
        http_response_code(400);
        echo json_encode(['error' => $upload_result['error']]);
        exit;
    }
    
    $image_url = $upload_result['image_url'];
}

try {
    // Proveri da li već postoji piće sa istim imenom
    $stmt = $conn->prepare("SELECT id FROM drinks WHERE name = ?");
    $stmt->bind_param("s", $name);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        // Obriši upload-ovanu sliku ako postoji greška
        if ($image_url) {
            deleteDrinkImage($image_url);
        }
        http_response_code(409);
        echo json_encode(['error' => 'Piće sa tim imenom već postoji']);
        exit;
    }
    
    // Kreiraj novo piće
    $stmt = $conn->prepare("INSERT INTO drinks (name, description, price, image_url, category_id) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssdsi", $name, $description, $price, $image_url, $category_id);
    
    if ($stmt->execute()) {
        $drink_id = $conn->insert_id;
        
        // Vrati kreirano piće sa podacima o kategoriji
        $stmt = $conn->prepare("
            SELECT d.id, d.name, d.description, d.price, d.image_url, d.category_id, c.name as category_name
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
            'message' => 'Piće je uspešno kreirano',
            'drink' => $drink
        ]);
    } else {
        // Obriši upload-ovanu sliku ako se kreiranje nije uspešno
        if ($image_url) {
            deleteDrinkImage($image_url);
        }
        http_response_code(500);
        echo json_encode(['error' => 'Greška pri kreiranju pića']);
    }
} catch (Exception $e) {
    // Obriši upload-ovanu sliku ako ima greške
    if ($image_url) {
        deleteDrinkImage($image_url);
    }
    http_response_code(500);
    echo json_encode(['error' => 'Greška na serveru: ' . $e->getMessage()]);
}

$conn->close();
?>