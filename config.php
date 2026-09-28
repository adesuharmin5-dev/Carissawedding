<?php
/**
 * ============================================================================
 * CARISSA PROFESIONAL MAKE UP ARTIST & WEDDING ORGANIZER
 * File Konfigurasi cPanel / Server (config.php)
 * ============================================================================
 * Anda dapat memilih 2 mode penyimpanan:
 * 1. MODE FLAT-FILE JSON (Default - Paling praktis, langsung jalan tanpa buat DB MySQL).
 * 2. MODE DATABASE MYSQL (Opsional - Jika ingin menggunakan phpMyAdmin / MySQL di cPanel).
 */

// ----------------------------------------------------------------------------
// 1. PENGATURAN KONEKSI DATABASE MYSQL (OPSIONAL)
// ----------------------------------------------------------------------------
// Jika ingin menggunakan MySQL di cPanel, ubah DB_ENABLED menjadi true dan
// isi data database yang Anda buat di menu 'MySQL Databases' cPanel.
define('DB_ENABLED', false); // Ubah ke true jika menggunakan MySQL
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'cpaneluser_carisadb');   // Contoh nama DB di cPanel
define('DB_USER', 'cpaneluser_carisauser'); // Contoh user DB di cPanel
define('DB_PASS', 'PasswordDatabaseAnda');  // Password user DB

// ----------------------------------------------------------------------------
// 2. PENGATURAN FLAT-FILE JSON (DEFAULT FALLBACK)
// ----------------------------------------------------------------------------
define('JSON_DB_FILE', __DIR__ . '/database.json');

// ----------------------------------------------------------------------------
// 3. PENGATURAN PROFIL STUDIO CARISSA
// ----------------------------------------------------------------------------
define('STUDIO_NAME', 'CARISSA PROFESIONAL MAKE UP ARTIST & WEDDING ORGANIZER');
define('STUDIO_PHONE', '081394218860');
define('STUDIO_IG', '@carissa.weddingorganizer');
define('STUDIO_BANK', 'BCA 2820321777 a.n Carissa Wedding / Mandiri 1300099887766');
define('STUDIO_ADDRESS', 'Jl. Cipasir Pancasila RT 03/09 Ds. Linggar Kec. Rancaekek Kab. Bandung');

/**
 * Mendapatkan koneksi PDO MySQL jika diaktifkan.
 * Otomatis mengembalikan null jika gagal sehingga sistem tetap aman menggunakan fallback JSON.
 */
function getDbConnection() {
    if (!defined('DB_ENABLED') || !DB_ENABLED) {
        return null;
    }

    try {
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]);
        return $pdo;
    } catch (PDOException $e) {
        // Log error secara internal dan lanjutkan dengan fallback JSON
        error_log("Koneksi MySQL Gagal: " . $e->getMessage());
        return null;
    }
}
