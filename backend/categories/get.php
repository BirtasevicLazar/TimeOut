<?php
require_once '../database/cors.php';
require_once '../database/db.php';
require_once '../utils/session.php';

// GET operacije ne zahtevaju autentifikaciju - svi mogu da vide kategorije
// requireLogin(); // Uklonjen zahtev za login

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Metoda nije dozvoljena']);
    exit;
}

try {
    // Ako je prosleđen ID, vrati specifičnu kategoriju
    if (isset($_GET['id'])) {
        $category_id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
        
        if (!$category_id || $category_id <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Nevaljan ID kategorije']);
            exit;
        }
        
        $stmt = $conn->prepare("SELECT id, name FROM categories WHERE id = ?");
        $stmt->bind_param("i", $category_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Kategorija nije pronađena']);
            exit;
        }
        
        $category = $result->fetch_assoc();
        echo json_encode([
            'success' => true,
            'category' => $category
        ]);
    } else {
        // Vrati sve kategorije
        $stmt = $conn->prepare("SELECT id, name FROM categories ORDER BY name ASC");
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