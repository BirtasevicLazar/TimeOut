<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}


function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        http_response_code(401);
        echo json_encode(['error' => 'Nemate dozvolu za pristup. Morate biti ulogovani.']);
        exit;
    }
}

function login($user_id, $username) {
    $_SESSION['user_id'] = $user_id;
    $_SESSION['username'] = $username;
    // Regeneriši session ID radi bezbednosti
    regenerateSession();
}

function logout() {
    // Obriši sve session varijable
    $_SESSION = array();
    
    // Obriši session cookie ako postoji
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    
    // Uništi sesiju
    session_destroy();
}

function getCurrentUser() {
    if (!isLoggedIn()) {
        return null;
    }
    
    return [
        'id' => $_SESSION['user_id'],
        'username' => $_SESSION['username']
    ];
}

function regenerateSession() {
    // Regeneriši session ID radi bezbednosti
    session_regenerate_id(true);
}
?>