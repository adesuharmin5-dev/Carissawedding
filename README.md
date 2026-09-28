# CARISSA PROFESIONAL MAKE UP ARTIST & WEDDING ORGANIZER

Aplikasi pemesanan mandiri untuk klien (*self-booking*) dan panel manajemen studio khusus admin untuk **CARISSA PROFESIONAL MAKE UP ARTIST & WEDDING ORGANIZER**, yang telah dipisahkan secara aman dan terstruktur agar **klien tidak memiliki akses ke dalam panel admin**.

---

## 🔒 Pemisahan Halaman (Client vs Admin):

### 1. 🌸 [Formulir Booking Klien (`booking.html` / `index.html`)](file:///g:/My%20Drive/Aplikasi/carisa-makeup-booking/booking.html)
- **Khusus Klien (Tanpa Login & Tanpa Tombol Admin)**:
  - Tampilan *mobile-first* yang mewah (*luxury editorial anti-slop design*).
  - Isian lengkap sesuai format booking:
    - Pilihan Kategori: 💍 **Wedding** (Pelunasan H-7) / ✨ **Reguler** (Pelunasan H-1).
    - Nama Rekening Pengirim DP.
    - Nama Calon Pengantin Pria (CPP) & Calon Pengantin Wanita (CPW).
    - Alamat Lengkap & Patokan Lokasi.
    - Tanggal Acara & Format Jam `<input type="time">`.
    - Pilihan Paket Dinamis (terhubung langsung dengan Master Pricelist).
    - Format Nominal Uang Koma 3 Digit Real-time (`20,000,000`).
    - Kebutuhan Hijabdo / Hairdo.
    - Akun Instagram & Nomor HP / WhatsApp Aktif.
    - Kalkulator Otomatis Nominal DP & Sisa Pelunasan.
    - Persetujuan Syarat & Ketentuan Studio.
  - **Setelah Submit**:
    - Menghasilkan Kode Unik Reservasi (`CMS-YYYYMMDD-XXXX`).
    - Animasi selebrasi confetti 🎉.
    - Tombol 1-klik **Kirim Format Booking Resmi ke WhatsApp Studio**.
    - Tombol 1-klik **Simpan ke Google Calendar Klien**.

---

### 2. 🛡️ [Panel Khusus Admin (`admin.html`)](file:///g:/My%20Drive/Aplikasi/carisa-makeup-booking/admin.html)
- **Diproteksi Login Email**:
  - Hanya dapat diakses oleh email yang terdaftar di **Master User**: Super Admin (`rissa.april@gmail.com`) dan Role Fitting (`fitting.carisa@gmail.com`).
- **Fitur Lengkap Panel Admin**:
  1. 🔍 **Filter & Rekap Periode Bulanan**: Pencarian instan untuk menghitung **Total Booking**, **Total DP Masuk**, **Total Omset**, dan **Sisa Pelunasan** untuk bulan dan tahun yang dipilih.
  2. 📋 **Daftar Booking & Status DP**: Tabel lengkap data pemesanan, pencarian klien/lokasi, ubah status DP (Belum DP, Sudah DP, Lunas, Batal), auto-parse chat WhatsApp, dan cetak invoice resmi.
  3. 👗 **Menu Fitting Busana & Rombongan (Satu ID & Judul Acara Terhubung)**:
     - Form input data ukuran busana untuk **CPP**, **CPW**, **Orang Tua CPP**, **Orang Tua CPW**, **Pager Ayu**, dan **Pager Bagus**.
     - Generator otomatis **⚡ Auto 1 Rombongan dari Paket**.
     - Fitur **1-Click Download PDF**: Lembar Fitting Resmi Individu & Rekap Rombongan 1 Acara Lengkap.
  4. 📅 **Kalender Interaktif**: Kalender visual bulanan dengan indikator warna status DP, detail event, dan export `.ICS` / Google Calendar.
  5. 🔔 **Pusat Reminder (H-7 & H-1)**:
     - Reminder **H-7 Wedding** untuk tagihan pelunasan & tips no treatment.
     - Reminder **H-1 Reguler** untuk pelunasan.
     - Reminder **H-1 Jadwal Besok** untuk kesiapan tim MUA dan klien dengan template WhatsApp siap kirim 1-klik.
  6. 💎 **Master 13 Pricelist & Venue Packages**: Tersinkronisasi dengan 16-halaman katalog PDF resmi (Venue Mahameru, La Maja, LPTQ, Selasih, Ganesha, Meracik, Kanaya, Ponyo Cinunuk + Paket 35jt All-In, 20jt, 15jt, Wisuda 750k, Lamaran 2.5jt). Dilengkapi fitur **Download PDF Dokumen Pricelist**.
  7. 👥 **Master User & Hak Akses Role**: Super Admin, Akses User (Khusus Fitting), Lead MUA & Owner, dan Finance DP.
  8. 💰 **Status DP & Laporan Keuangan**: Rekapitulasi pembayaran dan ekspor invoice ke format **PDF Resmi** serta `.CSV`.
  9. 🏢 **Setting Profil Studio & Backup Database**: Kelola profil studio, nomor WhatsApp admin (`081394218860`), alamat Jl. Cipasir Pancasila Rancaekek, rekening bank transfer DP, serta download/restore backup `.JSON`.

---

## 🚀 Cara Menjalankan

1. **Jalankan via Batch Launcher**:
   - Buka folder `G:\My Drive\Aplikasi\carisa-makeup-booking`.
   - Klik ganda pada [**`start-app.bat`**](file:///g:/My%20Drive/Aplikasi/carisa-makeup-booking/start-app.bat), lalu pilih:
     - Tekan `1` untuk membuka **Form Booking Klien**
     - Tekan `2` untuk membuka **Panel Admin**
     - Tekan `3` untuk menjalankan server Node.js

2. **Jalankan via Browser Langsung**:
   - Untuk Klien: Buka [**`booking.html`**](file:///g:/My%20Drive/Aplikasi/carisa-makeup-booking/booking.html) atau [**`index.html`**](file:///g:/My%20Drive/Aplikasi/carisa-makeup-booking/index.html).
   - Untuk Admin: Buka [**`admin.html`**](file:///g:/My%20Drive/Aplikasi/carisa-makeup-booking/admin.html).

3. **Jalankan Mode Server (Online / API)**:
   ```powershell
   npm.cmd start
   ```
   - Klien: `http://localhost:3000/` atau `http://localhost:3000/booking`
   - Admin: `http://localhost:3000/admin`
