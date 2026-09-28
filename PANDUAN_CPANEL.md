# 🚀 PANDUAN LENGKAP DEPLOYMENT CPANEL
## CARISSA PROFESIONAL MAKE UP ARTIST & WEDDING ORGANIZER

Dokumen ini berisi panduan resmi langkah demi langkah untuk mengonlinekan aplikasi **Carissa Makeup & Wedding Organizer Booking System** ke server hosting **cPanel** (Apache / LiteSpeed) dengan aman, stabil, dan cepat.

---

## 📌 DAFTAR ISI
1. [Pilihan Mode Penyimpanan (JSON vs MySQL)](#1-pilihan-mode-penyimpanan)
2. [Langkah 1: Siapkan File Aplikasi](#langkah-1-siapkan-file-aplikasi)
3. [Langkah 2: Upload & Ekstrak di File Manager cPanel](#langkah-2-upload--ekstrak-di-file-manager-cpanel)
4. [Langkah 3 (Opsional): Setup Database MySQL di cPanel](#langkah-3-opsional-setup-database-mysql-di-cpanel)
5. [Langkah 4: Pengaturan Versi PHP di cPanel](#langkah-4-pengaturan-versi-php-di-cpanel)
6. [Langkah 5: Aktivasi SSL Gratis (HTTPS)](#langkah-5-aktivasi-ssl-gratis-https)
7. [Langkah 6: Pengujian & Verifikasi Fitur](#langkah-6-pengujian--verifikasi-fitur)
8. [Troubleshooting & Solusi Kendala](#troubleshooting--solusi-kendala)

---

## 1. Pilihan Mode Penyimpanan

Aplikasi ini telah dilengkapi sistem **Dual-Engine**:

### A. Mode Flat-File JSON (Default - Paling Direkomendasikan & Praktis)
- **Kelebihan:** Langsung berjalan 100% setelah di-upload tanpa perlu membuat database MySQL atau phpMyAdmin.
- **File penyimpanan:** `database.json` (telah diproteksi penuh oleh `.htaccess` sehingga tidak bisa diintip atau diunduh oleh publik).
- **Pengaturan:** Biarkan `DB_ENABLED = false` di `config.php`.

### B. Mode Database MySQL (Opsional)
- **Kelebihan:** Data tersimpan dalam tabel database relasional standar industri.
- **Pengaturan:** Buat database di cPanel, import file `schema.sql`, lalu aktifkan `DB_ENABLED = true` di `config.php`.

---

## Langkah 1: Siapkan File Aplikasi

1. Buka folder proyek di komputer Anda:
   `g:\My Drive\Aplikasi\carisa-makeup-booking`
2. Pilih seluruh file berikut:
   - `admin.html` (Panel Admin Modern)
   - `booking.html` (Form Booking Klien)
   - `index.html` (Halaman Utama Klien)
   - `api.php` (REST API Engine cPanel)
   - `config.php` (Konfigurasi Studio & DB)
   - `.htaccess` (Pengaman & Routing URL)
   - `database.json` (Database awal)
   - `logo.png`, `carissa-header.png`, `carissa-logo-crop.jpg` (Aset Gambar)
   - `manifest.json`
   - *(File `server.js`, `package.json`, dan `node_modules` **TIDAK PERLU** di-upload jika menggunakan cPanel Shared Hosting biasa).*
3. Klik kanan file-file tersebut -> pilih **Compress to ZIP** (beri nama misal `carisa-cpanel.zip`).

---

## Langkah 2: Upload & Ekstrak di File Manager cPanel

1. Login ke panel hosting Anda: `https://namadomain.com:2083` atau URL cPanel yang diberikan penyedia hosting.
2. Pada menu cPanel, cari dan klik **File Manager**.
3. Masuk ke folder tujuan:
   - **Jika di domain utama (`https://namadomain.com/`):** Masuk ke folder `public_html`.
   - **Jika di subdomain (`https://booking.namadomain.com/`):** Masuk ke folder dokumen subdomain tersebut.
   - **Jika di subfolder (`https://namadomain.com/booking/`):** Buat folder baru bernama `booking` di dalam `public_html`, lalu masuk ke folder tersebut.
4. Klik tombol **Upload** di bilah atas.
5. Pilih atau drag-and-drop file `carisa-cpanel.zip` yang telah Anda buat di Langkah 1.
6. Setelah proses upload mencapai 100% (berwarna hijau), kembali ke File Manager.
7. Klik kanan pada file `carisa-cpanel.zip` -> pilih **Extract** -> konfirmasi **Extract File(s)**.
8. Pastikan file `.htaccess` ikut terekstrak. *(Jika tidak terlihat, klik tombol "Settings" di pojok kanan atas File Manager lalu centang "Show Hidden Files (dotfiles)").*
9. Hapus file `carisa-cpanel.zip` untuk menghemat ruang penyimpanan.

---

## Langkah 3 (Opsional): Setup Database MySQL di cPanel

> *Lewati langkah ini jika Anda memilih **Mode Flat-File JSON** (langsung jalan).*

Jika Anda ingin menggunakan database MySQL:
1. Di cPanel, buka menu **MySQL® Databases**.
2. **Buat Database Baru:**
   - Masukkan nama, misal `carisadb` (nama lengkap menjadi: `usernamecpanel_carisadb`).
   - Klik **Create Database**.
3. **Buat Pengguna Database (Add New User):**
   - Masukkan username, misal `carisauser`.
   - Buat password yang kuat dan catat password tersebut.
   - Klik **Create User**.
4. **Hubungkan User ke Database (Add User To Database):**
   - Pilih User dan Database yang baru dibuat.
   - Klik **Add**.
   - Centang opsi **ALL PRIVILEGES** -> klik **Make Changes**.
5. **Import Schema SQL:**
   - Kembali ke cPanel -> buka **phpMyAdmin**.
   - Klik nama database Anda di panel kiri.
   - Klik tab **Import** di bagian atas.
   - Klik **Choose File** -> pilih file `schema.sql`.
   - Gulir ke bawah lalu klik **Import / Go**.
6. **Hubungkan di `config.php`:**
   - Di File Manager, klik kanan `config.php` -> pilih **Edit**.
   - Ubah baris konfigurasi berikut:
     ```php
     define('DB_ENABLED', true);
     define('DB_HOST', 'localhost');
     define('DB_PORT', '3306');
     define('DB_NAME', 'usernamecpanel_carisadb');
     define('DB_USER', 'usernamecpanel_carisauser');
     define('DB_PASS', 'PasswordYangAndaBuatTadi');
     ```
   - Klik **Save Changes**.

---

## Langkah 4: Pengaturan Versi PHP di cPanel

1. Di cPanel, cari menu **MultiPHP Manager** atau **Select PHP Version**.
2. Pilih domain Anda, lalu pastikan versi PHP yang aktif adalah:
   - **PHP 8.1**, **PHP 8.2**, atau **PHP 8.3**.
3. Pastikan ekstensi PHP standar berikut aktif (umumnya sudah aktif secara default):
   - `pdo_mysql` (jika menggunakan MySQL)
   - `json`
   - `mbstring`
   - `curl`

---

## Langkah 5: Aktivasi SSL Gratis (HTTPS)

1. Di cPanel, cari menu **SSL/TLS Status**.
2. Centang nama domain Anda.
3. Klik tombol **Run AutoSSL**.
4. Tunggu 1–3 menit hingga muncul ikon gembok hijau di samping domain Anda. Sekarang situs Anda dapat diakses secara aman melalui `https://`.

---

## Langkah 6: Pengujian & Verifikasi Fitur

### 1. Uji Halaman Booking Klien
- Buka browser dan akses:
  `https://namadomainanda.com/` atau `https://namadomainanda.com/booking`
- Isi formulir pemesanan uji coba (nama pengantin, pilih paket, tanggal acara).
- Klik tombol **Simpan & Konfirmasi Pemesanan**.
- Pastikan kode booking (`CMS-YYYYMMDD-XXXX`) berhasil muncul bersama tombol WhatsApp dan Google Calendar.

### 2. Uji Panel Admin Modern & Layar Login Khusus
- Akses URL:
  `https://namadomainanda.com/admin`
- Halaman akan menampilkan **Layar Login Khusus Panel Admin** secara eksklusif (dashboard & data booking disembunyikan total sebelum login).
- **Kredensial Login Default:**
  - **Email:** `admin.carisamakeup@gmail.com`
  - **Kata Sandi / PIN:** `carissa123`
  - *(Tersedia juga tombol **Akses Cepat Berdasarkan Role** untuk login instan 1-klik sebagai Super Admin, Lead MUA & Owner, Admin CS, Staf Fitting, atau Finance).*
- Setelah berhasil login:
  - Dashboard modern dengan palet warna warm ivory `#FAF8F5` dan aksen terracotta `#9A5B3E` terbuka.
  - Kartu **Total Pemesanan**, **DP Diterima**, **Omset Kontrak**, dan **Piutang Pelunasan** tampil akurat dengan gaya *luxury warm editorial* tanpa gradien klise.
  - Kartu **Smart Operational Alerts** menampilkan pemberitahuan tagihan H-7 dan acara H-1 secara otomatis.
  - Kartu **Agenda Acara Terdekat** menampilkan hitung mundur (HARI INI / BESOK / H-X) beserta tombol pintas WhatsApp Klien.
  - Tombol **Keluar / Logout** di pojok kanan atas akan membersihkan sesi dan mengembalikan tampilan ke Form Login.

### 3. Uji Keamanan Database
- Coba buka URL ini di browser Anda:
  `https://namadomainanda.com/database.json`
- Hasil yang benar adalah: **403 Forbidden** (Akses Ditolak).
- Ini membuktikan bahwa file data klien Anda aman terlindungi oleh konfigurasi `.htaccess`.

---

## Troubleshooting & Solusi Kendala

| Kendala / Error | Penyebab | Solusi |
|---|---|---|
| **Error 404 saat akses `/admin` atau `/booking`** | Apache `mod_rewrite` belum aktif atau file `.htaccess` tidak ikut terupload. | Pastikan file `.htaccess` ada di folder utama aplikasi. Aktifkan fitur "Show Hidden Files" di File Manager cPanel. |
| **Data booking baru tidak tersimpan** | Izin penulisan folder (*write permission*) terbatas. | Di File Manager cPanel, pastikan permission folder aplikasi diset ke `755` dan file `database.json` diset ke `664` atau `644`. |
| **Error 500 Internal Server Error** | Kesalahan konfigurasi PHP atau versi PHP terlalu tua (< 7.4). | Buka MultiPHP Manager di cPanel dan ubah versi PHP ke `PHP 8.1` atau `8.2`. Cek file `error_log` di File Manager untuk melihat detail pesan. |
| **Koneksi MySQL Gagal** | Nama database atau password di `config.php` salah. | Buka `config.php`, cek kembali nama DB yang wajib memakai prefix cPanel (contoh: `user_carisadb`), atau ubah `DB_ENABLED = false` untuk langsung menggunakan mode JSON yang bebas error. |
