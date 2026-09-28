/**
 * ==============================================================
 * CARISSA PROFESIONAL MAKE UP ARTIST & WEDDING ORGANIZER
 * ZERO-DEPENDENCY BACKEND REST API & STATIC SERVER
 * Powered by pure Node.js Standard Library (http, fs, path, url)
 * ==============================================================
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

// MIME types mapping
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

// ==============================================================
// DATABASE HELPER (PERSISTENT JSON STORAGE)
// ==============================================================
function getDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      studio_settings: {
        studio_name: 'CARISSA PROFESIONAL MAKE UP ARTIST & WEDDING ORGANIZER',
        studio_wa: '6281394218860',
        studio_wa_secondary: '6289643574766',
        studio_ig: 'carissa.weddingorganizer',
        studio_address: 'Jl. Cipasir Pancasila RT 03/09 Ds. Linggar Kec. Rancaekek Kab. Bandung',
        studio_bank: 'BCA 1234-5678-90 a.n Carissa Makeup & Wedding Organizer',
        active_sync_email: 'admin.carisamakeup@gmail.com'
      },
      master_users: [
        {
          id: 'usr_1',
          name: 'Admin Carissa (Official)',
          role: 'Super Admin',
          email: 'admin.carisamakeup@gmail.com',
          phone: '089643574766',
          isSyncActive: true
        },
        {
          id: 'usr_fitting',
          name: 'Staf Fitting Busana',
          role: 'Akses User (Khusus Fitting)',
          email: 'fitting.carisa@gmail.com',
          phone: '083165107695',
          isSyncActive: false
        },
        {
          id: 'usr_2',
          name: 'Carissa (Lead MUA & Owner)',
          role: 'Lead MUA & Owner',
          email: 'carisa.owner@gmail.com',
          phone: '083165107695',
          isSyncActive: false
        },
        {
          id: 'usr_3',
          name: 'Finance & Pembayaran DP',
          role: 'Finance & DP',
          email: 'keuangan.carisa@gmail.com',
          phone: '081234567890',
          isSyncActive: false
        }
      ],
      master_packages: [
        {
          id: 'pkg_35jt',
          name: 'Paket 35jt (Wedding Complete Luxury All-In)',
          category: 'wedding',
          price: 35000000,
          venue_type: 'custom',
          venue_name: 'Gedung / Rumah (Dekor 6m + Tenda 100m)',
          pax: 0,
          desc: 'Makeup & Busana Akad-Resepsi CPW & CPP, 2 Busana Ibu, 2 Beskap Bapak, 2 Pager Ayu, 2 Pager Bagus, Siger/Melati/Softlens/Nail Art/Henna, Upacara Adat Lengser (Abah-Ambu, 4 Penari, Baksa, Payung Agung, Rampak Kendang), MC Akad Resepsi, Dekorasi Pelaminan 6m & Tenda max 100m, WO 4 Personel + 1 Manager, Dokumentasi Magazine/GDrive/Cinematic, Prewedding Studio 2 Jam + Cetak 16R/4R, Live Music Pop (Vocal, Saxo/Key, Sound), Free Teks Izin Akad & Sign Duduk.'
        },
        {
          id: 'pkg_mahameru',
          name: 'Paket Mahameru (Venue + Catering 200 Pax)',
          category: 'wedding',
          price: 28000000,
          venue_type: 'venue',
          venue_name: 'Gedung / Aula Mahameru',
          pax: 200,
          desc: 'Venue Gedung Mahameru, Catering 200 Pax (Prasmanan + Aneka Stall/Dessert), Makeup & Busana Akad-Resepsi CPW & CPP, Rias & Busana 2 Ibu, Busana 2 Bapak, 2 Pager Ayu & 2 Pager Bagus, Aksesoris & Melati Asli, MC Akad Resepsi, Live Music Akustik (Vocal, Key/Sax, Sound System), WO Hari H 4 Personel, Dokumentasi All File Foto + Video Cinematic + Album Kolase, Free Handbouquet, Teks Izin Akad, Henna & Nail Art.'
        },
        {
          id: 'pkg_lamaja',
          name: 'Paket La Maja Cicalengka (Venue + Catering 100 Pax)',
          category: 'wedding',
          price: 31500000,
          venue_type: 'venue',
          venue_name: 'La Maja Cicalengka (Indoor / Semi-Outdoor)',
          pax: 100,
          desc: 'Venue La Maja Cicalengka (6-8 Jam Penggunaan), Catering 100 Pax Buffet & Stall Pilihan, Makeup & Busana Akad-Resepsi CPW & CPP, Rias & Busana 2 Ibu, Busana 2 Bapak, 2 Pager Ayu & 2 Pager Bagus, Melati Asli, Softlens, Henna & Fake Nails, MC Akad Resepsi, Live Music Akustik + Sound System, WO Hari H, Dokumentasi Foto & Video Cinematic Highlight, Free Welcome Sign, Handbouquet & Buku Tamu.'
        },
        {
          id: 'pkg_lptq',
          name: 'Paket LPTQ (Venue + Catering 150 Pax)',
          category: 'wedding',
          price: 35000000,
          venue_type: 'venue',
          venue_name: 'Gedung Aula LPTQ Bandung',
          pax: 150,
          desc: 'Venue Gedung Aula LPTQ, Catering 150 Pax Menu Buffet Lengkap & Aneka Stall, Makeup & Busana Akad-Resepsi CPW & CPP, Rias & Busana 2 Ibu, Busana 2 Bapak, 2 Pager Ayu & 2 Pager Bagus, Siger/Melati/Softlens/Nail Art, MC Akad Resepsi, Live Music Akustik + Sound System, WO Hari H 5 Personel, Dokumentasi Foto & Video Cinematic Highlight, Free Handbouquet & Welcome Sign.'
        },
        {
          id: 'pkg_selasih',
          name: 'Paket Selasih Cafe (Venue + Catering 250 Pax)',
          category: 'wedding',
          price: 36000000,
          venue_type: 'venue',
          venue_name: 'Selasih Cafe & Resto Bandung',
          pax: 250,
          desc: 'Venue Selasih Cafe & Resto (Area Acara Lengkap), Catering 250 Pax Buffet Menu Nusantara & Aneka Stall, Makeup & Busana Akad-Resepsi CPW & CPP, Rias & Busana 2 Ibu, Busana 2 Bapak, 2 Pager Ayu & 2 Pager Bagus, Melati Asli & Softlens, MC Akad Resepsi, Live Music Akustik + Sound System, WO Hari H, Dokumentasi Foto & Video Cinematic Highlight, Free Handbouquet & Welcome Sign.'
        },
        {
          id: 'pkg_ganesha',
          name: 'Paket Ganesha Cafe (Venue + Catering 250 Pax)',
          category: 'wedding',
          price: 36000000,
          venue_type: 'venue',
          venue_name: 'Ganesha Cafe Resto',
          pax: 250,
          desc: 'Venue Ganesha Cafe Resto, Catering 250 Pax Prasmanan + Food Stall, Makeup & Busana Akad-Resepsi CPW & CPP, Rias & Busana 2 Ibu, Busana 2 Bapak, 2 Pager Ayu & 2 Pager Bagus, Melati Asli, Softlens & Henna Art, MC Akad Resepsi, Live Music Akustik + Sound System, WO Hari H, Dokumentasi Foto & Video Cinematic, Free Welcome Sign & Handbouquet.'
        },
        {
          id: 'pkg_meracik',
          name: 'Paket Meracik Cicalengka (Venue + Catering 150 Pax)',
          category: 'wedding',
          price: 37000000,
          venue_type: 'venue',
          venue_name: 'Meracik Coffee & Resto Cicalengka',
          pax: 150,
          desc: 'Venue Meracik Coffee & Resto Cicalengka, Catering 150 Pax Buffet Lengkap & Aneka Stall Kopi/Snack, Makeup & Busana Akad-Resepsi CPW & CPP, Rias & Busana 2 Ibu, Busana 2 Bapak, 2 Pager Ayu & 2 Pager Bagus, Melati Asli, Softlens, MC Akad Resepsi, Live Music Akustik + Sound System, WO Hari H 5 Personel, Dokumentasi Foto & Video Cinematic, Free Handbouquet & Welcome Sign.'
        },
        {
          id: 'pkg_kanaya',
          name: 'Paket Kanaya Cafe (Venue + Catering 200 Pax)',
          category: 'wedding',
          price: 40000000,
          venue_type: 'venue',
          venue_name: 'Kanaya Food & Culture Cafe Bandung',
          pax: 200,
          desc: 'Venue Kanaya Food & Culture Cafe Bandung, Catering 200 Pax Buffet Menu Khas & Aneka Stall Favorit, Makeup & Busana Akad-Resepsi CPW & CPP, Rias & Busana 2 Ibu, Busana 2 Bapak, 2 Pager Ayu & 2 Pager Bagus, Melati Asli, Softlens & Nail Art, MC Akad Resepsi, Live Music Akustik + Sound System, WO Hari H 5 Personel, Dokumentasi Foto & Video Cinematic, Free Handbouquet, Teks Izin Akad & Welcome Sign.'
        },
        {
          id: 'pkg_ponyo',
          name: 'Paket Ponyo Cinunuk Aula Atas (Venue + Catering 150 Pax)',
          category: 'wedding',
          price: 42000000,
          venue_type: 'venue',
          venue_name: 'Restoran Ponyo Cinunuk (Aula Atas)',
          pax: 150,
          desc: 'Venue Restoran Ponyo Cinunuk (Aula Atas), Catering 150 Pax Masakan Khas Tradisional Sunda Ponyo & Aneka Stall, Makeup & Busana Akad-Resepsi CPW & CPP, Rias & Busana 2 Ibu, Busana 2 Bapak, 2 Pager Ayu & 2 Pager Bagus, Siger/Melati/Softlens/Henna, MC Akad Resepsi, Live Music Akustik + Sound System, WO Hari H, Dokumentasi Foto & Video Cinematic Highlight, Free Handbouquet & Welcome Sign.'
        },
        {
          id: 'pkg_1',
          name: 'Paket 20jt (Wedding Full Luxury)',
          category: 'wedding',
          price: 20000000,
          venue_type: 'mua',
          venue_name: 'Rumah / Gedung Sendiri',
          pax: 0,
          desc: 'Makeup Akad & Resepsi Luxury, Hijabdo/Hairdo Pengantin, Rias & Busana 2 Ibu, Busana 2 Bapak, Melati Asli, Softlens, Aksesoris & Mahkota, Standby Retouch.'
        },
        {
          id: 'pkg_2',
          name: 'Paket 15jt (Wedding Rose Gold)',
          category: 'wedding',
          price: 15000000,
          venue_type: 'mua',
          venue_name: 'Rumah / Gedung Sendiri',
          pax: 0,
          desc: 'Makeup Akad & Resepsi, Hijabdo/Hairdo Pengantin, Rias 2 Ibu Pengantin, Melati Asli, Softlens, Aksesoris Standar.'
        },
        {
          id: 'pkg_3',
          name: 'Paket Wisuda / Graduation Glam',
          category: 'reguler',
          price: 750000,
          venue_type: 'reguler',
          venue_name: 'Studio / Lokasi Acara',
          pax: 0,
          desc: 'Makeup Flawless Soft Glam, Hijabdo/Hairdo Wisuda, Softlens, Free Touch Up Kit Sachet.'
        },
        {
          id: 'pkg_4',
          name: 'Paket Lamaran / Engagement Sweet',
          category: 'wedding',
          price: 2500000,
          venue_type: 'lamaran',
          venue_name: 'Rumah / Cafe Resto',
          pax: 0,
          desc: 'Makeup Lamaran Flawless HD, Hairdo/Hijabdo, Softlens & Fresh Flowers.'
        }
      ],
      bookings: [
        {
          id: 'booking_1',
          booking_code: 'CMS-20261227-8942',
          category: 'wedding',
          account_name: 'Nopa Anggraeni',
          client_cpp: 'Recka syaba anugerah',
          client_cpw: 'Nopa Anggraeni',
          address: 'Kp Rancakihiang rt03 rw10',
          event_date: '2026-12-27',
          event_time: '08:00',
          package_name: 'Paket 20jt (Wedding Full Luxury)',
          total_price: 20000000,
          dp_amount: 5000000,
          payment_status: 'dp',
          hair_style: 'hijabdo',
          instagram: 'novaanggraeni59',
          phone: '089643574766 / 083165107695',
          created_at: new Date().toISOString()
        }
      ],
      fittings: [
        {
          id: 'fit_1',
          fitting_code: 'FIT-20261227-001',
          event_hub_id: 'CMS-20261227-8942',
          event_title: 'The Wedding of Recka & Nopa',
          category: 'cpp',
          full_name: 'Recka Syaba Anugerah',
          nickname: 'Recka',
          phone: '083165107695',
          event_date: '2026-12-27',
          address: 'Kp Rancakihiang RT 03 RW 10, Rancaekek Bandung',
          father_name: 'Bpk. H. Asep Sunandar',
          mother_name: 'Ibu Hj. Siti Nurjanah',
          item_name: 'Beskap Sunda Modern & Jas Akad Luxury',
          clothing_size: 'L',
          color_theme: 'Rose Gold & Off White',
          notes: 'Kancing cadangan disiapkan, selop bordir gold.',
          created_at: new Date().toISOString()
        },
        {
          id: 'fit_2',
          fitting_code: 'FIT-20261227-002',
          event_hub_id: 'CMS-20261227-8942',
          event_title: 'The Wedding of Recka & Nopa',
          category: 'cpw',
          full_name: 'Nopa Anggraeni',
          nickname: 'Nopa',
          phone: '089643574766',
          event_date: '2026-12-27',
          address: 'Kp Rancakihiang RT 03 RW 10, Rancaekek Bandung',
          father_name: 'Bpk. H. Endang Rukmana',
          mother_name: 'Ibu Hj. Elis Maryati',
          item_name: 'Kebaya Pengantin Ekor Mewah & Gaun Resepsi Silk',
          clothing_size: 'M',
          color_theme: 'Rose Gold & Pink Muda',
          notes: 'Ekor gaun panjang 2 meter, manset senada disiapkan.',
          created_at: new Date().toISOString()
        },
        {
          id: 'fit_3',
          fitting_code: 'FIT-20261227-003',
          event_hub_id: 'CMS-20261227-8942',
          event_title: 'The Wedding of Recka & Nopa',
          category: 'ortu_cpp',
          full_name: 'Bpk. H. Asep Sunandar & Ibu Hj. Siti',
          nickname: 'Ortu Recka (CPP)',
          phone: '081234567890',
          event_date: '2026-12-27',
          address: 'Kp Rancakihiang RT 03 RW 10, Rancaekek Bandung',
          father_name: 'Bpk. H. Asep Sunandar',
          mother_name: 'Ibu Hj. Siti Nurjanah',
          item_name: 'Beskap Tradisional Bapak & Kebaya Brokat Ibu CPP',
          clothing_size: 'XL / L',
          color_theme: 'Mocca & Rose Gold',
          notes: 'Bapak beskap warna mocca, ibu kebaya brokat senada.',
          created_at: new Date().toISOString()
        },
        {
          id: 'fit_4',
          fitting_code: 'FIT-20261227-004',
          event_hub_id: 'CMS-20261227-8942',
          event_title: 'The Wedding of Recka & Nopa',
          category: 'ortu_cpw',
          full_name: 'Bpk. H. Endang Rukmana & Ibu Hj. Elis',
          nickname: 'Ortu Nopa (CPW)',
          phone: '089643574766',
          event_date: '2026-12-27',
          address: 'Kp Rancakihiang RT 03 RW 10, Rancaekek Bandung',
          father_name: 'Bpk. H. Endang Rukmana',
          mother_name: 'Ibu Hj. Elis Maryati',
          item_name: 'Beskap Bapak CPW & Kebaya Mewah Ibu CPW',
          clothing_size: 'L / M',
          color_theme: 'Rose Gold & Pink Muda',
          notes: 'Selop bapak no 41, ibu hak 3cm no 38.',
          created_at: new Date().toISOString()
        },
        {
          id: 'fit_5',
          fitting_code: 'FIT-20261227-005',
          event_hub_id: 'CMS-20261227-8942',
          event_title: 'The Wedding of Recka & Nopa',
          category: 'pager_ayu',
          full_name: 'Salsa & Dinda (2 Pager Ayu)',
          nickname: 'Pager Ayu Tim 1',
          phone: '087812345678',
          event_date: '2026-12-27',
          address: 'Rancaekek Bandung',
          father_name: '',
          mother_name: 'Tim Penerima Tamu CPW',
          item_name: 'Kebaya Modern Pager Ayu & Rok Batik Katun (2 Set)',
          clothing_size: 'M (2 Set)',
          color_theme: 'Pink Muda / Soft Rose',
          notes: '2 Set lengkap dengan manset dan hijab pashmina.',
          created_at: new Date().toISOString()
        },
        {
          id: 'fit_6',
          fitting_code: 'FIT-20261227-006',
          event_hub_id: 'CMS-20261227-8942',
          event_title: 'The Wedding of Recka & Nopa',
          category: 'pager_bagus',
          full_name: 'Dimas & Fajar (2 Pager Bagus)',
          nickname: 'Pager Bagus Tim 1',
          phone: '085712345678',
          event_date: '2026-12-27',
          address: 'Rancaekek Bandung',
          father_name: '',
          mother_name: 'Tim Penerima Tamu CPP',
          item_name: 'Beskap Standar Pager Bagus + Celana + Peci (2 Set)',
          clothing_size: 'L (2 Set)',
          color_theme: 'Rose Gold & Mocca',
          notes: '2 Set jas beskap, celana bahan dan kain samping jarik.',
          created_at: new Date().toISOString()
        }
      ],
      wo_events: [
        {
          id: 'wo_1',
          wo_code: 'WO-20261220-101',
          wo_name: 'Carissa Wedding Organizer (Project WO)',
          event_title: 'The Wedding of Aditya & Citra',
          client_cpw: 'Citra Kirana',
          client_cpp: 'Aditya Pratama',
          event_date: '2026-12-20',
          package_name: 'Paket Meracik Cicalengka (Venue + Catering 150 Pax)',
          address: 'Meracik Coffee & Resto Cicalengka',
          phone: '081234567890',
          created_at: new Date().toISOString()
        }
      ],
      vendor_transfers: [
        {
          id: 'vtr_1',
          transfer_code: 'TRF-20261227-001',
          source_category: 'booking',
          source_ref_id: 'booking_1',
          source_ref_code: 'CMS-20261227-8942',
          wo_name: 'Data Bookingan Carissa',
          event_title: 'Nopa Anggraeni & Recka syaba anugerah',
          event_date: '2026-12-27',
          event_location: 'Kp Rancakihiang rt03 rw10',
          package_name: 'Paket 20jt (Wedding Full Luxury)',
          vendor_name: 'Tim Dekorasi & Tenda Luxury',
          vendor_category: 'Dekorasi & Tenda',
          bank_name: 'BCA',
          account_number: '4321-8899-00',
          account_holder: 'Hendra Dekorasi',
          transfer_date: '2026-09-26',
          total_fee: 5000000,
          transfer_amount: 2500000,
          payment_status: 'dp',
          notes: 'DP 50% Dekorasi Pelaminan untuk acara Nopa & Recka',
          proof_photo: '',
          created_at: new Date().toISOString()
        },
        {
          id: 'vtr_2',
          transfer_code: 'TRF-20261220-002',
          source_category: 'wo',
          source_ref_id: 'wo_1',
          source_ref_code: 'WO-20261220-101',
          wo_name: 'Carissa Wedding Organizer (Project WO)',
          event_title: 'The Wedding of Aditya & Citra',
          event_date: '2026-12-20',
          event_location: 'Meracik Coffee & Resto Cicalengka',
          package_name: 'Paket Meracik Cicalengka (Venue + Catering 150 Pax)',
          vendor_name: 'Meracik Coffee & Resto Catering',
          vendor_category: 'Venue & Catering',
          bank_name: 'Mandiri',
          account_number: '1300-0998-8776',
          account_holder: 'CV Meracik Cicalengka',
          transfer_date: '2026-09-26',
          total_fee: 15000000,
          transfer_amount: 15000000,
          payment_status: 'lunas',
          notes: 'Pelunasan Venue & Catering 150 Pax Job WO',
          proof_photo: '',
          created_at: new Date().toISOString()
        }
      ],
      fitting_reminders: [
        {
          id: 'frem_1',
          reminder_code: 'REM-FIT-20261227-001',
          event_hub_id: 'CMS-20261227-8942',
          event_title: 'The Wedding of Recka & Nopa',
          event_date: '2026-12-27',
          h7_date: '2026-12-20',
          h1_date: '2026-12-26',
          reminder_time: '09:00',
          event_location: 'Kp Rancakihiang RT 03 RW 10, Rancaekek Bandung',
          fitting_user_id: 'usr_fitting',
          fitting_user_name: 'Staf Fitting Busana',
          fitting_user_email: 'fitting.carisa@gmail.com',
          fitting_user_phone: '083165107695',
          items_summary: 'CPW: Kebaya Pengantin Ekor Mewah (M) | CPP: Beskap Sunda Modern (L) | Ortu CPW & CPP | Pager Ayu & Bagus',
          notes_h7: 'H-7: Cek kelengkapan seluruh kebaya CPW, beskap CPP, busana orang tua, ukuran akhir & aksesoris.',
          notes_h1: 'H-1: Steam akhir busana, packing plastik garmen, serah terima/loading busana siap dibawa ke lokasi acara.',
          h7_gcal_status: 'terjadwal',
          h1_gcal_status: 'terjadwal',
          created_at: new Date().toISOString()
        }
      ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  let modified = false;
  if (!data.fittings) {
    data.fittings = [];
    modified = true;
  }
  if (!data.wo_events) {
    data.wo_events = [];
    modified = true;
  }
  if (!data.vendor_transfers) {
    data.vendor_transfers = [];
    modified = true;
  }
  if (!data.fitting_reminders) {
    data.fitting_reminders = [
      {
        id: 'frem_1',
        reminder_code: 'REM-FIT-20261227-001',
        event_hub_id: 'CMS-20261227-8942',
        event_title: 'The Wedding of Recka & Nopa',
        event_date: '2026-12-27',
        h7_date: '2026-12-20',
        h1_date: '2026-12-26',
        reminder_time: '09:00',
        event_location: 'Kp Rancakihiang RT 03 RW 10, Rancaekek Bandung',
        fitting_user_id: 'usr_fitting',
        fitting_user_name: 'Staf Fitting Busana',
        fitting_user_email: 'fitting.carisa@gmail.com',
        fitting_user_phone: '083165107695',
        items_summary: 'CPW: Kebaya Pengantin Ekor Mewah (M) | CPP: Beskap Sunda Modern (L) | Ortu CPW & CPP | Pager Ayu & Bagus',
        notes_h7: 'H-7: Cek kelengkapan seluruh kebaya CPW, beskap CPP, busana orang tua, ukuran akhir & aksesoris.',
        notes_h1: 'H-1: Steam akhir busana, packing plastik garmen, serah terima/loading busana siap dibawa ke lokasi acara.',
        h7_gcal_status: 'terjadwal',
        h1_gcal_status: 'terjadwal',
        created_at: new Date().toISOString()
      }
    ];
    modified = true;
  }
  if ( syncAppToGoogleCalendarV3(data) ) {
    modified = true;
  }
  if (modified) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  }
  return data;
}

function saveDatabase(data) {
  syncAppToGoogleCalendarV3(data);
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  const cfg = data?.studio_settings?.gcal_api_config;
  if (cfg && cfg.access_token && cfg.auto_sync !== false) {
    const calId = cfg.calendar_id || 'primary';
    const evList = (data?.google_calendar_v3?.events && data.google_calendar_v3.events['primary']) || [];
    evList.slice(0, 10).forEach(ev => {
      callRemoteGoogleCalendarApi(
        'POST',
        `/calendars/${encodeURIComponent(calId)}/events`,
        cfg.access_token,
        cfg.api_key || '',
        {
          summary: ev.summary,
          description: ev.description,
          location: ev.location,
          colorId: ev.colorId,
          start: ev.start,
          end: ev.end,
          attendees: ev.attendees,
          reminders: ev.reminders
        }
      ).catch(() => {});
    });
  }
}

// ==============================================================
// GOOGLE CALENDAR API v3 ENGINE & SYNCHRONIZATION
// Reference: https://developers.google.com/workspace/calendar/api/v3/reference
// Resource Types: Acl, CalendarList, Calendars, Channels, Colors, Events, Freebusy, Settings
// ==============================================================
const GCAL_V3_COLORS = {
  kind: 'calendar#colors',
  updated: '2026-09-26T00:00:00.000Z',
  calendar: {
    '1': { background: '#ac725e', foreground: '#1d1d1d' },
    '2': { background: '#d06b64', foreground: '#1d1d1d' },
    '3': { background: '#f83a22', foreground: '#1d1d1d' },
    '4': { background: '#fa573c', foreground: '#1d1d1d' },
    '5': { background: '#ff7537', foreground: '#1d1d1d' },
    '6': { background: '#ffad46', foreground: '#1d1d1d' },
    '9': { background: '#4986e7', foreground: '#1d1d1d' },
    '10': { background: '#16a765', foreground: '#1d1d1d' },
    '11': { background: '#9a5b3e', foreground: '#ffffff' }
  },
  event: {
    '1': { background: '#a4bdfc', foreground: '#1d1d1d', label: 'Lavender' },
    '2': { background: '#7ae7bf', foreground: '#1d1d1d', label: 'Sage' },
    '3': { background: '#dbadff', foreground: '#1d1d1d', label: 'Grape' },
    '4': { background: '#ff887c', foreground: '#1d1d1d', label: 'Flamingo' },
    '5': { background: '#fbd75b', foreground: '#1d1d1d', label: 'Banana' },
    '6': { background: '#ffb878', foreground: '#1d1d1d', label: 'Tangerine (Reminder H-1)' },
    '7': { background: '#46d6db', foreground: '#1d1d1d', label: 'Peacock' },
    '8': { background: '#e1e1e1', foreground: '#1d1d1d', label: 'Graphite' },
    '9': { background: '#5484ed', foreground: '#ffffff', label: 'Blueberry (Reminder H-7)' },
    '10': { background: '#51b749', foreground: '#ffffff', label: 'Basil (Booking Reguler)' },
    '11': { background: '#dc2127', foreground: '#ffffff', label: 'Tomato (Hari-H Wedding)' }
  }
};

function computeOffsetDateServer(dateStr, offsetDays) {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return dateStr;
  const dt = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  dt.setUTCDate(dt.getUTCDate() + offsetDays);
  return dt.toISOString().split('T')[0];
}

function buildGoogleWebRenderUrl(ev) {
  const startRaw = ev.start?.dateTime || ev.start?.date || '';
  const endRaw = ev.end?.dateTime || ev.end?.date || '';
  const toCompact = iso => iso.replace(/[-:]/g, '').replace(/\.\d+/, '').slice(0, 15);
  const datesParam = startRaw ? `${toCompact(startRaw)}/${toCompact(endRaw || startRaw)}` : '';
  const attendeesCsv = Array.isArray(ev.attendees) ? ev.attendees.map(a => a.email).filter(Boolean).join(',') : '';
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ev.summary || '')}&dates=${encodeURIComponent(datesParam)}&details=${encodeURIComponent(ev.description || '')}&location=${encodeURIComponent(ev.location || '')}${attendeesCsv ? `&add=${encodeURIComponent(attendeesCsv)}` : ''}`;
}

function syncAppToGoogleCalendarV3(db) {
  let changed = false;
  if (!db.studio_settings) db.studio_settings = {};
  if (!db.studio_settings.gcal_api_config) {
    db.studio_settings.gcal_api_config = {
      calendar_id: 'primary',
      secondary_calendar_id: 'fitting.carisa@gmail.com',
      client_id: '',
      api_key: '',
      access_token: '',
      auto_sync: true,
      time_zone: 'Asia/Jakarta',
      last_synced_at: new Date().toISOString()
    };
    changed = true;
  }

  const users = Array.isArray(db.master_users) ? db.master_users : [];
  const superAdmin = users.find(u => (u.role || '').toLowerCase().includes('super admin')) || {
    id: 'usr_1',
    name: 'Admin Carissa (Super Admin)',
    role: 'Super Admin',
    email: 'admin.carisamakeup@gmail.com'
  };
  const fittingUsers = users.filter(u => (u.role || '').toLowerCase().includes('fitting'));
  const fittingUser = fittingUsers[0] || {
    id: 'usr_fitting',
    name: 'Staf Fitting Busana',
    role: 'Akses User (Khusus Fitting)',
    email: 'fitting.carisa@gmail.com'
  };

  if (!db.google_calendar_v3) {
    db.google_calendar_v3 = {
      calendars: {},
      calendarList: [],
      acl: {},
      events: {},
      settings: [
        { kind: 'calendar#setting', id: 'timezone', value: 'Asia/Jakarta' },
        { kind: 'calendar#setting', id: 'locale', value: 'id' },
        { kind: 'calendar#setting', id: 'format24HourTime', value: 'true' },
        { kind: 'calendar#setting', id: 'defaultEventLength', value: '120' },
        { kind: 'calendar#setting', id: 'weekStart', value: '0' },
        { kind: 'calendar#setting', id: 'autoAddHangouts', value: 'false' }
      ],
      channels: []
    };
    changed = true;
  }

  const gcal = db.google_calendar_v3;
  const primaryCalId = 'primary';
  const fittingCalId = 'fitting.carisa@gmail.com';

  // 1. Ensure Calendars & CalendarList resources
  if (!gcal.calendars[primaryCalId]) {
    gcal.calendars[primaryCalId] = {
      kind: 'calendar#calendar',
      id: primaryCalId,
      summary: db.studio_settings.studio_name || 'CARISSA MUA & Wedding Organizer (Utama)',
      description: 'Kalender Utama Jadwal Booking Hari-H, Reminder H-7 & H-1 Wedding & Fitting Carissa MUA & WO',
      location: db.studio_settings.studio_address || 'Bandung',
      timeZone: 'Asia/Jakarta'
    };
    changed = true;
  }
  if (!gcal.calendars[fittingCalId]) {
    gcal.calendars[fittingCalId] = {
      kind: 'calendar#calendar',
      id: fittingCalId,
      summary: 'Carissa Fitting Busana & Reminder H-7 / H-1 Wedding',
      description: 'Kalender Khusus Super Admin & Role Fitting (Otomatis H-7 & H-1 setiap ada Booking Wedding)',
      location: db.studio_settings.studio_address || 'Bandung',
      timeZone: 'Asia/Jakarta'
    };
    changed = true;
  }

  if (!Array.isArray(gcal.calendarList) || gcal.calendarList.length === 0) {
    gcal.calendarList = [
      {
        kind: 'calendar#calendarListEntry',
        id: primaryCalId,
        summary: gcal.calendars[primaryCalId].summary,
        description: gcal.calendars[primaryCalId].description,
        location: gcal.calendars[primaryCalId].location,
        timeZone: 'Asia/Jakarta',
        colorId: '11',
        backgroundColor: '#9a5b3e',
        foregroundColor: '#ffffff',
        selected: true,
        accessRole: 'owner',
        primary: true,
        defaultReminders: [
          { method: 'email', minutes: 1440 },
          { method: 'popup', minutes: 60 }
        ]
      },
      {
        kind: 'calendar#calendarListEntry',
        id: fittingCalId,
        summary: gcal.calendars[fittingCalId].summary,
        description: gcal.calendars[fittingCalId].description,
        location: gcal.calendars[fittingCalId].location,
        timeZone: 'Asia/Jakarta',
        colorId: '9',
        backgroundColor: '#4986e7',
        foregroundColor: '#ffffff',
        selected: true,
        accessRole: 'writer',
        primary: false,
        defaultReminders: [
          { method: 'email', minutes: 1440 },
          { method: 'popup', minutes: 30 }
        ]
      }
    ];
    changed = true;
  }

  // 2. Synchronize ACL rules (Super Admin = owner, Role Fitting = writer, other staff = reader)
  if (!gcal.acl[primaryCalId]) gcal.acl[primaryCalId] = [];
  const existingAcl = gcal.acl[primaryCalId];
  const requiredUsers = [
    { email: superAdmin.email, role: 'owner', name: superAdmin.name, appRole: 'Super Admin' },
    { email: fittingUser.email, role: 'writer', name: fittingUser.name, appRole: fittingUser.role },
    ...users.map(u => ({
      email: u.email,
      role: (u.role || '').toLowerCase().includes('super admin')
        ? 'owner'
        : (u.role || '').toLowerCase().includes('fitting')
          ? 'writer'
          : 'reader',
      name: u.name,
      appRole: u.role
    }))
  ];

  requiredUsers.forEach(ru => {
    if (!ru.email) return;
    const ruleId = `user:${ru.email.toLowerCase()}`;
    const idx = existingAcl.findIndex(r => r.id === ruleId || (r.scope && r.scope.value === ru.email));
    if (idx === -1) {
      existingAcl.push({
        kind: 'calendar#aclRule',
        etag: `"acl-${Date.now()}"`,
        id: ruleId,
        scope: { type: 'user', value: ru.email },
        role: ru.role,
        userName: ru.name,
        appRole: ru.appRole
      });
      changed = true;
    } else if (existingAcl[idx].role !== ru.role) {
      existingAcl[idx].role = ru.role;
      existingAcl[idx].userName = ru.name;
      existingAcl[idx].appRole = ru.appRole;
      changed = true;
    }
  });

  // 3. Ensure Wedding Bookings automatically generate fitting_reminders (H-7 & H-1)
  if (!Array.isArray(db.fitting_reminders)) db.fitting_reminders = [];
  const bookingsList = Array.isArray(db.bookings) ? db.bookings : [];
  bookingsList.forEach(b => {
    if ((b.category || '').toLowerCase() === 'wedding' && b.payment_status !== 'batal') {
      const wTitle = b.client_cpp && b.client_cpp !== '-'
        ? `The Wedding of ${b.client_cpp} & ${b.client_cpw}`
        : `The Wedding of ${b.client_cpw}`;
      const existingRem = db.fitting_reminders.find(r =>
        (b.booking_code && r.event_hub_id === b.booking_code) ||
        r.event_hub_id === b.id ||
        (r.event_title || '').toLowerCase() === wTitle.toLowerCase()
      );
      const h7Date = computeOffsetDateServer(b.event_date, -7);
      const h1Date = computeOffsetDateServer(b.event_date, -1);
      if (!existingRem) {
        const dateCode = (b.event_date || '').replace(/-/g, '');
        db.fitting_reminders.unshift({
          id: 'frem_' + b.id,
          reminder_code: `REM-WED-${dateCode}-${Math.floor(100 + Math.random() * 900)}`,
          event_hub_id: b.booking_code || b.id,
          event_title: wTitle,
          event_date: b.event_date,
          h7_date: h7Date,
          h1_date: h1Date,
          reminder_time: b.event_time || '09:00',
          event_location: b.address || '',
          superadmin_email: superAdmin.email,
          recipient_emails: `${superAdmin.email},${fittingUser.email}`,
          fitting_user_id: fittingUser.id,
          fitting_user_name: fittingUser.name,
          fitting_user_email: fittingUser.email,
          fitting_user_phone: fittingUser.phone || '',
          items_summary: `Paket: ${b.package_name || 'Wedding'}`,
          notes_h7: 'H-7 Wedding: Super Admin cek pelunasan & konfirmasi klien; Role Fitting cek kelengkapan kebaya CPW, beskap CPP, busana orang tua & ukuran akhir.',
          notes_h1: 'H-1 Wedding: Super Admin konfirmasi kesiapan tim rias; Role Fitting final steam busana, packing garmen & loading serah terima busana.',
          h7_gcal_status: 'terjadwal',
          h1_gcal_status: 'terjadwal',
          created_at: new Date().toISOString()
        });
        changed = true;
      } else {
        existingRem.event_date = b.event_date || existingRem.event_date;
        existingRem.h7_date = h7Date;
        existingRem.h1_date = h1Date;
        existingRem.superadmin_email = superAdmin.email;
        existingRem.fitting_user_email = existingRem.fitting_user_email || fittingUser.email;
      }
    }
  });

  // Also ensure WO events generate fitting_reminders (H-7 & H-1)
  const woList = Array.isArray(db.wo_events) ? db.wo_events : [];
  woList.forEach(w => {
    if (!w.event_title || !w.event_date) return;
    const existingRem = db.fitting_reminders.find(r =>
      (w.wo_code && r.event_hub_id === w.wo_code) ||
      r.event_hub_id === w.id ||
      (r.event_title || '').toLowerCase() === (w.event_title || '').toLowerCase()
    );
    if (!existingRem) {
      const dateCode = (w.event_date || '').replace(/-/g, '');
      db.fitting_reminders.push({
        id: 'frem_' + w.id,
        reminder_code: `REM-WED-${dateCode}-${Math.floor(100 + Math.random() * 900)}`,
        event_hub_id: w.wo_code || w.id,
        event_title: w.event_title,
        event_date: w.event_date,
        h7_date: computeOffsetDateServer(w.event_date, -7),
        h1_date: computeOffsetDateServer(w.event_date, -1),
        reminder_time: '09:00',
        event_location: w.address || '',
        superadmin_email: superAdmin.email,
        recipient_emails: `${superAdmin.email},${fittingUser.email}`,
        fitting_user_id: fittingUser.id,
        fitting_user_name: fittingUser.name,
        fitting_user_email: fittingUser.email,
        fitting_user_phone: fittingUser.phone || '',
        items_summary: `Paket WO: ${w.package_name || 'Wedding Organizer'}`,
        notes_h7: 'H-7 Wedding: Super Admin cek pelunasan & konfirmasi klien; Role Fitting cek kelengkapan kebaya CPW, beskap CPP, busana orang tua & ukuran akhir.',
        notes_h1: 'H-1 Wedding: Super Admin konfirmasi kesiapan tim rias; Role Fitting final steam busana, packing garmen & loading serah terima busana.',
        h7_gcal_status: 'terjadwal',
        h1_gcal_status: 'terjadwal',
        created_at: new Date().toISOString()
      });
      changed = true;
    }
  });

  // 4. Synchronize Events Resource (/calendars/primary/events)
  if (!Array.isArray(gcal.events[primaryCalId])) gcal.events[primaryCalId] = [];
  const manualEvents = gcal.events[primaryCalId].filter(ev =>
    ev.extendedProperties?.private?.source === 'manual_gcal_v3'
  );

  const syncedEvents = [];
  const attendeesSuperAndFitting = [
    {
      email: superAdmin.email,
      displayName: `${superAdmin.name} (Super Admin)`,
      organizer: true,
      responseStatus: 'accepted'
    },
    {
      email: fittingUser.email,
      displayName: `${fittingUser.name} (Role Fitting)`,
      responseStatus: 'accepted'
    }
  ];

  // 4A. Sync Booking Hari-H events
  bookingsList.forEach(b => {
    if (b.payment_status === 'batal' || !b.event_date) return;
    const isWedding = (b.category || '').toLowerCase() === 'wedding';
    const startClock = (b.event_time || '08:00').slice(0, 5);
    const startHour = parseInt(startClock.split(':')[0], 10) || 8;
    const endHour = String(Math.min(23, startHour + (isWedding ? 6 : 3))).padStart(2, '0');
    const endClock = `${endHour}:${startClock.split(':')[1] || '00'}`;

    const coupleTitle = isWedding && b.client_cpp && b.client_cpp !== '-'
      ? `The Wedding of ${b.client_cpp} & ${b.client_cpw}`
      : b.client_cpw;

    const evObj = {
      kind: 'calendar#event',
      id: `gcal_harih_${b.id}`,
      status: 'confirmed',
      created: b.created_at || new Date().toISOString(),
      updated: new Date().toISOString(),
      summary: isWedding
        ? `[HARI-H WEDDING] ${coupleTitle} (${b.package_name || 'Wedding'})`
        : `[RIAS REGULER] ${b.client_cpw} (${b.package_name || 'Reguler'})`,
      description: [
        `Kode Booking: ${b.booking_code || b.id}`,
        `Kategori: ${(b.category || 'wedding').toUpperCase()}`,
        `Klien: ${coupleTitle}`,
        `Paket: ${b.package_name || '-'}`,
        `Status Pembayaran: ${(b.payment_status || 'dp').toUpperCase()}`,
        `No. WA: ${b.phone || '-'}`
      ].join('\n'),
      location: b.address || db.studio_settings.studio_address || 'Bandung',
      colorId: isWedding ? '11' : '10',
      creator: { email: superAdmin.email, displayName: superAdmin.name },
      organizer: { email: superAdmin.email, displayName: superAdmin.name, self: true },
      start: { dateTime: `${b.event_date}T${startClock}:00+07:00`, timeZone: 'Asia/Jakarta' },
      end: { dateTime: `${b.event_date}T${endClock}:00+07:00`, timeZone: 'Asia/Jakarta' },
      iCalUID: `${b.id}@carissawedding.com`,
      attendees: isWedding ? attendeesSuperAndFitting : [attendeesSuperAndFitting[0]],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 1440 },
          { method: 'popup', minutes: 120 },
          { method: 'popup', minutes: 30 }
        ]
      },
      extendedProperties: {
        private: {
          source: 'app_booking',
          booking_id: b.id,
          booking_code: b.booking_code || '',
          event_type: isWedding ? 'wedding_hari_h' : 'reguler_hari_h'
        }
      }
    };
    evObj.htmlLink = buildGoogleWebRenderUrl(evObj);
    syncedEvents.push(evObj);
  });

  // 4B. Sync H-7 & H-1 Wedding Reminders for Super Admin & Role Fitting
  db.fitting_reminders.forEach(rem => {
    const h7Date = rem.h7_date || computeOffsetDateServer(rem.event_date, -7);
    const h1Date = rem.h1_date || computeOffsetDateServer(rem.event_date, -1);
    const remClock = (rem.reminder_time || '09:00').slice(0, 5);
    const remHour = parseInt(remClock.split(':')[0], 10) || 9;
    const remEndClock = `${String(Math.min(23, remHour + 2)).padStart(2, '0')}:${remClock.split(':')[1] || '00'}`;

    const evH7 = {
      kind: 'calendar#event',
      id: `gcal_h7_${rem.id}`,
      status: 'confirmed',
      created: rem.created_at || new Date().toISOString(),
      updated: new Date().toISOString(),
      summary: `[REMINDER H-7 WEDDING & FITTING] ${rem.event_title}`,
      description: [
        `Pengingat Otomatis H-7 Wedding (Super Admin & Role Fitting)`,
        `Acara Wedding: ${rem.event_title}`,
        `Tanggal Hari-H: ${rem.event_date}`,
        `Penerima: Super Admin (${superAdmin.email}) & Role Fitting (${rem.fitting_user_email || fittingUser.email})`,
        `Rincian: ${rem.items_summary || '-'}`,
        `Tugas H-7: ${rem.notes_h7 || '-'}`
      ].join('\n'),
      location: rem.event_location || db.studio_settings.studio_address || 'Bandung',
      colorId: '9',
      creator: { email: superAdmin.email, displayName: superAdmin.name },
      organizer: { email: superAdmin.email, displayName: superAdmin.name, self: true },
      start: { dateTime: `${h7Date}T${remClock}:00+07:00`, timeZone: 'Asia/Jakarta' },
      end: { dateTime: `${h7Date}T${remEndClock}:00+07:00`, timeZone: 'Asia/Jakarta' },
      iCalUID: `${rem.id}-h7@carissawedding.com`,
      attendees: attendeesSuperAndFitting,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 1440 },
          { method: 'popup', minutes: 60 },
          { method: 'popup', minutes: 30 }
        ]
      },
      extendedProperties: {
        private: {
          source: 'app_wedding_reminder',
          reminder_id: rem.id,
          event_hub_id: rem.event_hub_id || '',
          event_type: 'wedding_h7'
        }
      }
    };
    evH7.htmlLink = buildGoogleWebRenderUrl(evH7);

    const evH1 = {
      kind: 'calendar#event',
      id: `gcal_h1_${rem.id}`,
      status: 'confirmed',
      created: rem.created_at || new Date().toISOString(),
      updated: new Date().toISOString(),
      summary: `[REMINDER H-1 WEDDING & FITTING] ${rem.event_title}`,
      description: [
        `Pengingat Otomatis H-1 Wedding (Super Admin & Role Fitting)`,
        `Acara Wedding: ${rem.event_title}`,
        `Tanggal Hari-H: ${rem.event_date}`,
        `Penerima: Super Admin (${superAdmin.email}) & Role Fitting (${rem.fitting_user_email || fittingUser.email})`,
        `Rincian: ${rem.items_summary || '-'}`,
        `Tugas H-1: ${rem.notes_h1 || '-'}`
      ].join('\n'),
      location: rem.event_location || db.studio_settings.studio_address || 'Bandung',
      colorId: '6',
      creator: { email: superAdmin.email, displayName: superAdmin.name },
      organizer: { email: superAdmin.email, displayName: superAdmin.name, self: true },
      start: { dateTime: `${h1Date}T${remClock}:00+07:00`, timeZone: 'Asia/Jakarta' },
      end: { dateTime: `${h1Date}T${remEndClock}:00+07:00`, timeZone: 'Asia/Jakarta' },
      iCalUID: `${rem.id}-h1@carissawedding.com`,
      attendees: attendeesSuperAndFitting,
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 720 },
          { method: 'popup', minutes: 60 },
          { method: 'popup', minutes: 15 }
        ]
      },
      extendedProperties: {
        private: {
          source: 'app_wedding_reminder',
          reminder_id: rem.id,
          event_hub_id: rem.event_hub_id || '',
          event_type: 'wedding_h1'
        }
      }
    };
    evH1.htmlLink = buildGoogleWebRenderUrl(evH1);

    syncedEvents.push(evH7, evH1);
  });

  // 4C. Sync WO Events (Hari-H Project WO)
  woList.forEach(w => {
    if (!w.event_date) return;
    const evWo = {
      kind: 'calendar#event',
      id: `gcal_wo_${w.id}`,
      status: 'confirmed',
      created: w.created_at || new Date().toISOString(),
      updated: new Date().toISOString(),
      summary: `[HARI-H WO] ${w.event_title || w.wo_code || 'Acara WO'} (${w.wo_name || 'WO'})`,
      description: [
        `Kode WO: ${w.wo_code || w.id}`,
        `Mitra WO: ${w.wo_name || '-'}`,
        `Acara: ${w.event_title || '-'}`,
        `Paket: ${w.package_name || '-'}`
      ].join('\n'),
      location: w.address || db.studio_settings.studio_address || 'Bandung',
      colorId: '11',
      creator: { email: superAdmin.email, displayName: superAdmin.name },
      organizer: { email: superAdmin.email, displayName: superAdmin.name, self: true },
      start: { dateTime: `${w.event_date}T08:00:00+07:00`, timeZone: 'Asia/Jakarta' },
      end: { dateTime: `${w.event_date}T15:00:00+07:00`, timeZone: 'Asia/Jakarta' },
      iCalUID: `${w.id}@carissawedding.com`,
      attendees: attendeesSuperAndFitting,
      extendedProperties: {
        private: {
          source: 'app_wo_event',
          wo_id: w.id,
          wo_code: w.wo_code || '',
          event_type: 'wo_hari_h'
        }
      }
    };
    evWo.htmlLink = buildGoogleWebRenderUrl(evWo);
    syncedEvents.push(evWo);
  });

  // 4D. Sync Vendor Transfers Schedule
  const vendorTransfersList = Array.isArray(db.vendor_transfers) ? db.vendor_transfers : [];
  vendorTransfersList.forEach(vt => {
    const tDate = vt.transfer_date || vt.event_date;
    if (!tDate) return;
    const evVt = {
      kind: 'calendar#event',
      id: `gcal_vtr_${vt.id}`,
      status: 'confirmed',
      created: vt.created_at || new Date().toISOString(),
      updated: new Date().toISOString(),
      summary: `[TRANSFER VENDOR] ${vt.vendor_name || 'Vendor'} — ${vt.event_title || '-'}`,
      description: [
        `Kode Transfer: ${vt.transfer_code || vt.id}`,
        `Vendor: ${vt.vendor_name || '-'} (${vt.vendor_category || '-'})`,
        `Rekening: ${vt.bank_name || '-'} ${vt.account_number || ''} a.n. ${vt.account_holder || '-'}`,
        `Nominal Transfer: Rp ${Number(vt.transfer_amount || 0).toLocaleString('id-ID')}`,
        `Status: ${(vt.payment_status || 'dp').toUpperCase()}`
      ].join('\n'),
      location: vt.event_location || db.studio_settings.studio_address || 'Bandung',
      colorId: '5',
      creator: { email: superAdmin.email, displayName: superAdmin.name },
      organizer: { email: superAdmin.email, displayName: superAdmin.name, self: true },
      start: { dateTime: `${tDate}T10:00:00+07:00`, timeZone: 'Asia/Jakarta' },
      end: { dateTime: `${tDate}T11:00:00+07:00`, timeZone: 'Asia/Jakarta' },
      iCalUID: `${vt.id}@carissawedding.com`,
      attendees: [attendeesSuperAndFitting[0]],
      extendedProperties: {
        private: {
          source: 'app_vendor_transfer',
          transfer_id: vt.id,
          transfer_code: vt.transfer_code || '',
          event_type: 'vendor_transfer'
        }
      }
    };
    evVt.htmlLink = buildGoogleWebRenderUrl(evVt);
    syncedEvents.push(evVt);
  });

  gcal.events[primaryCalId] = [...manualEvents, ...syncedEvents];
  const fittingEventsFiltered = syncedEvents.filter(e =>
    e.extendedProperties?.private?.event_type === 'wedding_h7' ||
    e.extendedProperties?.private?.event_type === 'wedding_h1' ||
    e.extendedProperties?.private?.event_type === 'wedding_hari_h' ||
    e.extendedProperties?.private?.event_type === 'wo_hari_h'
  );
  gcal.events[fittingCalId] = fittingEventsFiltered;
  gcal.events['fitting_calendar'] = fittingEventsFiltered;
  gcal.calendars['fitting_calendar'] = gcal.calendars[fittingCalId];
  gcal.acl['fitting_calendar'] = gcal.acl[primaryCalId];
  if (db.studio_settings && db.studio_settings.gcal_api_config) {
    db.studio_settings.gcal_api_config.last_synced_at = new Date().toISOString();
  }

  return changed;
}

function callRemoteGoogleCalendarApi(method, apiPath, accessToken, apiKey, payload = null) {
  return new Promise(resolve => {
    if (!accessToken && !apiKey) {
      return resolve({ forwarded: false, reason: 'no_token' });
    }
    const sep = apiPath.includes('?') ? '&' : '?';
    const fullPath = `/calendar/v3${apiPath}${apiKey ? `${sep}key=${encodeURIComponent(apiKey)}` : ''}`;
    const bodyStr = payload ? JSON.stringify(payload) : null;
    const headers = {
      'Accept': 'application/json'
    };
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
    if (bodyStr) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(bodyStr);
    }

    const req = https.request({
      hostname: 'www.googleapis.com',
      port: 443,
      path: fullPath,
      method,
      headers
    }, res => {
      let raw = '';
      res.on('data', chunk => { raw += chunk.toString(); });
      res.on('end', () => {
        try {
          resolve({
            forwarded: true,
            statusCode: res.statusCode,
            data: raw ? JSON.parse(raw) : {}
          });
        } catch (e) {
          resolve({ forwarded: true, statusCode: res.statusCode, raw });
        }
      });
    });

    req.on('error', err => {
      resolve({ forwarded: false, error: err.message });
    });
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

// Read body helper
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// Send JSON helper
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Send file helper
function serveStaticFile(res, filePath) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    res.end(content);
  });
}

// ==============================================================
// HTTP SERVER HANDLER
// ==============================================================
const server = http.createServer(async (req, res) => {
  const whatwgUrl = new URL(req.url || '/', 'http://localhost');
  const parsedUrl = {
    pathname: whatwgUrl.pathname,
    query: Object.fromEntries(whatwgUrl.searchParams.entries())
  };
  let pathname = decodeURIComponent(parsedUrl.pathname);
  const method = req.method.toUpperCase();

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // Normalize root paths
  if (pathname === '/' || pathname === '/booking') {
    return serveStaticFile(res, path.join(__dirname, 'booking.html'));
  }
  if (pathname === '/admin') {
    return serveStaticFile(res, path.join(__dirname, 'admin.html'));
  }

  // API Endpoints
  if (pathname.startsWith('/api/')) {
    try {
      const db = getDatabase();

      // 1. GET ALL / SYNC ALL
      if (pathname === '/api/sync-all') {
        if (method === 'GET') {
          return sendJson(res, 200, { success: true, data: db });
        }
        if (method === 'POST') {
          const payload = await readJsonBody(req);
          if (Array.isArray(payload.bookings)) db.bookings = payload.bookings;
          if (Array.isArray(payload.master_packages)) db.master_packages = payload.master_packages;
          if (Array.isArray(payload.packages)) db.master_packages = payload.packages;
          if (Array.isArray(payload.master_users)) db.master_users = payload.master_users;
          if (Array.isArray(payload.masterUsers)) db.master_users = payload.masterUsers;
          if (Array.isArray(payload.fittings)) db.fittings = payload.fittings;
          if (Array.isArray(payload.fitting_reminders)) db.fitting_reminders = payload.fitting_reminders;
          if (Array.isArray(payload.fittingReminders)) db.fitting_reminders = payload.fittingReminders;
          if (Array.isArray(payload.wo_events)) db.wo_events = payload.wo_events;
          if (Array.isArray(payload.woEvents)) db.wo_events = payload.woEvents;
          if (Array.isArray(payload.vendor_transfers)) db.vendor_transfers = payload.vendor_transfers;
          if (Array.isArray(payload.vendorTransfers)) db.vendor_transfers = payload.vendorTransfers;
          if (payload.studio_settings && typeof payload.studio_settings === 'object') {
            db.studio_settings = { ...(db.studio_settings || {}), ...payload.studio_settings };
          }
          saveDatabase(db);
          return sendJson(res, 200, { success: true, data: db });
        }
      }

      // 2. BOOKINGS
      if (pathname === '/api/bookings') {
        if (method === 'GET') {
          return sendJson(res, 200, { success: true, bookings: db.bookings || [] });
        }
        if (method === 'POST') {
          const newBooking = await readJsonBody(req);
          if (!newBooking.id) newBooking.id = 'booking_' + Date.now();
          if (!newBooking.created_at) newBooking.created_at = new Date().toISOString();
          db.bookings = [newBooking, ...(db.bookings || [])];
          saveDatabase(db);
          return sendJson(res, 200, { success: true, booking: newBooking });
        }
      }

      if (pathname.startsWith('/api/bookings/')) {
        const id = pathname.replace('/api/bookings/', '');
        const idx = (db.bookings || []).findIndex(b => b.id === id);

        if (method === 'PUT') {
          if (idx === -1) return sendJson(res, 404, { success: false, message: 'Booking not found' });
          const updates = await readJsonBody(req);
          db.bookings[idx] = { ...db.bookings[idx], ...updates };
          saveDatabase(db);
          return sendJson(res, 200, { success: true, booking: db.bookings[idx] });
        }

        if (method === 'DELETE') {
          db.bookings = (db.bookings || []).filter(b => b.id !== id);
          saveDatabase(db);
          return sendJson(res, 200, { success: true, message: 'Deleted successfully' });
        }
      }

      // 3. PACKAGES
      if (pathname === '/api/packages') {
        if (method === 'GET') {
          return sendJson(res, 200, { success: true, packages: db.master_packages || [] });
        }
        if (method === 'POST') {
          const pkg = await readJsonBody(req);
          if (!pkg.id) pkg.id = 'pkg_' + Date.now();
          db.master_packages = [...(db.master_packages || []), pkg];
          saveDatabase(db);
          return sendJson(res, 200, { success: true, package: pkg });
        }
      }

      if (pathname.startsWith('/api/packages/')) {
        const id = pathname.replace('/api/packages/', '');
        const idx = (db.master_packages || []).findIndex(p => p.id === id);

        if (method === 'PUT') {
          if (idx === -1) return sendJson(res, 404, { success: false });
          const updates = await readJsonBody(req);
          db.master_packages[idx] = { ...db.master_packages[idx], ...updates };
          saveDatabase(db);
          return sendJson(res, 200, { success: true, package: db.master_packages[idx] });
        }

        if (method === 'DELETE') {
          db.master_packages = (db.master_packages || []).filter(p => p.id !== id);
          saveDatabase(db);
          return sendJson(res, 200, { success: true });
        }
      }

      // 4. FITTINGS
      if (pathname === '/api/fittings') {
        if (method === 'GET') {
          return sendJson(res, 200, { success: true, fittings: db.fittings || [] });
        }
        if (method === 'POST') {
          const fit = await readJsonBody(req);
          if (!fit.id) fit.id = 'fit_' + Date.now();
          if (!fit.created_at) fit.created_at = new Date().toISOString();
          db.fittings = [fit, ...(db.fittings || [])];
          saveDatabase(db);
          return sendJson(res, 200, { success: true, fitting: fit });
        }
      }

      if (pathname.startsWith('/api/fittings/')) {
        const id = pathname.replace('/api/fittings/', '');
        const idx = (db.fittings || []).findIndex(f => f.id === id);

        if (method === 'PUT') {
          if (idx === -1) return sendJson(res, 404, { success: false, message: 'Fitting not found' });
          const updates = await readJsonBody(req);
          db.fittings[idx] = { ...db.fittings[idx], ...updates };
          saveDatabase(db);
          return sendJson(res, 200, { success: true, fitting: db.fittings[idx] });
        }

        if (method === 'DELETE') {
          db.fittings = (db.fittings || []).filter(f => f.id !== id);
          saveDatabase(db);
          return sendJson(res, 200, { success: true, message: 'Fitting deleted' });
        }
      }

      // 5. MASTER USERS
      if (pathname === '/api/users') {
        if (method === 'GET') {
          return sendJson(res, 200, { success: true, users: db.master_users || [] });
        }
        if (method === 'POST') {
          const body = await readJsonBody(req);
          if (Array.isArray(body.users)) {
            db.master_users = body.users;
            saveDatabase(db);
            return sendJson(res, 200, { success: true, users: db.master_users });
          }
          const user = body;
          if (!user.id) user.id = 'usr_' + Date.now();
          db.master_users = [...(db.master_users || []), user];
          saveDatabase(db);
          return sendJson(res, 200, { success: true, user });
        }
      }

      if (pathname.startsWith('/api/users/')) {
        const id = pathname.replace('/api/users/', '');
        const idx = (db.master_users || []).findIndex(u => u.id === id);

        if (method === 'PUT') {
          if (idx === -1) return sendJson(res, 404, { success: false, message: 'User not found' });
          const updates = await readJsonBody(req);
          db.master_users[idx] = { ...db.master_users[idx], ...updates };
          saveDatabase(db);
          return sendJson(res, 200, { success: true, user: db.master_users[idx] });
        }

        if (method === 'DELETE') {
          db.master_users = (db.master_users || []).filter(u => u.id !== id);
          saveDatabase(db);
          return sendJson(res, 200, { success: true });
        }
      }

      // 6. STUDIO SETTINGS (INCLUDING ROLE MENU PERMISSIONS & FITTING COLUMNS)
      if (pathname === '/api/settings') {
        if (method === 'GET') {
          return sendJson(res, 200, { success: true, settings: db.studio_settings || {} });
        }
        if (method === 'POST') {
          const settings = await readJsonBody(req);
          db.studio_settings = { ...db.studio_settings, ...settings };
          saveDatabase(db);
          return sendJson(res, 200, { success: true, settings: db.studio_settings });
        }
      }

      // 7. VENDOR TRANSFERS
      if (pathname === '/api/vendor-transfers') {
        if (method === 'GET') {
          return sendJson(res, 200, { success: true, vendor_transfers: db.vendor_transfers || [] });
        }
        if (method === 'POST') {
          const trf = await readJsonBody(req);
          if (!trf.id) trf.id = 'vtr_' + Date.now();
          if (!trf.created_at) trf.created_at = new Date().toISOString();
          db.vendor_transfers = [trf, ...(db.vendor_transfers || [])];
          saveDatabase(db);
          return sendJson(res, 200, { success: true, vendor_transfer: trf });
        }
      }

      if (pathname.startsWith('/api/vendor-transfers/')) {
        const id = pathname.replace('/api/vendor-transfers/', '');
        const idx = (db.vendor_transfers || []).findIndex(v => v.id === id);

        if (method === 'PUT') {
          if (idx === -1) return sendJson(res, 404, { success: false, message: 'Transfer data not found' });
          const updates = await readJsonBody(req);
          db.vendor_transfers[idx] = { ...db.vendor_transfers[idx], ...updates };
          saveDatabase(db);
          return sendJson(res, 200, { success: true, vendor_transfer: db.vendor_transfers[idx] });
        }

        if (method === 'DELETE') {
          db.vendor_transfers = (db.vendor_transfers || []).filter(v => v.id !== id);
          saveDatabase(db);
          return sendJson(res, 200, { success: true, message: 'Transfer deleted' });
        }
      }

      // 8. WO EVENTS (DATA ACARA / REKANAN WO)
      if (pathname === '/api/wo-events') {
        if (method === 'GET') {
          return sendJson(res, 200, { success: true, wo_events: db.wo_events || [] });
        }
        if (method === 'POST') {
          const wo = await readJsonBody(req);
          if (!wo.id) wo.id = 'wo_' + Date.now();
          if (!wo.created_at) wo.created_at = new Date().toISOString();
          db.wo_events = [wo, ...(db.wo_events || [])];
          saveDatabase(db);
          return sendJson(res, 200, { success: true, wo_event: wo });
        }
      }

      if (pathname.startsWith('/api/wo-events/')) {
        const id = pathname.replace('/api/wo-events/', '');
        const idx = (db.wo_events || []).findIndex(w => w.id === id);

        if (method === 'PUT') {
          if (idx === -1) return sendJson(res, 404, { success: false, message: 'WO event not found' });
          const updates = await readJsonBody(req);
          db.wo_events[idx] = { ...db.wo_events[idx], ...updates };
          saveDatabase(db);
          return sendJson(res, 200, { success: true, wo_event: db.wo_events[idx] });
        }

        if (method === 'DELETE') {
          db.wo_events = (db.wo_events || []).filter(w => w.id !== id);
          saveDatabase(db);
          return sendJson(res, 200, { success: true, message: 'WO event deleted' });
        }
      }

      // 9. FITTING REMINDERS (REMINDER GOOGLE KALENDER H-7 & H-1 UNTUK USER FITTING)
      if (pathname === '/api/fitting-reminders') {
        if (method === 'GET') {
          return sendJson(res, 200, { success: true, fitting_reminders: db.fitting_reminders || [] });
        }
        if (method === 'POST') {
          const rem = await readJsonBody(req);
          if (!rem.id) rem.id = 'frem_' + Date.now();
          if (!rem.created_at) rem.created_at = new Date().toISOString();
          db.fitting_reminders = [rem, ...(db.fitting_reminders || [])];
          saveDatabase(db);
          return sendJson(res, 200, { success: true, fitting_reminder: rem });
        }
      }

      if (pathname.startsWith('/api/fitting-reminders/')) {
        const id = pathname.replace('/api/fitting-reminders/', '');
        const idx = (db.fitting_reminders || []).findIndex(r => r.id === id);

        if (method === 'PUT') {
          if (idx === -1) return sendJson(res, 404, { success: false, message: 'Fitting reminder not found' });
          const updates = await readJsonBody(req);
          db.fitting_reminders[idx] = { ...db.fitting_reminders[idx], ...updates };
          saveDatabase(db);
          return sendJson(res, 200, { success: true, fitting_reminder: db.fitting_reminders[idx] });
        }

        if (method === 'DELETE') {
          db.fitting_reminders = (db.fitting_reminders || []).filter(r => r.id !== id);
          saveDatabase(db);
          return sendJson(res, 200, { success: true, message: 'Fitting reminder deleted' });
        }
      }

      // ==============================================================
      // 10. GOOGLE CALENDAR API v3 SYNCHRONIZATION & RESOURCES
      // Base URI: /api/gcal/v3 (mirrors https://www.googleapis.com/calendar/v3)
      // Supports: Acl, CalendarList, Calendars, Channels, Colors, Events, Freebusy, Settings
      // ==============================================================
      if (pathname.startsWith('/api/gcal/v3')) {
        const gcalPath = pathname.replace('/api/gcal/v3', '') || '/';
        const gcalStore = db.google_calendar_v3;
        const cfg = db.studio_settings?.gcal_api_config || {};
        const authHeader = req.headers['authorization'] || '';
        const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : (cfg.access_token || '');
        const apiKey = parsedUrl.query.key || cfg.api_key || '';

        // 10.0 OVERVIEW & FULL SYNC
        if (gcalPath === '/overview' && method === 'GET') {
          return sendJson(res, 200, {
            kind: 'calendar#overview',
            baseUrl: 'https://www.googleapis.com/calendar/v3',
            config: cfg,
            colors: GCAL_V3_COLORS,
            calendarList: { kind: 'calendar#calendarList', items: gcalStore.calendarList || [] },
            calendars: gcalStore.calendars || {},
            acl: { kind: 'calendar#acl', items: gcalStore.acl['primary'] || [] },
            events: { kind: 'calendar#events', summary: gcalStore.calendars['primary']?.summary, items: gcalStore.events['primary'] || [] },
            settings: { kind: 'calendar#settings', items: gcalStore.settings || [] },
            channels: gcalStore.channels || []
          });
        }

        if (gcalPath === '/sync' && method === 'POST') {
          const body = await readJsonBody(req);
          if (body.config) {
            db.studio_settings.gcal_api_config = {
              ...(db.studio_settings.gcal_api_config || {}),
              ...body.config,
              last_synced_at: new Date().toISOString()
            };
          } else if (db.studio_settings.gcal_api_config) {
            db.studio_settings.gcal_api_config.last_synced_at = new Date().toISOString();
          }
          saveDatabase(db);

          // Optional live push to https://www.googleapis.com/calendar/v3 if OAuth Bearer token is provided
          const activeToken = body.config?.access_token || bearerToken;
          const targetCalId = encodeURIComponent(db.studio_settings.gcal_api_config?.calendar_id || 'primary');
          let remoteSyncResult = { forwarded: false };
          if (activeToken) {
            const primaryEvents = db.google_calendar_v3.events['primary'] || [];
            let pushedCount = 0;
            for (const ev of primaryEvents.slice(0, 15)) {
              const r = await callRemoteGoogleCalendarApi('POST', `/calendars/${targetCalId}/events`, activeToken, apiKey, {
                summary: ev.summary,
                description: ev.description,
                location: ev.location,
                start: ev.start,
                end: ev.end,
                colorId: ev.colorId,
                attendees: ev.attendees,
                reminders: ev.reminders
              });
              if (r.forwarded && r.statusCode >= 200 && r.statusCode < 300) pushedCount++;
            }
            remoteSyncResult = { forwarded: true, pushedCount };
          }

          const primaryEventsList = db.google_calendar_v3.events['primary'] || [];
          const fittingEventsList = db.google_calendar_v3.events['fitting_calendar'] || [];
          const primaryAclList = db.google_calendar_v3.acl['primary'] || [];

          return sendJson(res, 200, {
            success: true,
            syncedAt: db.studio_settings.gcal_api_config.last_synced_at,
            remoteSync: remoteSyncResult,
            totalEvents: primaryEventsList.length,
            totalAclRules: primaryAclList.length,
            events: primaryEventsList,
            acl: primaryAclList,
            summary: {
              primaryEventsCount: primaryEventsList.length,
              fittingEventsCount: fittingEventsList.length,
              aclCount: primaryAclList.length
            },
            gcal_v3: {
              ...db.google_calendar_v3,
              config: db.studio_settings.gcal_api_config,
              colors: GCAL_V3_COLORS
            }
          });
        }

        // 10.1 COLORS: GET /colors
        if (gcalPath === '/colors' && method === 'GET') {
          return sendJson(res, 200, GCAL_V3_COLORS);
        }

        // 10.2 SETTINGS: GET /users/me/settings, GET /users/me/settings/:setting, POST /users/me/settings/watch
        if (gcalPath === '/users/me/settings' && method === 'GET') {
          return sendJson(res, 200, {
            kind: 'calendar#settings',
            etag: `"settings-${Date.now()}"`,
            items: gcalStore.settings || []
          });
        }
        if (gcalPath === '/users/me/settings/watch' && method === 'POST') {
          const ch = await readJsonBody(req);
          const channelObj = {
            kind: 'api#channel',
            id: ch.id || 'ch_settings_' + Date.now(),
            resourceId: 'res_settings_' + Date.now(),
            resourceUri: 'https://www.googleapis.com/calendar/v3/users/me/settings',
            address: ch.address || '',
            expiration: String(Date.now() + 7 * 86400000)
          };
          gcalStore.channels.push(channelObj);
          saveDatabase(db);
          return sendJson(res, 200, channelObj);
        }
        if (gcalPath.startsWith('/users/me/settings/') && method === 'GET') {
          const settingId = gcalPath.replace('/users/me/settings/', '');
          const item = (gcalStore.settings || []).find(s => s.id === settingId);
          if (!item) return sendJson(res, 404, { error: { code: 404, message: 'Setting not found' } });
          return sendJson(res, 200, item);
        }

        // 10.3 CALENDARLIST: /users/me/calendarList
        if (gcalPath === '/users/me/calendarList') {
          if (method === 'GET') {
            return sendJson(res, 200, {
              kind: 'calendar#calendarList',
              etag: `"callist-${Date.now()}"`,
              nextSyncToken: `sync_${Date.now()}`,
              items: gcalStore.calendarList || []
            });
          }
          if (method === 'POST') {
            const body = await readJsonBody(req);
            const calId = body.id || 'cal_' + Date.now();
            const entry = {
              kind: 'calendar#calendarListEntry',
              id: calId,
              summary: body.summary || calId,
              description: body.description || '',
              timeZone: body.timeZone || 'Asia/Jakarta',
              colorId: body.colorId || '9',
              selected: true,
              accessRole: 'owner',
              defaultReminders: body.defaultReminders || [{ method: 'popup', minutes: 30 }]
            };
            gcalStore.calendarList.push(entry);
            saveDatabase(db);
            return sendJson(res, 200, entry);
          }
        }
        if (gcalPath === '/users/me/calendarList/watch' && method === 'POST') {
          const ch = await readJsonBody(req);
          const channelObj = {
            kind: 'api#channel',
            id: ch.id || 'ch_callist_' + Date.now(),
            resourceId: 'res_callist_' + Date.now(),
            resourceUri: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
            address: ch.address || '',
            expiration: String(Date.now() + 7 * 86400000)
          };
          gcalStore.channels.push(channelObj);
          saveDatabase(db);
          return sendJson(res, 200, channelObj);
        }
        if (gcalPath.startsWith('/users/me/calendarList/')) {
          const calId = decodeURIComponent(gcalPath.replace('/users/me/calendarList/', ''));
          const idx = (gcalStore.calendarList || []).findIndex(c => c.id === calId);
          if (method === 'GET') {
            if (idx === -1) return sendJson(res, 404, { error: { code: 404, message: 'CalendarList entry not found' } });
            return sendJson(res, 200, gcalStore.calendarList[idx]);
          }
          if (method === 'PUT' || method === 'PATCH') {
            if (idx === -1) return sendJson(res, 404, { error: { code: 404, message: 'CalendarList entry not found' } });
            const updates = await readJsonBody(req);
            gcalStore.calendarList[idx] = { ...gcalStore.calendarList[idx], ...updates };
            saveDatabase(db);
            return sendJson(res, 200, gcalStore.calendarList[idx]);
          }
          if (method === 'DELETE') {
            gcalStore.calendarList = (gcalStore.calendarList || []).filter(c => c.id !== calId);
            saveDatabase(db);
            return sendJson(res, 200, { deleted: true });
          }
        }

        // 10.4 CHANNELS: POST /channels/stop
        if (gcalPath === '/channels/stop' && method === 'POST') {
          const body = await readJsonBody(req);
          gcalStore.channels = (gcalStore.channels || []).filter(c => c.id !== body.id);
          saveDatabase(db);
          return sendJson(res, 200, { stopped: true, channelId: body.id });
        }

        // 10.5 FREEBUSY: POST /freeBusy
        if (gcalPath === '/freeBusy' && method === 'POST') {
          const body = await readJsonBody(req);
          const timeMin = body.timeMin ? new Date(body.timeMin) : new Date();
          const timeMax = body.timeMax ? new Date(body.timeMax) : new Date(Date.now() + 30 * 86400000);
          const reqItems = Array.isArray(body.items) && body.items.length > 0 ? body.items : [{ id: 'primary' }];

          const calendarsResult = {};
          reqItems.forEach(it => {
            const cId = it.id || 'primary';
            const evList = gcalStore.events[cId] || gcalStore.events['primary'] || [];
            const busy = [];
            evList.forEach(ev => {
              if (ev.status === 'cancelled') return;
              const sStr = ev.start?.dateTime || (ev.start?.date ? `${ev.start.date}T08:00:00+07:00` : null);
              const eStr = ev.end?.dateTime || (ev.end?.date ? `${ev.end.date}T12:00:00+07:00` : null);
              if (!sStr || !eStr) return;
              const sTime = new Date(sStr);
              const eTime = new Date(eStr);
              if (eTime >= timeMin && sTime <= timeMax) {
                busy.push({
                  start: sStr,
                  end: eStr,
                  summary: ev.summary,
                  eventId: ev.id
                });
              }
            });
            calendarsResult[cId] = { busy };
          });

          return sendJson(res, 200, {
            kind: 'calendar#freeBusy',
            timeMin: timeMin.toISOString(),
            timeMax: timeMax.toISOString(),
            calendars: calendarsResult
          });
        }

        // 10.6 CALENDARS, ACL & EVENTS under /calendars...
        if (gcalPath === '/calendars' && method === 'POST') {
          const body = await readJsonBody(req);
          const newCalId = body.id || `carissa_${Date.now()}@group.calendar.google.com`;
          const newCal = {
            kind: 'calendar#calendar',
            id: newCalId,
            summary: body.summary || 'Kalender Baru Carissa',
            description: body.description || '',
            location: body.location || db.studio_settings.studio_address || 'Bandung',
            timeZone: body.timeZone || 'Asia/Jakarta'
          };
          gcalStore.calendars[newCalId] = newCal;
          gcalStore.calendarList.push({
            kind: 'calendar#calendarListEntry',
            id: newCalId,
            summary: newCal.summary,
            description: newCal.description,
            location: newCal.location,
            timeZone: newCal.timeZone,
            colorId: '11',
            selected: true,
            accessRole: 'owner'
          });
          gcalStore.events[newCalId] = [];
          gcalStore.acl[newCalId] = [...(gcalStore.acl['primary'] || [])];
          saveDatabase(db);
          return sendJson(res, 200, newCal);
        }

        if (gcalPath.startsWith('/calendars/')) {
          const sub = gcalPath.replace('/calendars/', '');
          const parts = sub.split('/');
          const rawCalId = decodeURIComponent(parts[0]);
          const calKey = gcalStore.calendars[rawCalId] ? rawCalId : 'primary';

          // A. /calendars/:calendarId (GET, PUT, PATCH, DELETE)
          if (parts.length === 1) {
            if (method === 'GET') {
              return sendJson(res, 200, gcalStore.calendars[calKey]);
            }
            if (method === 'PUT' || method === 'PATCH') {
              const updates = await readJsonBody(req);
              gcalStore.calendars[calKey] = { ...gcalStore.calendars[calKey], ...updates };
              saveDatabase(db);
              return sendJson(res, 200, gcalStore.calendars[calKey]);
            }
            if (method === 'DELETE') {
              if (calKey === 'primary') {
                return sendJson(res, 400, { error: { code: 400, message: 'Primary calendar cannot be deleted; use clear instead.' } });
              }
              delete gcalStore.calendars[calKey];
              gcalStore.calendarList = (gcalStore.calendarList || []).filter(c => c.id !== calKey);
              saveDatabase(db);
              return sendJson(res, 200, { deleted: true });
            }
          }

          // B. /calendars/:calendarId/clear & /transferOwnership
          if (parts.length === 2 && parts[1] === 'clear' && method === 'POST') {
            gcalStore.events[calKey] = [];
            saveDatabase(db);
            return sendJson(res, 200, { cleared: true, calendarId: calKey });
          }
          if (parts.length === 2 && parts[1] === 'transferOwnership' && method === 'POST') {
            const newOwner = parsedUrl.query.newDataOwner || 'admin.carisamakeup@gmail.com';
            return sendJson(res, 200, { transferred: true, calendarId: calKey, newDataOwner: newOwner });
          }

          // C. ACL Resource: /calendars/:calendarId/acl...
          if (parts[1] === 'acl') {
            if (!gcalStore.acl[calKey]) gcalStore.acl[calKey] = [];
            const aclList = gcalStore.acl[calKey];

            if (parts.length === 2) {
              if (method === 'GET') {
                return sendJson(res, 200, {
                  kind: 'calendar#acl',
                  etag: `"acl-${Date.now()}"`,
                  items: aclList
                });
              }
              if (method === 'POST') {
                const body = await readJsonBody(req);
                const scopeVal = body.scope?.value || body.email || '';
                const scopeType = body.scope?.type || 'user';
                const ruleId = `${scopeType}:${scopeVal.toLowerCase()}`;
                const newRule = {
                  kind: 'calendar#aclRule',
                  etag: `"acl-${Date.now()}"`,
                  id: ruleId,
                  scope: { type: scopeType, value: scopeVal },
                  role: body.role || 'reader',
                  userName: body.userName || scopeVal,
                  appRole: body.appRole || 'Custom ACL'
                };
                const existingIdx = aclList.findIndex(r => r.id === ruleId);
                if (existingIdx !== -1) aclList[existingIdx] = newRule;
                else aclList.push(newRule);
                saveDatabase(db);
                if (bearerToken) {
                  await callRemoteGoogleCalendarApi('POST', `/calendars/${encodeURIComponent(rawCalId)}/acl`, bearerToken, apiKey, {
                    role: newRule.role,
                    scope: newRule.scope
                  });
                }
                return sendJson(res, 200, newRule);
              }
            }

            if (parts.length === 3 && parts[2] === 'watch' && method === 'POST') {
              const ch = await readJsonBody(req);
              const channelObj = {
                kind: 'api#channel',
                id: ch.id || 'ch_acl_' + Date.now(),
                resourceId: 'res_acl_' + Date.now(),
                resourceUri: `https://www.googleapis.com/calendar/v3/calendars/${rawCalId}/acl`,
                address: ch.address || '',
                expiration: String(Date.now() + 7 * 86400000)
              };
              gcalStore.channels.push(channelObj);
              saveDatabase(db);
              return sendJson(res, 200, channelObj);
            }

            if (parts.length === 3) {
              const ruleId = decodeURIComponent(parts[2]);
              const rIdx = aclList.findIndex(r => r.id === ruleId);
              if (method === 'GET') {
                if (rIdx === -1) return sendJson(res, 404, { error: { code: 404, message: 'ACL rule not found' } });
                return sendJson(res, 200, aclList[rIdx]);
              }
              if (method === 'PUT' || method === 'PATCH') {
                if (rIdx === -1) return sendJson(res, 404, { error: { code: 404, message: 'ACL rule not found' } });
                const updates = await readJsonBody(req);
                aclList[rIdx] = { ...aclList[rIdx], ...updates };
                saveDatabase(db);
                return sendJson(res, 200, aclList[rIdx]);
              }
              if (method === 'DELETE') {
                gcalStore.acl[calKey] = aclList.filter(r => r.id !== ruleId);
                saveDatabase(db);
                return sendJson(res, 200, { deleted: true, ruleId });
              }
            }
          }

          // D. EVENTS Resource: /calendars/:calendarId/events...
          if (parts[1] === 'events') {
            if (!Array.isArray(gcalStore.events[calKey])) gcalStore.events[calKey] = [];
            const evList = gcalStore.events[calKey];

            // GET /calendars/:calendarId/events (list) & POST /calendars/:calendarId/events (insert)
            if (parts.length === 2) {
              if (method === 'GET') {
                let filtered = [...evList];
                if (parsedUrl.query.iCalUID) {
                  filtered = filtered.filter(e => e.iCalUID === parsedUrl.query.iCalUID);
                }
                if (parsedUrl.query.q) {
                  const q = String(parsedUrl.query.q).toLowerCase();
                  filtered = filtered.filter(e =>
                    `${e.summary || ''} ${e.description || ''} ${e.location || ''}`.toLowerCase().includes(q)
                  );
                }
                if (parsedUrl.query.timeMin) {
                  const tMin = new Date(parsedUrl.query.timeMin);
                  filtered = filtered.filter(e => new Date(e.end?.dateTime || e.end?.date || 0) >= tMin);
                }
                if (parsedUrl.query.timeMax) {
                  const tMax = new Date(parsedUrl.query.timeMax);
                  filtered = filtered.filter(e => new Date(e.start?.dateTime || e.start?.date || 0) <= tMax);
                }
                return sendJson(res, 200, {
                  kind: 'calendar#events',
                  etag: `"events-${Date.now()}"`,
                  summary: gcalStore.calendars[calKey]?.summary || 'Carissa Calendar',
                  timeZone: 'Asia/Jakarta',
                  accessRole: 'owner',
                  items: filtered
                });
              }

              if (method === 'POST') {
                const body = await readJsonBody(req);
                const newId = body.id || `gcal_manual_${Date.now()}`;
                const newEvent = {
                  kind: 'calendar#event',
                  id: newId,
                  status: body.status || 'confirmed',
                  created: new Date().toISOString(),
                  updated: new Date().toISOString(),
                  summary: body.summary || 'Jadwal Baru Carissa',
                  description: body.description || '',
                  location: body.location || db.studio_settings.studio_address || 'Bandung',
                  colorId: body.colorId || '11',
                  start: body.start || { dateTime: `${new Date().toISOString().split('T')[0]}T09:00:00+07:00`, timeZone: 'Asia/Jakarta' },
                  end: body.end || { dateTime: `${new Date().toISOString().split('T')[0]}T11:00:00+07:00`, timeZone: 'Asia/Jakarta' },
                  iCalUID: body.iCalUID || `${newId}@carissawedding.com`,
                  attendees: Array.isArray(body.attendees) ? body.attendees : [],
                  reminders: body.reminders || {
                    useDefault: false,
                    overrides: [{ method: 'popup', minutes: 30 }]
                  },
                  extendedProperties: body.extendedProperties || {
                    private: { source: 'manual_gcal_v3' }
                  }
                };
                newEvent.htmlLink = buildGoogleWebRenderUrl(newEvent);
                evList.unshift(newEvent);
                saveDatabase(db);
                if (bearerToken) {
                  await callRemoteGoogleCalendarApi('POST', `/calendars/${encodeURIComponent(rawCalId)}/events`, bearerToken, apiKey, newEvent);
                }
                return sendJson(res, 200, newEvent);
              }
            }

            // POST /calendars/:calendarId/events/quickAdd?text=...
            if (parts.length === 3 && parts[2] === 'quickAdd' && method === 'POST') {
              const body = await readJsonBody(req);
              const rawText = parsedUrl.query.text || body.text || 'Jadwal Baru Carissa';
              // Parse optional YYYY-MM-DD and HH:mm from text
              const dateMatch = rawText.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
              const timeMatch = rawText.match(/\b(\d{2}:\d{2})\b/);
              const targetDate = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];
              const targetTime = timeMatch ? timeMatch[1] : '09:00';
              const endHour = String(Math.min(23, (parseInt(targetTime.slice(0, 2), 10) || 9) + 2)).padStart(2, '0');
              const cleanSummary = rawText.replace(/\b(20\d{2}-\d{2}-\d{2})\b/, '').replace(/\b(\d{2}:\d{2})\b/, '').replace(/\s+/g, ' ').trim() || rawText;

              const newId = `gcal_quick_${Date.now()}`;
              const quickEvent = {
                kind: 'calendar#event',
                id: newId,
                status: 'confirmed',
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
                summary: cleanSummary,
                description: `Dibuat melalui Google Calendar API v3 (Events.quickAdd): "${rawText}"`,
                location: db.studio_settings.studio_address || 'Bandung',
                colorId: '7',
                start: { dateTime: `${targetDate}T${targetTime}:00+07:00`, timeZone: 'Asia/Jakarta' },
                end: { dateTime: `${targetDate}T${endHour}:${targetTime.slice(3, 5)}:00+07:00`, timeZone: 'Asia/Jakarta' },
                iCalUID: `${newId}@carissawedding.com`,
                extendedProperties: {
                  private: { source: 'manual_gcal_v3', quickAddText: rawText, event_date: targetDate }
                }
              };
              quickEvent.htmlLink = buildGoogleWebRenderUrl(quickEvent);
              evList.unshift(quickEvent);
              saveDatabase(db);
              if (bearerToken) {
                await callRemoteGoogleCalendarApi('POST', `/calendars/${encodeURIComponent(rawCalId)}/events/quickAdd?text=${encodeURIComponent(rawText)}`, bearerToken, apiKey);
              }
              return sendJson(res, 200, quickEvent);
            }

            // POST /calendars/:calendarId/events/import
            if (parts.length === 3 && parts[2] === 'import' && method === 'POST') {
              const body = await readJsonBody(req);
              const impId = body.id || `gcal_import_${Date.now()}`;
              const impEvent = {
                ...body,
                kind: 'calendar#event',
                id: impId,
                eventType: 'default',
                iCalUID: body.iCalUID || `${impId}@carissawedding.com`,
                updated: new Date().toISOString(),
                extendedProperties: { private: { source: 'manual_gcal_v3' } }
              };
              impEvent.htmlLink = buildGoogleWebRenderUrl(impEvent);
              evList.unshift(impEvent);
              saveDatabase(db);
              return sendJson(res, 200, impEvent);
            }

            // POST /calendars/:calendarId/events/watch
            if (parts.length === 3 && parts[2] === 'watch' && method === 'POST') {
              const ch = await readJsonBody(req);
              const channelObj = {
                kind: 'api#channel',
                id: ch.id || 'ch_events_' + Date.now(),
                resourceId: 'res_events_' + Date.now(),
                resourceUri: `https://www.googleapis.com/calendar/v3/calendars/${rawCalId}/events`,
                address: ch.address || '',
                expiration: String(Date.now() + 7 * 86400000)
              };
              gcalStore.channels.push(channelObj);
              saveDatabase(db);
              return sendJson(res, 200, channelObj);
            }

            // /calendars/:calendarId/events/:eventId (GET, PUT, PATCH, DELETE)
            if (parts.length === 3) {
              const evId = decodeURIComponent(parts[2]);
              const eIdx = evList.findIndex(e => e.id === evId);
              if (method === 'GET') {
                if (eIdx === -1) return sendJson(res, 404, { error: { code: 404, message: 'Event not found' } });
                return sendJson(res, 200, evList[eIdx]);
              }
              if (method === 'PUT' || method === 'PATCH') {
                if (eIdx === -1) return sendJson(res, 404, { error: { code: 404, message: 'Event not found' } });
                const updates = await readJsonBody(req);
                evList[eIdx] = {
                  ...evList[eIdx],
                  ...updates,
                  updated: new Date().toISOString()
                };
                evList[eIdx].htmlLink = buildGoogleWebRenderUrl(evList[eIdx]);
                saveDatabase(db);
                return sendJson(res, 200, evList[eIdx]);
              }
              if (method === 'DELETE') {
                gcalStore.events[calKey] = evList.filter(e => e.id !== evId);
                fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
                return sendJson(res, 200, { deleted: true, eventId: evId });
              }
            }

            // /calendars/:calendarId/events/:eventId/instances & /move
            if (parts.length === 4) {
              const evId = decodeURIComponent(parts[2]);
              const action = parts[3];
              const ev = evList.find(e => e.id === evId);
              if (!ev) return sendJson(res, 404, { error: { code: 404, message: 'Event not found' } });

              if (action === 'instances' && method === 'GET') {
                return sendJson(res, 200, {
                  kind: 'calendar#events',
                  summary: ev.summary,
                  items: [ev]
                });
              }
              if (action === 'move' && method === 'POST') {
                const destCalId = parsedUrl.query.destination || 'primary';
                gcalStore.events[calKey] = evList.filter(e => e.id !== evId);
                if (!Array.isArray(gcalStore.events[destCalId])) gcalStore.events[destCalId] = [];
                gcalStore.events[destCalId].unshift(ev);
                fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
                return sendJson(res, 200, { ...ev, movedTo: destCalId });
              }
            }
          }
        }
      }

      return sendJson(res, 404, { success: false, message: 'API Route Not Found' });
    } catch (err) {
      return sendJson(res, 500, { success: false, message: err.message });
    }
  }

  // Static file fallback
  const safePath = path.normalize(path.join(__dirname, pathname));
  if (!safePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return serveStaticFile(res, path.join(__dirname, 'booking.html'));
    }
    serveStaticFile(res, safePath);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`CARISSA PROFESIONAL MAKE UP ARTIST & WEDDING ORGANIZER`);
  console.log(`Standalone Zero-Dependency Server running on port ${PORT}`);
  console.log(`=======================================================`);
  console.log(`🌸 Form Booking Klien : http://localhost:${PORT}/ (atau /booking)`);
  console.log(`🔒 Panel Khusus Admin : http://localhost:${PORT}/admin`);
  console.log(`=======================================================`);
});

module.exports = server;

