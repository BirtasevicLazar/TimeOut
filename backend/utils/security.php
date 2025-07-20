<?php

// Sigurnosni helper za input sanitization
function sanitizeInput($input, $type = 'string') {
    if ($input === null) {
        return null;
    }
    
    switch ($type) {
        case 'string':
            return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
        case 'int':
            return filter_var($input, FILTER_VALIDATE_INT);
        case 'float':
            return filter_var($input, FILTER_VALIDATE_FLOAT);
        case 'email':
            return filter_var(trim($input), FILTER_VALIDATE_EMAIL);
        case 'url':
            return filter_var(trim($input), FILTER_VALIDATE_URL);
        case 'filename':
            // Ukloni opasne karaktere iz imena fajla
            $safe = preg_replace('/[^a-zA-Z0-9._-]/', '', $input);
            return substr($safe, 0, 255);
        default:
            return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
    }
}

// CSRF token funkcije
function generateCSRFToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verifyCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// Rate limiting helper (opšta funkcija)
function checkGeneralRateLimit($action, $ip, $max_attempts = 10, $time_window = 300) {
    global $conn;
    
    $current_time = time();
    $cutoff_time = $current_time - $time_window;
    
    // Tabela za opšti rate limiting
    $conn->query("CREATE TABLE IF NOT EXISTS rate_limits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        action_type VARCHAR(50) NOT NULL,
        ip_address VARCHAR(45) NOT NULL,
        attempt_time INT NOT NULL,
        INDEX idx_action_ip_time (action_type, ip_address, attempt_time)
    )");
    
    // Cleanup starih pokušaja
    $stmt = $conn->prepare("DELETE FROM rate_limits WHERE attempt_time < ?");
    $stmt->bind_param("i", $cutoff_time);
    $stmt->execute();
    
    // Proveri broj pokušaja
    $stmt = $conn->prepare("SELECT COUNT(*) as attempts FROM rate_limits WHERE action_type = ? AND ip_address = ? AND attempt_time > ?");
    $stmt->bind_param("ssi", $action, $ip, $cutoff_time);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    
    if ($row['attempts'] >= $max_attempts) {
        return false;
    }
    
    // Logiraj pokušaj
    $stmt = $conn->prepare("INSERT INTO rate_limits (action_type, ip_address, attempt_time) VALUES (?, ?, ?)");
    $stmt->bind_param("ssi", $action, $ip, $current_time);
    $stmt->execute();
    
    return true;
}

// SQL injection dodatna zaštita
function logSQLInjectionAttempt($input, $ip) {
    $dangerous_patterns = [
        '/union\s+select/i',
        '/drop\s+table/i',
        '/insert\s+into/i',
        '/delete\s+from/i',
        '/update\s+.*\s+set/i',
        '/<script/i',
        '/javascript:/i'
    ];
    
    foreach ($dangerous_patterns as $pattern) {
        if (preg_match($pattern, $input)) {
            error_log("SECURITY: Possible SQL injection attempt from IP: $ip, Input: " . substr($input, 0, 100));
            return true;
        }
    }
    
    return false;
}

?>
