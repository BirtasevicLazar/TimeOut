<?php

function uploadDrinkImage($file) {
    // Proveri da li je fajl uploadovan
    if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
        return ['success' => false, 'error' => 'Greška pri upload-u fajla'];
    }
    
    // Proveri tip fajla
    $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    $file_type = $file['type'];
    
    if (!in_array($file_type, $allowed_types)) {
        return ['success' => false, 'error' => 'Dozvoljen je samo upload slika (JPEG, PNG, GIF, WebP)'];
    }
    
    // Proveri veličinu fajla (max 5MB)
    $max_size = 5 * 1024 * 1024; // 5MB
    if ($file['size'] > $max_size) {
        return ['success' => false, 'error' => 'Slika ne može biti veća od 5MB'];
    }
    
    // Generiši jedinstveno ime fajla
    $file_extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $new_filename = uniqid('drink_') . '_' . time() . '.' . $file_extension;
    
    // Definiši putanje
    $upload_dir = __DIR__ . '/../uploads/drinks/';
    $file_path = $upload_dir . $new_filename;
    
    // Kreiranje direktorijuma ako ne postoji
    if (!is_dir($upload_dir)) {
        if (!mkdir($upload_dir, 0755, true)) {
            return ['success' => false, 'error' => 'Greška pri kreiranju upload direktorijuma'];
        }
    }
    
    // Premesti fajl
    if (move_uploaded_file($file['tmp_name'], $file_path)) {
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
