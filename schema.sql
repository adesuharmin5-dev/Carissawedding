-- ==============================================================
-- DATABASE SCHEMA: CARISSA PROFESIONAL MAKE UP ARTIST & WEDDING ORGANIZER
-- Compatible with: SQLite, PostgreSQL, MySQL, Supabase, Neon
-- ==============================================================

-- 1. TABEL PENGGUNA & EMAIL SINKRONISASI (MASTER USERS)
CREATE TABLE IF NOT EXISTS master_users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Admin',
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(50),
    is_sync_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABEL DAFTAR PAKET & PRICELIST (MASTER PACKAGES)
CREATE TABLE IF NOT EXISTS master_packages (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'wedding', -- wedding, reguler, lamaran, prewed
    price BIGINT NOT NULL DEFAULT 0,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABEL DATA PEMESANAN & JADWAL (BOOKINGS)
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(50) PRIMARY KEY,
    booking_code VARCHAR(50) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL DEFAULT 'wedding', -- wedding, reguler
    account_name VARCHAR(150) NOT NULL,
    client_cpp VARCHAR(150),
    client_cpw VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_time VARCHAR(10) NOT NULL DEFAULT '08:00',
    package_name VARCHAR(150) NOT NULL,
    total_price BIGINT NOT NULL DEFAULT 0,
    dp_amount BIGINT NOT NULL DEFAULT 0,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'pending', -- pending, dp, lunas, batal
    hair_style VARCHAR(50) NOT NULL DEFAULT 'hijabdo', -- hijabdo, hairdo, hijab_and_hairdo, makeup_only
    instagram VARCHAR(100),
    phone VARCHAR(100) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABEL DATA FITTING BUSANA PENGANTIN & ROMBONGAN (FITTINGS)
CREATE TABLE IF NOT EXISTS fittings (
    id VARCHAR(50) PRIMARY KEY,
    fitting_code VARCHAR(50) NOT NULL UNIQUE,
    event_hub_id VARCHAR(50) NOT NULL DEFAULT '', -- ID Penghubung Acara (Booking Code / Hub ID)
    event_title VARCHAR(200) NOT NULL DEFAULT '', -- Judul Acara (Project Title Penghubung)
    category VARCHAR(30) NOT NULL DEFAULT 'cpp', -- cpp, cpw, ortu_cpp, ortu_cpw, pager_ayu, pager_bagus
    full_name VARCHAR(150) NOT NULL,
    nickname VARCHAR(100) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    event_date DATE,
    address TEXT NOT NULL,
    father_name VARCHAR(150), -- Opsional
    mother_name VARCHAR(150), -- Opsional
    item_name VARCHAR(200) NOT NULL, -- Nama Baju / Busana
    clothing_size VARCHAR(50) NOT NULL DEFAULT 'M', -- Ukuran Baju (S, M, L, XL, XXL, Custom)
    color_theme VARCHAR(100), -- Warna / Tema Busana
    notes TEXT, -- Catatan Tambahan
    photo_url TEXT, -- Foto Utama Fitting Busana (Base64 / URL)
    photos_json TEXT, -- Daftar Foto Fitting Busana (JSON Array)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABEL DATA ACARA / REKANAN WO (WO EVENTS)
CREATE TABLE IF NOT EXISTS wo_events (
    id VARCHAR(50) PRIMARY KEY,
    wo_code VARCHAR(50) NOT NULL UNIQUE,
    wo_name VARCHAR(150) NOT NULL,
    event_title VARCHAR(200) NOT NULL,
    client_cpw VARCHAR(150),
    client_cpp VARCHAR(150),
    event_date DATE NOT NULL,
    package_name VARCHAR(200),
    address TEXT,
    phone VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABEL DATA TRANSFER VENDOR (VENDOR TRANSFERS - KATEGORI BOOKINGAN & WO)
CREATE TABLE IF NOT EXISTS vendor_transfers (
    id VARCHAR(50) PRIMARY KEY,
    transfer_code VARCHAR(50) NOT NULL UNIQUE,
    source_category VARCHAR(30) NOT NULL DEFAULT 'booking', -- 'booking' (Ambil dari Data Bookingan) atau 'wo' (Ambil dari WO)
    source_ref_id VARCHAR(50),
    source_ref_code VARCHAR(50),
    wo_name VARCHAR(150),
    event_title VARCHAR(200) NOT NULL,
    event_date DATE,
    event_location TEXT,
    package_name VARCHAR(200),
    vendor_name VARCHAR(150) NOT NULL,
    vendor_category VARCHAR(100) NOT NULL DEFAULT 'Vendor Lainnya',
    bank_name VARCHAR(100),
    account_number VARCHAR(100),
    account_holder VARCHAR(150),
    transfer_date DATE NOT NULL,
    total_fee BIGINT NOT NULL DEFAULT 0,
    transfer_amount BIGINT NOT NULL DEFAULT 0,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'dp', -- 'dp', 'termin', 'lunas'
    notes TEXT,
    proof_photo TEXT, -- Foto Bukti Transfer (Base64 / URL)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. TABEL PENGATURAN STUDIO & KONTAK (STUDIO SETTINGS)
CREATE TABLE IF NOT EXISTS studio_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT NOT NULL
);

-- 8. TABEL LOG NOTIFIKASI EMAIL & KALENDER
CREATE TABLE IF NOT EXISTS email_logs (
    id VARCHAR(50) PRIMARY KEY,
    to_email VARCHAR(150) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    log_type VARCHAR(50) NOT NULL, -- sync, h7, h1, booking_saved
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. TABEL REMINDER EVENT FITTING (GOOGLE KALENDER H-7 & H-1 UNTUK USER FITTING)
CREATE TABLE IF NOT EXISTS fitting_reminders (
    id VARCHAR(50) PRIMARY KEY,
    reminder_code VARCHAR(50) NOT NULL UNIQUE,
    event_hub_id VARCHAR(50),
    event_title VARCHAR(200) NOT NULL,
    event_date DATE NOT NULL,
    h7_date DATE NOT NULL,
    h1_date DATE NOT NULL,
    reminder_time VARCHAR(10) DEFAULT '09:00',
    event_location TEXT,
    fitting_user_id VARCHAR(50),
    fitting_user_name VARCHAR(150) NOT NULL,
    fitting_user_email VARCHAR(150) NOT NULL,
    fitting_user_phone VARCHAR(50),
    items_summary TEXT,
    notes_h7 TEXT,
    notes_h1 TEXT,
    h7_gcal_status VARCHAR(30) DEFAULT 'belum', -- 'belum', 'terjadwal', 'selesai'
    h1_gcal_status VARCHAR(30) DEFAULT 'belum', -- 'belum', 'terjadwal', 'selesai'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================
-- INITIAL SEED DATA (DATA AWAL)
-- ==============================================================

-- Data Awal Master Users
INSERT INTO master_users (id, name, role, email, phone, is_sync_active)
VALUES 
('usr_1', 'Admin Carissa (Official)', 'Super Admin', 'admin.carisamakeup@gmail.com', '089643574766', TRUE),
('usr_fitting', 'Staf Fitting Busana', 'Akses User (Khusus Fitting)', 'fitting.carisa@gmail.com', '083165107695', FALSE),
('usr_2', 'Carissa (Lead MUA & Owner)', 'Lead MUA & Owner', 'carisa.owner@gmail.com', '083165107695', FALSE),
('usr_3', 'Finance & Pembayaran DP', 'Finance & DP', 'keuangan.carisa@gmail.com', '081234567890', FALSE),
('usr_4', 'Rina (Asisten & Hijab Stylist)', 'Crew Makeup', 'asisten.carisa@gmail.com', '087811223344', FALSE)
ON CONFLICT (id) DO NOTHING;

-- Data Awal Master Packages (Pricelist Terintegrasi 13 Paket Lengkap)
INSERT INTO master_packages (id, name, category, price, description)
VALUES
('pkg_35jt', 'Paket 35jt (Wedding Complete Luxury All-In)', 'wedding', 35000000, 'Makeup & Busana Akad-Resepsi CPW & CPP, 2 Busana Ibu, 2 Beskap Bapak, 2 Pager Ayu, 2 Pager Bagus, Siger/Melati/Softlens/Nail Art/Henna, Upacara Adat Lengser (Abah-Ambu, 4 Penari, Baksa, Payung Agung, Rampak Kendang), MC Akad Resepsi, Dekorasi Pelaminan 6m & Tenda max 100m, WO 4 Personel + 1 Manager, Dokumentasi Magazine/GDrive/Cinematic, Prewedding Studio 2 Jam + Cetak 16R/4R, Live Music Pop (Vocal, Saxo/Key, Sound), Free Teks Izin Akad & Sign Duduk.'),
('pkg_mahameru', 'Paket Mahameru (Venue + Catering 200 Pax)', 'wedding', 28000000, 'Venue Gedung Mahameru, Catering 200 Pax (Prasmanan + Aneka Stall/Dessert), Makeup & Busana Akad-Resepsi CPW & CPP, Rias & Busana 2 Ibu, Busana 2 Bapak, 2 Pager Ayu & 2 Pager Bagus, Aksesoris & Melati Asli, MC Akad Resepsi, Live Music Akustik (Vocal, Key/Sax, Sound System), WO Hari H 4 Personel, Dokumentasi All File Foto + Video Cinematic + Album Kolase, Free Handbouquet, Teks Izin Akad, Henna & Nail Art.'),
('pkg_lamaja', 'Paket La Maja Cicalengka (Venue + Catering 100 Pax)', 'wedding', 31500000, 'Venue La Maja Cicalengka (6-8 Jam Penggunaan), Catering 100 Pax Buffet & Stall Pilihan, Makeup & Busana Akad-Resepsi CPW & CPP, Rias & Busana 2 Ibu, Busana 2 Bapak, 2 Pager Ayu & 2 Pager Bagus, Melati Asli, Softlens, Henna & Fake Nails, MC Akad Resepsi, Live Music Akustik + Sound System, WO Hari H, Dokumentasi Foto & Video Cinematic Highlight, Free Welcome Sign, Handbouquet & Buku Tamu.'),
('pkg_lptq', 'Paket LPTQ (Venue + Catering 150 Pax)', 'wedding', 35000000, 'Venue Gedung Aula LPTQ, Catering 150 Pax Menu Buffet Lengkap & Aneka Stall, Makeup & Busana Akad-Resepsi CPW & CPP, Rias & Busana 2 Ibu, Busana 2 Bapak, 2 Pager Ayu & 2 Pager Bagus, Siger/Melati/Softlens/Nail Art, MC Akad Resepsi, Live Music Akustik + Sound System, WO Hari H 5 Personel, Dokumentasi Foto & Video Cinematic Highlight, Free Handbouquet & Welcome Sign.'),
('pkg_selasih', 'Paket Selasih Cafe (Venue + Catering 250 Pax)', 'wedding', 36000000, 'Venue Selasih Cafe & Resto (Area Acara Lengkap), Catering 250 Pax Buffet Menu Nusantara & Aneka Stall, Makeup & Busana Akad-Resepsi CPW & CPP, Rias & Busana 2 Ibu, Busana 2 Bapak, 2 Pager Ayu & 2 Pager Bagus, Melati Asli & Softlens, MC Akad Resepsi, Live Music Akustik + Sound System, WO Hari H, Dokumentasi Foto & Video Cinematic Highlight, Free Handbouquet & Welcome Sign.'),
('pkg_ganesha', 'Paket Ganesha Cafe (Venue + Catering 250 Pax)', 'wedding', 36000000, 'Venue Ganesha Cafe Resto, Catering 250 Pax Prasmanan + Food Stall, Makeup & Busana Akad-Resepsi CPW & CPP, Rias & Busana 2 Ibu, Busana 2 Bapak, 2 Pager Ayu & 2 Pager Bagus, Melati Asli, Softlens & Henna Art, MC Akad Resepsi, Live Music Akustik + Sound System, WO Hari H, Dokumentasi Foto & Video Cinematic, Free Welcome Sign & Handbouquet.'),
('pkg_meracik', 'Paket Meracik Cicalengka (Venue + Catering 150 Pax)', 'wedding', 37000000, 'Venue Meracik Coffee & Resto Cicalengka, Catering 150 Pax Buffet Lengkap & Aneka Stall Kopi/Snack, Makeup & Busana Akad-Resepsi CPW & CPP, Rias & Busana 2 Ibu, Busana 2 Bapak, 2 Pager Ayu & 2 Pager Bagus, Melati Asli, Softlens, MC Akad Resepsi, Live Music Akustik + Sound System, WO Hari H 5 Personel, Dokumentasi Foto & Video Cinematic, Free Handbouquet & Welcome Sign.'),
('pkg_kanaya', 'Paket Kanaya Cafe (Venue + Catering 200 Pax)', 'wedding', 40000000, 'Venue Kanaya Food & Culture Cafe Bandung, Catering 200 Pax Buffet Menu Khas & Aneka Stall Favorit, Makeup & Busana Akad-Resepsi CPW & CPP, Rias & Busana 2 Ibu, Busana 2 Bapak, 2 Pager Ayu & 2 Pager Bagus, Melati Asli, Softlens & Nail Art, MC Akad Resepsi, Live Music Akustik + Sound System, WO Hari H 5 Personel, Dokumentasi Foto & Video Cinematic, Free Handbouquet, Teks Izin Akad & Welcome Sign.'),
('pkg_ponyo', 'Paket Ponyo Cinunuk Aula Atas (Venue + Catering 150 Pax)', 'wedding', 42000000, 'Venue Restoran Ponyo Cinunuk (Aula Atas), Catering 150 Pax Masakan Khas Tradisional Sunda Ponyo & Aneka Stall, Makeup & Busana Akad-Resepsi CPW & CPP, Rias & Busana 2 Ibu, Busana 2 Bapak, 2 Pager Ayu & 2 Pager Bagus, Siger/Melati/Softlens/Henna, MC Akad Resepsi, Live Music Akustik + Sound System, WO Hari H, Dokumentasi Foto & Video Cinematic Highlight, Free Handbouquet & Welcome Sign.'),
('pkg_1', 'Paket 20jt (Wedding Full Luxury)', 'wedding', 20000000, 'Makeup Akad & Resepsi Luxury, Hijabdo/Hairdo Pengantin, Rias & Busana 2 Ibu, Busana 2 Bapak, Melati Asli, Softlens, Aksesoris & Mahkota, Standby Retouch.'),
('pkg_2', 'Paket 15jt (Wedding Rose Gold)', 'wedding', 15000000, 'Makeup Akad & Resepsi, Hijabdo/Hairdo Pengantin, Rias 2 Ibu Pengantin, Melati Asli, Softlens, Aksesoris Standar.'),
('pkg_3', 'Paket Wisuda / Graduation Glam', 'reguler', 750000, 'Makeup Flawless Soft Glam, Hijabdo/Hairdo Wisuda, Softlens, Free Touch Up Kit Sachet.'),
('pkg_4', 'Paket Lamaran / Engagement Sweet', 'lamaran', 2500000, 'Makeup Lamaran Flawless HD, Hairdo/Hijabdo, Softlens & Fresh Flowers.')
ON CONFLICT (id) DO NOTHING;

-- Data Awal Pengaturan Studio
INSERT INTO studio_settings (setting_key, setting_value)
VALUES
('studio_name', 'CARISSA PROFESIONAL MAKE UP ARTIST & WEDDING ORGANIZER'),
('studio_wa', '6281394218860'),
('studio_wa_secondary', '6289643574766'),
('studio_ig', 'carissa.weddingorganizer'),
('studio_address', 'Jl. Cipasir Pancasila RT 03/09 Ds. Linggar Kec. Rancaekek Kab. Bandung'),
('studio_bank', 'BCA 1234-5678-90 a.n Carissa Makeup & Wedding Organizer'),
('active_sync_email', 'admin.carisamakeup@gmail.com')
ON CONFLICT (setting_key) DO NOTHING;

-- Data Awal Contoh Booking Sesuai Jadwal
INSERT INTO bookings (id, booking_code, category, account_name, client_cpp, client_cpw, address, event_date, event_time, package_name, total_price, dp_amount, payment_status, hair_style, instagram, phone)
VALUES
('booking_1', 'CMS-20261227-8942', 'wedding', 'Nopa Anggraeni', 'Recka syaba anugerah', 'Nopa Anggraeni', 'Kp Rancakihiang rt03 rw10', '2026-12-27', '08:00', 'Paket 20jt (Wedding Full Luxury)', 20000000, 5000000, 'dp', 'hijabdo', 'novaanggraeni59', '089643574766 / 083165107695')
ON CONFLICT (id) DO NOTHING;

-- Data Awal Contoh Fitting Busana 1 Rombongan Acara (Satu ID & Judul Penghubung)
INSERT INTO fittings (id, fitting_code, event_hub_id, event_title, category, full_name, nickname, phone, event_date, address, father_name, mother_name, item_name, clothing_size, color_theme, notes)
VALUES
('fit_1', 'FIT-20261227-001', 'CMS-20261227-8942', 'The Wedding of Recka & Nopa', 'cpp', 'Recka Syaba Anugerah', 'Recka', '083165107695', '2026-12-27', 'Kp Rancakihiang RT 03 RW 10, Rancaekek Bandung', 'Bpk. H. Asep Sunandar', 'Ibu Hj. Siti Nurjanah', 'Beskap Sunda Modern & Jas Akad Luxury', 'L', 'Rose Gold & Off White', 'Kancing cadangan disiapkan, selop bordir gold.'),
('fit_2', 'FIT-20261227-002', 'CMS-20261227-8942', 'The Wedding of Recka & Nopa', 'cpw', 'Nopa Anggraeni', 'Nopa', '089643574766', '2026-12-27', 'Kp Rancakihiang RT 03 RW 10, Rancaekek Bandung', 'Bpk. H. Endang Rukmana', 'Ibu Hj. Elis Maryati', 'Kebaya Pengantin Ekor Mewah & Gaun Resepsi Silk', 'M', 'Rose Gold & Pink Muda', 'Ekor gaun panjang 2 meter, manset senada disiapkan.'),
('fit_3', 'FIT-20261227-003', 'CMS-20261227-8942', 'The Wedding of Recka & Nopa', 'ortu_cpp', 'Bpk. H. Asep Sunandar & Ibu Hj. Siti', 'Ortu Recka (CPP)', '081234567890', '2026-12-27', 'Kp Rancakihiang RT 03 RW 10, Rancaekek Bandung', 'Bpk. H. Asep Sunandar', 'Ibu Hj. Siti Nurjanah', 'Beskap Tradisional Bapak & Kebaya Brokat Ibu CPP', 'XL / L', 'Mocca & Rose Gold', 'Bapak beskap warna mocca, ibu kebaya brokat senada.'),
('fit_4', 'FIT-20261227-004', 'CMS-20261227-8942', 'The Wedding of Recka & Nopa', 'ortu_cpw', 'Bpk. H. Endang Rukmana & Ibu Hj. Elis', 'Ortu Nopa (CPW)', '089643574766', '2026-12-27', 'Kp Rancakihiang RT 03 RW 10, Rancaekek Bandung', 'Bpk. H. Endang Rukmana', 'Ibu Hj. Elis Maryati', 'Beskap Bapak CPW & Kebaya Mewah Ibu CPW', 'L / M', 'Rose Gold & Pink Muda', 'Selop bapak no 41, ibu hak 3cm no 38.'),
('fit_5', 'FIT-20261227-005', 'CMS-20261227-8942', 'The Wedding of Recka & Nopa', 'pager_ayu', 'Salsa & Dinda (2 Pager Ayu)', 'Pager Ayu Tim 1', '087812345678', '2026-12-27', 'Rancaekek Bandung', '', 'Tim Penerima Tamu CPW', 'Kebaya Modern Pager Ayu & Rok Batik Katun (2 Set)', 'M (2 Set)', 'Pink Muda / Soft Rose', '2 Set lengkap dengan manset dan hijab pashmina.'),
('fit_6', 'FIT-20261227-006', 'CMS-20261227-8942', 'The Wedding of Recka & Nopa', 'pager_bagus', 'Dimas & Fajar (2 Pager Bagus)', 'Pager Bagus Tim 1', '085712345678', '2026-12-27', 'Rancaekek Bandung', '', 'Tim Penerima Tamu CPP', 'Beskap Standar Pager Bagus + Celana + Peci (2 Set)', 'L (2 Set)', 'Rose Gold & Mocca', '2 Set jas beskap, celana bahan dan kain samping jarik.')
ON CONFLICT (id) DO NOTHING;
