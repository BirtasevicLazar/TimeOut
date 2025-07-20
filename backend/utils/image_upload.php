<?php

function uploadDrinkImage($file) {
    // Proveri da li je fajl uploadovan
    if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
        return ['success' => false, 'error' => 'Greška pri upload-u fajla'];
    }
    
    // SIGURNOSNA PROVERA: Prvo proveri stvarni tip fajla, ne samo MIME
    $real_file_type = mime_content_type($file['tmp_name']);
    $allowed_mime_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!in_array($real_file_type, $allowed_mime_types)) {
        return ['success' => false, 'error' => 'Dozvoljen je samo upload pravih slika'];
    }
    
    // DODATNA SIGURNOST: Proveri da li je stvarno slika
    $image_info = getimagesize($file['tmp_name']);
    if ($image_info === false) {
        return ['success' => false, 'error' => 'Fajl nije valjna slika'];
    }
    
    // Proveri ekstenziju fajla
    $file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    if (!in_array($file_extension, $allowed_extensions)) {
        return ['success' => false, 'error' => 'Nepoznata ekstenzija fajla'];
    }
    
    // Proveri veličinu fajla (max 5MB)
    $max_size = 5 * 1024 * 1024; // 5MB
    if ($file['size'] > $max_size) {
        return ['success' => false, 'error' => 'Slika ne može biti veća od 5MB'];
    }
    
    // Generiši sigurno ime fajla (bez originalnog imena)
    $safe_extension = $file_extension === 'jpeg' ? 'jpg' : $file_extension;
    $new_filename = uniqid('drink_') . '_' . time() . '.' . $safe_extension;
    
    // Definiši putanje
    $upload_dir = __DIR__ . '/../uploads/drinks/';
    $file_path = $upload_dir . $new_filename;
    
    // SIGURNOST: Proveri da putanja ne izlazi iz upload direktorijuma
    $real_upload_dir = realpath($upload_dir);
    $real_file_path = realpath(dirname($file_path)) . '/' . basename($file_path);
    
    if (strpos($real_file_path, $real_upload_dir) !== 0) {
        return ['success' => false, 'error' => 'Nedozvoljena putanja fajla'];
    }
    
    // Kreiranje direktorijuma ako ne postoji
    if (!is_dir($upload_dir)) {
        if (!mkdir($upload_dir, 0755, true)) {
            return ['success' => false, 'error' => 'Greška pri kreiranju upload direktorijuma'];
        }
    }
    
    // Premesti fajl
    if (move_uploaded_file($file['tmp_name'], $file_path)) {
        // SIGURNOST: Promeni permisije fajla
        chmod($file_path, 0644);
        
        // Vrati relativnu putanju za bazu
        $relative_path = '/TimeOut/backend/uploads/drinks/' . $new_filename;
        return ['success' => true, 'image_url' => $relative_path, 'filename' => $new_filename];
    } else {
        return ['success' => false, 'error' => 'Greška pri čuvanju fajla'];
    }
}

function deleteDrinkImage($image_url) {
    if (empty($image_url)) {
        return true; // Nema slike za brisanje
    }
    
    // Izvuci ime fajla iz URL-a
    $filename = basename($image_url);
    $file_path = __DIR__ . '/../uploads/drinks/' . $filename;
    
    // Obriši fajl ako postoji
    if (file_exists($file_path)) {
        return unlink($file_path);
    }
    
    return true;
}

function validateImageFile($file) {
    // Osnovna validacija
    if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
        return false;
    }
    
    // Proveri da li je stvarno slika
    $image_info = getimagesize($file['tmp_name']);
    if ($image_info === false) {
        return false;
    }
    
    return true;
}

?>
