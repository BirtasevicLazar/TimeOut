<?php
require_once '../database/cors.php';
require_once '../utils/session.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Metoda nije dozvoljena']);
    exit;
}

// Debug info (može se ukloniti u produkciji)
error_log("me.php called - Session status: " . session_status() . ", Session ID: " . session_id());
error_log("Session data: " . print_r($_SESSION, true));

// Proveri da li je korisnik ulogovan
if (!isLoggedIn()) {
    error_log("User not logged in - Session user_id not set");
    http_response_code(401);
    echo json_encode(['error' => 'Niste ulogovani']);
    exit;
}

// Vrati podatke o trenutno ulogovanom korisniku
$user = getCurrentUser();

if ($user) {
    echo json_encode([
        'success' => true,
        'user' => $user,
        'message' => 'Uspešno autentifikovan'
    ]);
} else {
    // Ovo se neće desiti zbog provere gore, ali za svaki slučaj
    http_response_code(401);
    echo json_encode(['error' => 'Greška pri dobijanju podataka o korisniku']);
}
?>
