<?php

function uploadCategoryImage($file) {
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
    
    // Generiši bazu imena fajla
    $base_filename = uniqid('category_') . '_' . time();
    
    // Definiši putanje
    $upload_dir = __DIR__ . '/../uploads/categories/';
    
    // SIGURNOST: Kreiranje direktorijuma ako ne postoji
    if (!is_dir($upload_dir)) {
        if (!mkdir($upload_dir, 0755, true)) {
            return ['success' => false, 'error' => 'Greška pri kreiranju upload direktorijuma'];
        }
    }
    
    // Detektuj da li je GIF (potencijalno animiran) - ako jeste, NE konvertujemo (gubimo animaciju)
    $is_gif = ($real_file_type === 'image/gif');
    
    // Ako je već webp i nije GIF, samo ga premesti (rename)
    $shouldConvertToWebp = !$is_gif && $real_file_type !== 'image/webp';
    
    // Privremena putanja finalnog fajla (ako ne konvertujemo)
    $original_safe_ext = $file_extension === 'jpeg' ? 'jpg' : $file_extension;
    $target_original_path = $upload_dir . $base_filename . '.' . $original_safe_ext;
    
    // Finalna WebP putanja
    $target_webp_path = $upload_dir . $base_filename . '.webp';
    
    if (!$shouldConvertToWebp) {
        // Samo premesti original (gif ili već webp)
        if (!move_uploaded_file($file['tmp_name'], $shouldConvertToWebp ? $target_webp_path : ($real_file_type === 'image/webp' ? $target_webp_path : $target_original_path))) {
            return ['success' => false, 'error' => 'Greška pri čuvanju fajla'];
        }
        // Ako je već webp, obezbedi ispravno ime
        if ($real_file_type === 'image/webp') {
            chmod($target_webp_path, 0644);
            $relative_path = 'backend/uploads/categories/' . basename($target_webp_path);
        } else { // gif
            chmod($target_original_path, 0644);
            $relative_path = 'backend/uploads/categories/' . basename($target_original_path);
        }
        return ['success' => true, 'image_url' => $relative_path, 'filename' => basename($relative_path)];
    }
    
    // Pokušaj konverzije u WebP
    $imageResource = null;
    switch ($real_file_type) {
        case 'image/jpeg':
            $imageResource = imagecreatefromjpeg($file['tmp_name']);
            break;
        case 'image/png':
            $imageResource = imagecreatefrompng($file['tmp_name']);
            // Očuvaj transparenciju
            imagepalettetotruecolor($imageResource);
            imagealphablending($imageResource, true);
            imagesavealpha($imageResource, true);
            break;
        case 'image/webp':
            $imageResource = imagecreatefromwebp($file['tmp_name']);
            break;
        default:
            // Fallback: premesti bez konverzije
            if (!move_uploaded_file($file['tmp_name'], $target_original_path)) {
                return ['success' => false, 'error' => 'Greška pri čuvanju fajla'];
            }
            chmod($target_original_path, 0644);
            $relative_path = 'backend/uploads/categories/' . basename($target_original_path);
            return ['success' => true, 'image_url' => $relative_path, 'filename' => basename($relative_path)];
    }
    
    if (!$imageResource) {
        return ['success' => false, 'error' => 'Neuspešno učitavanje slike'];
    }
    
    // Konverzija u WebP (kvalitet 80)
    if (!imagewebp($imageResource, $target_webp_path, 80)) {
        imagedestroy($imageResource);
        return ['success' => false, 'error' => 'Neuspešna konverzija u WebP'];
    }
    imagedestroy($imageResource);
    
    chmod($target_webp_path, 0644);
    $relative_path = 'backend/uploads/categories/' . basename($target_webp_path);
    return ['success' => true, 'image_url' => $relative_path, 'filename' => basename($relative_path)];
}

function deleteCategoryImage($image_url) {
    if (empty($image_url)) {
        return true; // Nema slike za brisanje
    }
    
    // Izvuci ime fajla iz URL-a
    $filename = basename($image_url);
    $file_path = __DIR__ . '/../uploads/categories/' . $filename;
    
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
