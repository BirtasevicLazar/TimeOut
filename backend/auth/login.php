<?php
require_once '../database/cors.php';
require_once '../database/db.php';
require_once '../utils/session.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metoda nije dozvoljena']);
    exit;
}

// Čitanje JSON podataka
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['username']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Username i password su obavezni']);
    exit;
}

$username = trim($input['username']);
$password = $input['password'];

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Username i password ne mogu biti prazni']);
    exit;
}

try {
    // Pronađi korisnika u bazi
    $stmt = $conn->prepare("SELECT id, username, password FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(401);
        echo json_encode(['error' => 'Neispravni podaci za login']);
        exit;
    }
    
    $user = $result->fetch_assoc();
    
    // Proveri password (pretpostavljam da je hash-ovan)
    if (!password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Neispravni podaci za login']);
        exit;
    }
    
    // Login uspešan
    login($user['id'], $user['username']);
    
    echo json_encode([
        'success' => true,
        'message' => 'Uspešno ste se ulogovali',
        'user' => [
            'id' => $user['id'],
            'username' => $user['username']
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Greška na serveru: ' . $e->getMessage()]);
}

$conn->close();
?>