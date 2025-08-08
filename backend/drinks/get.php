<?php
require_once '../database/cors.php';
require_once '../database/db.php';
// require_once '../utils/session.php'; // Nije potrebno za javne GET operacije

// GET operacije ne zahtevaju autentifikaciju - svi mogu da vide pića
// requireLogin(); // Uklonjen zahtev za login

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Metoda nije dozvoljena']);
    exit;
}

try {
    // Ako je prosleđen ID, vrati specifično piće
    if (isset($_GET['id'])) {
        $drink_id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
        
        if (!$drink_id || $drink_id <= 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Nevaljan ID pića']);
            exit;
        }
        
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
        
        // Formatuj cenu
        $drink['price'] = $drink['price'] ? floatval($drink['price']) : null;
        
        echo json_encode([
            'success' => true,
            'drink' => $drink
        ]);
    } else {
        // Vrati sva pića sa opcionalnim filterom po kategoriji
        $category_filter = isset($_GET['category_id']) ? filter_var($_GET['category_id'], FILTER_VALIDATE_INT) : null;
        
        if ($category_filter) {
            $stmt = $conn->prepare("
                SELECT d.id, d.name, d.price, d.category_id, c.name as category_name
                FROM drinks d 
                LEFT JOIN categories c ON d.category_id = c.id 
                WHERE d.category_id = ?
                ORDER BY d.name ASC
            ");
            $stmt->bind_param("i", $category_filter);
        } else {
            $stmt = $conn->prepare("
                SELECT d.id, d.name, d.price, d.category_id, c.name as category_name
                FROM drinks d 
                LEFT JOIN categories c ON d.category_id = c.id 
                ORDER BY d.name ASC
            ");
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        
        $drinks = [];
        while ($row = $result->fetch_assoc()) {
            // Formatuj cenu
            $row['price'] = $row['price'] ? floatval($row['price']) : null;
            $drinks[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'drinks' => $drinks,
            'count' => count($drinks)
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Greška na serveru: ' . $e->getMessage()]);
}

$conn->close();
?>