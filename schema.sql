-- ============================================================================
-- DATABASE SCHEMA: CARISSA PROFESIONAL MAKE UP ARTIST & WEDDING ORGANIZER
-- Compatible with: cPanel MySQL / MariaDB (phpMyAdmin)
-- ============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. TABEL PENGGUNA & ROLE SINKRONISASI KALENDER (MASTER USERS)
CREATE TABLE IF NOT EXISTS `master_users` (
    `id` VARCHAR(50) PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `role` VARCHAR(80) NOT NULL DEFAULT 'Super Admin',
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `phone` VARCHAR(50),
    `is_sync_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TABEL DAFTAR PAKET & PRICELIST (MASTER PACKAGES)
CREATE TABLE IF NOT EXISTS `master_packages` (
    `id` VARCHAR(50) PRIMARY KEY,
    `name` VARCHAR(180) NOT NULL,
    `category` VARCHAR(50) NOT NULL DEFAULT 'wedding',
    `package_type` VARCHAR(50) NOT NULL DEFAULT 'catering',
    `price` BIGINT NOT NULL DEFAULT 0,
    `description` TEXT,
    `sections_json` LONGTEXT,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TABEL DATA PEMESANAN & JADWAL (BOOKINGS)
CREATE TABLE IF NOT EXISTS `bookings` (
    `id` VARCHAR(50) PRIMARY KEY,
    `booking_code` VARCHAR(50) NOT NULL UNIQUE,
    `category` VARCHAR(50) NOT NULL DEFAULT 'wedding',
    `account_name` VARCHAR(150) NOT NULL,
    `client_cpp` VARCHAR(150),
    `client_cpw` VARCHAR(150) NOT NULL,
    `address` TEXT NOT NULL,
    `event_date` DATE NOT NULL,
    `event_time` VARCHAR(10) NOT NULL DEFAULT '08:00',
    `package_name` VARCHAR(180) NOT NULL,
    `total_price` BIGINT NOT NULL DEFAULT 0,
    `dp_amount` BIGINT NOT NULL DEFAULT 0,
    `payment_status` VARCHAR(30) NOT NULL DEFAULT 'pending',
    `hair_style` VARCHAR(50) NOT NULL DEFAULT 'Hijabdo',
    `instagram` VARCHAR(100),
    `phone` VARCHAR(100) NOT NULL,
    `notes` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TABEL DATA FITTING BUSANA PENGANTIN & ROMBONGAN (FITTINGS)
-- Ukuran baju: S, M, L, XL, XXL, XXXL
CREATE TABLE IF NOT EXISTS `fittings` (
    `id` VARCHAR(50) PRIMARY KEY,
    `fitting_code` VARCHAR(50),
    `event_hub_id` VARCHAR(50) NOT NULL DEFAULT '',
    `event_title` VARCHAR(200) NOT NULL DEFAULT '',
    `category` VARCHAR(40) NOT NULL DEFAULT 'cpw',
    `session_type` VARCHAR(40) NOT NULL DEFAULT 'Akad',
    `full_name` VARCHAR(150) NOT NULL,
    `nickname` VARCHAR(100),
    `phone` VARCHAR(100),
    `event_date` DATE,
    `address` TEXT,
    `ayah_cpw` VARCHAR(150),
    `ibu_cpw` VARCHAR(150),
    `ayah_cpp` VARCHAR(150),
    `ibu_cpp` VARCHAR(150),
    `item_name` VARCHAR(200) NOT NULL,
    `clothing_size` VARCHAR(20) NOT NULL DEFAULT 'L',
    `color_theme` VARCHAR(100),
    `notes` TEXT,
    `photo_url` LONGTEXT,
    `photos_json` LONGTEXT,
    `custom_fields_json` LONGTEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. TABEL DATA ACARA / REKANAN WO (WO EVENTS)
CREATE TABLE IF NOT EXISTS `wo_events` (
    `id` VARCHAR(50) PRIMARY KEY,
    `wo_name` VARCHAR(150) NOT NULL,
    `event_title` VARCHAR(200) NOT NULL,
    `client_cpw` VARCHAR(150),
    `client_cpp` VARCHAR(150),
    `event_date` DATE NOT NULL,
    `package_name` VARCHAR(200),
    `venue` TEXT,
    `phone` VARCHAR(100),
    `notes` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. TABEL DATA TRANSFER VENDOR (VENDOR TRANSFERS)
CREATE TABLE IF NOT EXISTS `vendor_transfers` (
    `id` VARCHAR(50) PRIMARY KEY,
    `source_category` VARCHAR(30) NOT NULL DEFAULT 'booking',
    `source_ref_id` VARCHAR(50),
    `wo_name` VARCHAR(150),
    `event_title` VARCHAR(200) NOT NULL,
    `event_date` DATE,
    `event_location` TEXT,
    `package_name` VARCHAR(200),
    `vendor_name` VARCHAR(150) NOT NULL,
    `vendor_category` VARCHAR(100) NOT NULL DEFAULT 'Vendor Lainnya',
    `bank_name` VARCHAR(100),
    `account_number` VARCHAR(100),
    `account_holder` VARCHAR(150),
    `transfer_date` DATE NOT NULL,
    `total_fee` BIGINT NOT NULL DEFAULT 0,
    `transfer_amount` BIGINT NOT NULL DEFAULT 0,
    `payment_status` VARCHAR(30) NOT NULL DEFAULT 'dp',
    `notes` TEXT,
    `proof_photo` LONGTEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. TABEL PENGATURAN STUDIO & KONTAK (STUDIO SETTINGS)
CREATE TABLE IF NOT EXISTS `studio_settings` (
    `setting_key` VARCHAR(100) PRIMARY KEY,
    `setting_value` LONGTEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. TABEL PENGINGAT OTOMATIS WEDDING & FITTING H-7 & H-1 (SUPER ADMIN & ROLE FITTING)
CREATE TABLE IF NOT EXISTS `fitting_reminders` (
    `id` VARCHAR(60) PRIMARY KEY,
    `event_hub_id` VARCHAR(60),
    `event_title` VARCHAR(200) NOT NULL,
    `event_date` DATE NOT NULL,
    `h7_date` DATE NOT NULL,
    `h1_date` DATE NOT NULL,
    `reminder_time` VARCHAR(10) DEFAULT '09:00',
    `event_location` TEXT,
    `fitting_user_id` VARCHAR(50),
    `fitting_user_name` VARCHAR(150) NOT NULL,
    `fitting_user_email` VARCHAR(150) NOT NULL,
    `fitting_user_phone` VARCHAR(50),
    `superadmin_user_id` VARCHAR(50),
    `superadmin_name` VARCHAR(150),
    `superadmin_email` VARCHAR(150),
    `superadmin_phone` VARCHAR(50),
    `checklist_items` TEXT,
    `status` VARCHAR(30) DEFAULT 'terjadwal',
    `notes` TEXT,
    `updated_at` VARCHAR(40),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. TABEL GOOGLE CALENDAR API v3 EVENTS (HARI-H, H-7, H-1 & MANUAL QUICKADD)
CREATE TABLE IF NOT EXISTS `gcal_v3_events` (
    `id` VARCHAR(80) PRIMARY KEY,
    `calendar_id` VARCHAR(80) NOT NULL DEFAULT 'primary',
    `summary` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `location` TEXT,
    `start_datetime` VARCHAR(50) NOT NULL,
    `end_datetime` VARCHAR(50) NOT NULL,
    `color_id` VARCHAR(10) DEFAULT '9',
    `attendees_json` LONGTEXT,
    `extended_props_json` LONGTEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. TABEL GOOGLE CALENDAR API v3 ACL RULES
CREATE TABLE IF NOT EXISTS `gcal_v3_acl` (
    `id` VARCHAR(120) PRIMARY KEY,
    `calendar_id` VARCHAR(80) NOT NULL DEFAULT 'primary',
    `scope_type` VARCHAR(30) NOT NULL DEFAULT 'user',
    `scope_value` VARCHAR(150) NOT NULL,
    `role` VARCHAR(30) NOT NULL DEFAULT 'writer',
    `user_name` VARCHAR(150),
    `app_role` VARCHAR(80),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- INITIAL SEED DATA (DATA AWAL SIAP PAKAI DI CPANEL PHPMYADMIN)
-- ============================================================================

INSERT IGNORE INTO `master_users` (`id`, `name`, `role`, `email`, `phone`, `is_sync_active`) VALUES
('usr_1', 'Carissa Owner', 'Super Admin', 'owner@carissawedding.com', '081394218860', 1),
('usr_2', 'Rina Oktaviani', 'Admin Booking & Keuangan', 'admin@carissawedding.com', '081394218861', 1),
('usr_3', 'Siti Aminah (Tim Fitting)', 'Admin Fitting & Busana', 'fitting.carisa@gmail.com', '081394218862', 1),
('usr_4', 'Dicky Pratama', 'Koordinator WO & Vendor', 'wo@carissawedding.com', '081394218863', 1);

INSERT IGNORE INTO `master_packages` (`id`, `name`, `category`, `package_type`, `price`, `description`) VALUES
('pkg_35jt', 'Paket 35jt (All-In Non-Catering)', 'wedding', 'non_catering', 35000000, 'Make Up & Attire CPW-CPP, 2 Ibu, 2 Bapak, 2 Pager Ayu, 2 Pager Bagus, Upacara Adat Lengser, MC Akad & Resepsi, Dekorasi Pelaminan 6m & Tenda, WO 4 Personel + 1 Manager, Dokumentasi Foto & Video, Prewedding Studio, Music Pop.'),
('pkg_mahameru', 'Paket Mahameru (28jt • 200 Pax)', 'wedding', 'catering', 28000000, 'Venue Gedung Mahameru + Catering 200 Pax, Make Up & Attire Lengkap, MC Akad & Resepsi, Music Akustik, WO 4 Personel, Dokumentasi All File + Kolase + Video Cinematic.'),
('pkg_lamaja', 'Paket La Maja Cicalengka (31.5jt • 100 Pax)', 'wedding', 'catering', 31500000, 'Venue La Maja Cicalengka + Catering 100 Pax, Make Up & Attire Lengkap, MC Akad & Resepsi, Music Akustik, WO, Dokumentasi.'),
('pkg_lptq', 'Paket LPTQ (35jt • 150 Pax)', 'wedding', 'catering', 35000000, 'Venue Gedung Aula LPTQ + Catering 150 Pax, Make Up & Attire Lengkap, MC Akad & Resepsi, Music Akustik, WO, Dokumentasi.'),
('pkg_selasih', 'Paket Selasih Cafe (36jt • 250 Pax)', 'wedding', 'catering', 36000000, 'Venue Selasih Cafe & Resto + Catering 250 Pax, Make Up & Attire Lengkap, MC Akad & Resepsi, Music Akustik, WO, Dokumentasi.'),
('pkg_ganesha', 'Paket Ganesha Cafe (36jt • 250 Pax)', 'wedding', 'catering', 36000000, 'Venue Ganesha Cafe Resto + Catering 250 Pax, Make Up & Attire Lengkap, MC Akad & Resepsi, Music Akustik, WO, Dokumentasi.'),
('pkg_meracik', 'Paket Meracik Cicalengka (37jt • 150 Pax)', 'wedding', 'catering', 37000000, 'Venue Meracik Coffee & Resto + Catering 150 Pax, Make Up & Attire Lengkap, MC Akad & Resepsi, Music Akustik, WO, Dokumentasi.'),
('pkg_kanaya', 'Paket Kanaya Cafe (40jt • 200 Pax)', 'wedding', 'catering', 40000000, 'Venue Kanaya Food & Culture Cafe + Catering 200 Pax, Make Up & Attire Lengkap, MC Akad & Resepsi, Music Akustik, WO, Dokumentasi.'),
('pkg_ponyo', 'Paket Ponyo Cinunuk Aula Atas (42jt • 150 Pax)', 'wedding', 'catering', 42000000, 'Venue Restoran Ponyo Cinunuk Aula Atas + Catering 150 Pax, Make Up & Attire Lengkap, MC Akad & Resepsi, Music Akustik, WO, Dokumentasi.'),
('pkg_20jt', 'Paket 20jt (Make Up, Attire, Dekorasi & Dokumentasi)', 'wedding', 'non_catering', 20000000, 'Make Up & Attire CPW-CPP, 2 Ibu, 2 Bapak, 2 Pager Ayu, 2 Pager Bagus, Dekorasi Pelaminan 6m, Dokumentasi Foto & Video, MC Akad & Resepsi.'),
('pkg_15jt', 'Paket 15jt (Make Up, Attire & Dekorasi Intimate)', 'wedding', 'non_catering', 15000000, 'Make Up & Attire Pengantin + Orang Tua, Dekorasi Backdrop 4m, Dokumentasi Foto Liputan.'),
('pkg_wisuda', 'Paket Wisuda / Graduation Flawless', 'reguler', 'non_catering', 750000, 'Make Up Flawless Tahan 12 Jam, Hijabdo / Hairdo Modern, Bulu Mata Premium & Softlens.'),
('pkg_lamaran', 'Paket Lamaran / Engagement Intimate', 'lamaran', 'non_catering', 2500000, 'Make Up Engagement Flawless, Hijabdo / Hairdo, Kebaya Lamaran Eksklusif + Beskap Pendamping.');

INSERT IGNORE INTO `studio_settings` (`setting_key`, `setting_value`) VALUES
('studio_name', 'CARISSA PROFESIONAL MAKE UP ARTIST & WEDDING ORGANIZER'),
('studio_wa', '081394218860'),
('studio_ig', '@carissa.weddingorganizer'),
('studio_address', 'Jl. Cipasir Pancasila RT 03/09 Ds. Linggar Kec. Rancaekek Kab. Bandung'),
('studio_bank', 'BCA 2820321777 a.n Carissa Wedding / Mandiri 1300099887766');

SET FOREIGN_KEY_CHECKS = 1;

