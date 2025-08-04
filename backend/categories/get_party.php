<?php
require_once '../database/cors.php';
require_once '../database/db.php';

// GET operacije ne zahtevaju autentifikaciju - svi mogu da vide kategorije

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Metoda nije dozvoljena']);
    exit;
}

try {
    // Ako je prosleđen ID, vrati specifičnu kategoriju za žurke
    if (isset($_GET['id'])) {
        $category_id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
        
        if (!$category_id || $category_id <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Nevaljan ID kategorije']);
            exit;
        }
        
        $stmt = $conn->prepare("SELECT id, name, image_url, is_party FROM categories WHERE id = ? AND is_party = TRUE");
        $stmt->bind_param("i", $category_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Kategorija za žurke nije pronađena']);
            exit;
        }
        
        $category = $result->fetch_assoc();
        echo json_encode([
            'success' => true,
            'category' => $category
        ]);
    } else {
        // Vrati sve kategorije za žurke (is_party = TRUE)
        $stmt = $conn->prepare("SELECT id, name, image_url, is_party FROM categories WHERE is_party = TRUE ORDER BY id ASC");
        $stmt->execute();
        $result = $stmt->get_result();
        
        $categories = [];
        while ($row = $result->fetch_assoc()) {
            $categories[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'categories' => $categories,
            'count' => count($categories)
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Greška na serveru: ' . $e->getMessage()]);
}

$conn->close();
?>
