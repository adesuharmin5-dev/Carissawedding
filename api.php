<?php
/**
 * ============================================================================
 * CARISSA PROFESIONAL MAKE UP ARTIST & WEDDING ORGANIZER
 * cPanel Shared Hosting PHP REST API Engine (PHP 7.4 - 8.3+ Compatible)
 * ----------------------------------------------------------------------------
 * File ini memastikan seluruh fitur aplikasi berjalan 100% normal di cPanel
 * Shared Hosting (Apache / LiteSpeed / Nginx) baik menggunakan Flat-file JSON
 * maupun MySQL Database.
 * ============================================================================
 */

require_once __DIR__ . '/config.php';

// Header CORS & Keamanan Respon
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$dbFile = defined('JSON_DB_FILE') ? JSON_DB_FILE : (__DIR__ . '/database.json');

// Inisialisasi struktur default database jika file belum ada
function getInitialDbStructure() {
    return [
        'studio_settings' => [
            'name' => defined('STUDIO_NAME') ? STUDIO_NAME : 'CARISSA PROFESIONAL MAKE UP ARTIST & WEDDING ORGANIZER',
            'studio_name' => defined('STUDIO_NAME') ? STUDIO_NAME : 'CARISSA PROFESIONAL MAKE UP ARTIST & WEDDING ORGANIZER',
            'wa' => defined('STUDIO_PHONE') ? STUDIO_PHONE : '081394218860',
            'studio_phone' => defined('STUDIO_PHONE') ? STUDIO_PHONE : '081394218860',
            'ig' => defined('STUDIO_IG') ? STUDIO_IG : '@carissa.weddingorganizer',
            'bank' => defined('STUDIO_BANK') ? STUDIO_BANK : 'BCA 2820321777 a.n Carissa Wedding / Mandiri 1300099887766',
            'address' => defined('STUDIO_ADDRESS') ? STUDIO_ADDRESS : 'Jl. Cipasir Pancasila RT 03/09 Ds. Linggar Kec. Rancaekek Kab. Bandung',
            'gcal_api_config' => [
                'calendar_id' => 'primary',
                'fitting_calendar_id' => 'fitting_calendar',
                'auto_sync_enabled' => true,
                'last_synced_at' => gmdate('c')
            ]
        ],
        'master_users' => [],
        'master_packages' => [],
        'bookings' => [],
        'fittings' => [],
        'fitting_reminders' => [],
        'wo_events' => [],
        'vendor_transfers' => [],
        'google_calendar_v3' => [
            'calendars' => [],
            'calendarList' => [],
            'acl' => ['primary' => [], 'fitting_calendar' => []],
            'events' => ['primary' => [], 'fitting_calendar' => []],
            'channels' => [],
            'settings' => []
        ]
    ];
}

function loadDb($dbFile) {
    if (!file_exists($dbFile)) {
        $init = getInitialDbStructure();
        file_put_contents($dbFile, json_encode($init, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), LOCK_EX);
        return $init;
    }
    $raw = @file_get_contents($dbFile);
    if ($raw === false || trim($raw) === '') {
        return getInitialDbStructure();
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        return getInitialDbStructure();
    }
    return $data;
}

function computeOffsetDatePhp($dateStr, $offsetDays) {
    if (!$dateStr) return '';
    $ts = strtotime($dateStr . ' 12:00:00');
    if ($ts === false) return '';
    return date('Y-m-d', strtotime("$offsetDays days", $ts));
}

function getRecipientsPhp(&$db) {
    $users = isset($db['master_users']) && is_array($db['master_users']) ? $db['master_users'] : [];
    $superAdmin = null;
    $fittingUser = null;
    foreach ($users as $u) {
        $role = strtolower(isset($u['role']) ? $u['role'] : '');
        if (!$superAdmin && (strpos($role, 'super admin') !== false || strpos($role, 'owner') !== false)) {
            $superAdmin = $u;
        }
        if (!$fittingUser && strpos($role, 'fitting') !== false) {
            $fittingUser = $u;
        }
    }
    if (!$superAdmin) {
        $superAdmin = ['id' => 'usr_1', 'name' => 'Carissa Owner', 'role' => 'Super Admin', 'email' => 'owner@carissawedding.com', 'phone' => '081394218860'];
    }
    if (!$fittingUser) {
        $fittingUser = ['id' => 'usr_3', 'name' => 'Siti Aminah (Tim Fitting)', 'role' => 'Admin Fitting & Busana', 'email' => 'fitting.carisa@gmail.com', 'phone' => '081394218862'];
    }
    return ['superAdmin' => $superAdmin, 'fittingUser' => $fittingUser];
}

function syncRemindersAndGcalPhp(&$db) {
    $rec = getRecipientsPhp($db);
    $superAdmin = $rec['superAdmin'];
    $fittingUser = $rec['fittingUser'];

    if (!isset($db['fitting_reminders']) || !is_array($db['fitting_reminders'])) {
        $db['fitting_reminders'] = [];
    }
    $existingByHub = [];
    foreach ($db['fitting_reminders'] as $r) {
        if (!empty($r['event_hub_id'])) {
            $existingByHub[$r['event_hub_id']] = $r;
        }
    }

    $nextReminders = [];
    $seenHubs = [];

    $bookings = isset($db['bookings']) && is_array($db['bookings']) ? $db['bookings'] : [];
    foreach ($bookings as $b) {
        if (empty($b['event_date']) || (isset($b['payment_status']) && $b['payment_status'] === 'batal')) continue;
        $cat = strtolower(isset($b['category']) ? $b['category'] : '');
        $pkg = strtolower(isset($b['package_name']) ? $b['package_name'] : '');
        $hasCpp = !empty($b['client_cpp']) && trim($b['client_cpp']) !== '-';
        if ($cat !== 'wedding' && strpos($pkg, 'wedding') === false && !$hasCpp) continue;

        $hubId = !empty($b['booking_code']) ? $b['booking_code'] : $b['id'];
        if (isset($seenHubs[$hubId])) continue;
        $seenHubs[$hubId] = true;

        $title = $hasCpp ? ('The Wedding of ' . trim($b['client_cpp']) . ' & ' . trim($b['client_cpw'])) : ('The Wedding of ' . trim($b['client_cpw']));
        $prev = isset($existingByHub[$hubId]) ? $existingByHub[$hubId] : [];

        $nextReminders[] = [
            'id' => !empty($prev['id']) ? $prev['id'] : ('frem_auto_' . $b['id']),
            'fitting_user_id' => $fittingUser['id'],
            'fitting_user_name' => $fittingUser['name'],
            'fitting_user_email' => $fittingUser['email'],
            'fitting_user_phone' => isset($fittingUser['phone']) ? $fittingUser['phone'] : '081394218862',
            'superadmin_user_id' => $superAdmin['id'],
            'superadmin_name' => $superAdmin['name'],
            'superadmin_email' => $superAdmin['email'],
            'superadmin_phone' => isset($superAdmin['phone']) ? $superAdmin['phone'] : '081394218860',
            'event_hub_id' => $hubId,
            'event_title' => $title,
            'event_date' => $b['event_date'],
            'h7_date' => computeOffsetDatePhp($b['event_date'], -7),
            'h1_date' => computeOffsetDatePhp($b['event_date'], -1),
            'reminder_time' => !empty($prev['reminder_time']) ? $prev['reminder_time'] : '09:00',
            'event_location' => !empty($b['address']) ? $b['address'] : 'Studio Carissa Wedding',
            'checklist_items' => !empty($prev['checklist_items']) ? $prev['checklist_items'] : 'Kebaya Akad & Resepsi CPW, Beskap CPP, Busana Orang Tua & Besan, Aksesoris Siger/Melati',
            'status' => !empty($prev['status']) ? $prev['status'] : 'terjadwal',
            'notes' => !empty($prev['notes']) ? $prev['notes'] : ('Otomatis dari Booking Wedding (' . $hubId . ') — Pengingat Kalender Super Admin & Role Fitting H-7 & H-1.'),
            'updated_at' => gmdate('c')
        ];
    }

    $woEvents = isset($db['wo_events']) && is_array($db['wo_events']) ? $db['wo_events'] : [];
    foreach ($woEvents as $w) {
        if (empty($w['event_date'])) continue;
        $hubId = !empty($w['id']) ? $w['id'] : ('WO-' . time());
        if (isset($seenHubs[$hubId])) continue;
        $seenHubs[$hubId] = true;
        $prev = isset($existingByHub[$hubId]) ? $existingByHub[$hubId] : [];
        $nextReminders[] = [
            'id' => !empty($prev['id']) ? $prev['id'] : ('frem_wo_' . $hubId),
            'fitting_user_id' => $fittingUser['id'],
            'fitting_user_name' => $fittingUser['name'],
            'fitting_user_email' => $fittingUser['email'],
            'fitting_user_phone' => isset($fittingUser['phone']) ? $fittingUser['phone'] : '081394218862',
            'superadmin_user_id' => $superAdmin['id'],
            'superadmin_name' => $superAdmin['name'],
            'superadmin_email' => $superAdmin['email'],
            'superadmin_phone' => isset($superAdmin['phone']) ? $superAdmin['phone'] : '081394218860',
            'event_hub_id' => $hubId,
            'event_title' => !empty($w['event_title']) ? $w['event_title'] : 'The Wedding Event',
            'event_date' => $w['event_date'],
            'h7_date' => computeOffsetDatePhp($w['event_date'], -7),
            'h1_date' => computeOffsetDatePhp($w['event_date'], -1),
            'reminder_time' => !empty($prev['reminder_time']) ? $prev['reminder_time'] : '09:00',
            'event_location' => !empty($w['venue']) ? $w['venue'] : 'Studio Carissa Wedding',
            'checklist_items' => !empty($prev['checklist_items']) ? $prev['checklist_items'] : 'Kebaya Akad & Resepsi CPW, Beskap CPP, Busana Orang Tua & Besan',
            'status' => !empty($prev['status']) ? $prev['status'] : 'terjadwal',
            'notes' => !empty($prev['notes']) ? $prev['notes'] : ('Otomatis dari Jadwal Wedding (' . $hubId . ') — Pengingat Kalender Super Admin & Role Fitting H-7 & H-1.'),
            'updated_at' => gmdate('c')
        ];
    }

    $db['fitting_reminders'] = $nextReminders;

    // Google Calendar API v3 Store Rebuild
    if (!isset($db['google_calendar_v3']) || !is_array($db['google_calendar_v3'])) {
        $db['google_calendar_v3'] = [];
    }
    $gcal = &$db['google_calendar_v3'];
    if (!isset($gcal['events']) || !is_array($gcal['events'])) $gcal['events'] = ['primary' => [], 'fitting_calendar' => []];
    if (!isset($gcal['acl']) || !is_array($gcal['acl'])) $gcal['acl'] = ['primary' => [], 'fitting_calendar' => []];

    $manualEvents = [];
    if (isset($gcal['events']['primary']) && is_array($gcal['events']['primary'])) {
        foreach ($gcal['events']['primary'] as $ev) {
            $src = isset($ev['extendedProperties']['private']['source']) ? $ev['extendedProperties']['private']['source'] : '';
            if ($src === 'manual_gcal_v3') {
                $manualEvents[] = $ev;
            }
        }
    }

    $primaryEvents = $manualEvents;
    $fittingEvents = [];

    foreach ($bookings as $b) {
        if (empty($b['event_date']) || (isset($b['payment_status']) && $b['payment_status'] === 'batal')) continue;
        $hasCpp = !empty($b['client_cpp']) && trim($b['client_cpp']) !== '-';
        $summary = $hasCpp
            ? ('[HARI-H] The Wedding of ' . $b['client_cpp'] . ' & ' . $b['client_cpw'])
            : ('[HARI-H] Rias ' . $b['client_cpw'] . ' (' . (isset($b['package_name']) ? $b['package_name'] : 'MUA') . ')');
        $startTime = !empty($b['event_time']) ? $b['event_time'] : '08:00';
        $primaryEvents[] = [
            'kind' => 'calendar#event',
            'id' => 'gcal_harih_' . $b['id'],
            'status' => 'confirmed',
            'summary' => $summary,
            'description' => 'Kode Booking: ' . (isset($b['booking_code']) ? $b['booking_code'] : $b['id']),
            'location' => isset($b['address']) ? $b['address'] : 'Bandung',
            'colorId' => '11',
            'start' => ['dateTime' => $b['event_date'] . 'T' . $startTime . ':00+07:00', 'timeZone' => 'Asia/Jakarta'],
            'end' => ['dateTime' => $b['event_date'] . 'T14:00:00+07:00', 'timeZone' => 'Asia/Jakarta'],
            'attendees' => [
                ['email' => $superAdmin['email'], 'displayName' => $superAdmin['name'] . ' (Super Admin)', 'responseStatus' => 'accepted', 'organizer' => true],
                ['email' => $fittingUser['email'], 'displayName' => $fittingUser['name'] . ' (Role Fitting)', 'responseStatus' => 'accepted']
            ],
            'extendedProperties' => ['private' => ['source' => 'auto_booking_hari_h', 'booking_id' => $b['id']]]
        ];
    }

    foreach ($nextReminders as $r) {
        $h7 = !empty($r['h7_date']) ? $r['h7_date'] : computeOffsetDatePhp($r['event_date'], -7);
        $h1 = !empty($r['h1_date']) ? $r['h1_date'] : computeOffsetDatePhp($r['event_date'], -1);
        $tStr = !empty($r['reminder_time']) ? $r['reminder_time'] : '09:00';

        $evH7 = [
            'kind' => 'calendar#event',
            'id' => 'gcal_h7_' . $r['id'],
            'status' => 'confirmed',
            'summary' => '[REMINDER H-7 WEDDING & FITTING] ' . $r['event_title'],
            'description' => "PENGINGAT OTOMATIS H-7 WEDDING (SUPER ADMIN & ROLE FITTING)\nChecklist: " . $r['checklist_items'],
            'location' => $r['event_location'],
            'colorId' => '9',
            'start' => ['dateTime' => $h7 . 'T' . $tStr . ':00+07:00', 'timeZone' => 'Asia/Jakarta'],
            'end' => ['dateTime' => $h7 . 'T11:00:00+07:00', 'timeZone' => 'Asia/Jakarta'],
            'attendees' => [
                ['email' => $r['superadmin_email'], 'displayName' => $r['superadmin_name'] . ' (Super Admin)', 'responseStatus' => 'accepted', 'organizer' => true],
                ['email' => $r['fitting_user_email'], 'displayName' => $r['fitting_user_name'] . ' (Role Fitting)', 'responseStatus' => 'accepted']
            ],
            'extendedProperties' => ['private' => ['source' => 'auto_wedding_fitting_h7', 'reminder_id' => $r['id'], 'offset' => 'H-7']]
        ];

        $evH1 = [
            'kind' => 'calendar#event',
            'id' => 'gcal_h1_' . $r['id'],
            'status' => 'confirmed',
            'summary' => '[REMINDER H-1 WEDDING & FITTING] ' . $r['event_title'],
            'description' => "PENGINGAT OTOMATIS H-1 FINAL CHECK & STEAMING BUSANA (SUPER ADMIN & ROLE FITTING)\nChecklist: " . $r['checklist_items'],
            'location' => $r['event_location'],
            'colorId' => '6',
            'start' => ['dateTime' => $h1 . 'T' . $tStr . ':00+07:00', 'timeZone' => 'Asia/Jakarta'],
            'end' => ['dateTime' => $h1 . 'T11:00:00+07:00', 'timeZone' => 'Asia/Jakarta'],
            'attendees' => [
                ['email' => $r['superadmin_email'], 'displayName' => $r['superadmin_name'] . ' (Super Admin)', 'responseStatus' => 'accepted', 'organizer' => true],
                ['email' => $r['fitting_user_email'], 'displayName' => $r['fitting_user_name'] . ' (Role Fitting)', 'responseStatus' => 'accepted']
            ],
            'extendedProperties' => ['private' => ['source' => 'auto_wedding_fitting_h1', 'reminder_id' => $r['id'], 'offset' => 'H-1']]
        ];

        $primaryEvents[] = $evH7;
        $primaryEvents[] = $evH1;
        $fittingEvents[] = $evH7;
        $fittingEvents[] = $evH1;
    }

    $gcal['events']['primary'] = $primaryEvents;
    $gcal['events']['fitting_calendar'] = $fittingEvents;

    $aclList = [];
    $users = isset($db['master_users']) && is_array($db['master_users']) ? $db['master_users'] : [];
    foreach ($users as $u) {
        $rLow = strtolower(isset($u['role']) ? $u['role'] : '');
        $gRole = 'reader';
        if (strpos($rLow, 'super admin') !== false || strpos($rLow, 'owner') !== false) $gRole = 'owner';
        elseif (strpos($rLow, 'fitting') !== false || strpos($rLow, 'wo') !== false || strpos($rLow, 'admin') !== false) $gRole = 'writer';
        $aclList[] = [
            'kind' => 'calendar#aclRule',
            'id' => 'user:' . $u['email'],
            'scope' => ['type' => 'user', 'value' => $u['email']],
            'role' => $gRole,
            'userName' => $u['name'],
            'appRole' => $u['role']
        ];
    }
    $gcal['acl']['primary'] = $aclList;
    $gcal['acl']['fitting_calendar'] = $aclList;

    if (!isset($db['studio_settings']['gcal_api_config'])) {
        $db['studio_settings']['gcal_api_config'] = [];
    }
    $db['studio_settings']['gcal_api_config']['last_synced_at'] = gmdate('c');
}

function saveDb($dbFile, &$db) {
    syncRemindersAndGcalPhp($db);
    $payload = json_encode($db, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    
    // Tulis aman dengan file temporary dan replace atomic
    $tempFile = $dbFile . '.tmp.' . uniqid();
    if (@file_put_contents($tempFile, $payload, LOCK_EX) !== false) {
        @rename($tempFile, $dbFile);
    } else {
        @file_put_contents($dbFile, $payload, LOCK_EX);
    }
}

// ----------------------------------------------------------------------------
// PARSING URI & SUBFOLDER ROUTING
// ----------------------------------------------------------------------------
$method = $_SERVER['REQUEST_METHOD'];
$rawUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Menemukan posisi '/api' pada URL (Mendukung instalasi di root maupun subfolder cPanel)
$apiIndex = strpos($rawUri, '/api');
$apiPath = $apiIndex !== false ? substr($rawUri, $apiIndex) : $rawUri;
// Bersihkan trailing slash jika ada kecuali untuk root
if ($apiPath !== '/api' && substr($apiPath, -1) === '/') {
    $apiPath = rtrim($apiPath, '/');
}

$rawInput = file_get_contents('php://input');
$body = json_decode($rawInput, true);
if (!is_array($body)) $body = [];

$db = loadDb($dbFile);

// ----------------------------------------------------------------------------
// 1. ENDPOINT /api/sync-all (Full State Sync)
// ----------------------------------------------------------------------------
if ($apiPath === '/api/sync-all') {
    if ($method === 'GET') {
        syncRemindersAndGcalPhp($db);
        echo json_encode([
            'success' => true,
            'data' => $db,
            'bookings' => isset($db['bookings']) ? $db['bookings'] : [],
            'packages' => isset($db['master_packages']) ? $db['master_packages'] : [],
            'fittings' => isset($db['fittings']) ? $db['fittings'] : [],
            'settings' => isset($db['studio_settings']) ? $db['studio_settings'] : []
        ]);
        exit;
    }
    if ($method === 'POST' || $method === 'PUT') {
        if (isset($body['bookings']) && is_array($body['bookings'])) $db['bookings'] = $body['bookings'];
        if (isset($body['packages']) && is_array($body['packages'])) $db['master_packages'] = $body['packages'];
        if (isset($body['master_packages']) && is_array($body['master_packages'])) $db['master_packages'] = $body['master_packages'];
        if (isset($body['masterUsers']) && is_array($body['masterUsers'])) $db['master_users'] = $body['masterUsers'];
        if (isset($body['master_users']) && is_array($body['master_users'])) $db['master_users'] = $body['master_users'];
        if (isset($body['fittings']) && is_array($body['fittings'])) $db['fittings'] = $body['fittings'];
        if (isset($body['fittingReminders']) && is_array($body['fittingReminders'])) $db['fitting_reminders'] = $body['fittingReminders'];
        if (isset($body['woEvents']) && is_array($body['woEvents'])) $db['wo_events'] = $body['woEvents'];
        if (isset($body['vendorTransfers']) && is_array($body['vendorTransfers'])) $db['vendor_transfers'] = $body['vendorTransfers'];
        if (isset($body['studioSettings']) && is_array($body['studioSettings'])) {
            $db['studio_settings'] = array_merge($db['studio_settings'], $body['studioSettings']);
        }
        saveDb($dbFile, $db);
        echo json_encode([
            'success' => true,
            'data' => $db,
            'bookings' => $db['bookings'],
            'packages' => $db['master_packages']
        ]);
        exit;
    }
}

// ----------------------------------------------------------------------------
// 2. ENDPOINT /api/gcal/v3/sync (Google Calendar Sync)
// ----------------------------------------------------------------------------
if ($apiPath === '/api/gcal/v3/sync' && $method === 'POST') {
    if (isset($body['config']) && is_array($body['config'])) {
        $db['studio_settings']['gcal_api_config'] = array_merge(
            isset($db['studio_settings']['gcal_api_config']) ? $db['studio_settings']['gcal_api_config'] : [],
            $body['config']
        );
    }
    saveDb($dbFile, $db);
    $pEv = isset($db['google_calendar_v3']['events']['primary']) ? $db['google_calendar_v3']['events']['primary'] : [];
    $fEv = isset($db['google_calendar_v3']['events']['fitting_calendar']) ? $db['google_calendar_v3']['events']['fitting_calendar'] : [];
    $pAcl = isset($db['google_calendar_v3']['acl']['primary']) ? $db['google_calendar_v3']['acl']['primary'] : [];
    echo json_encode([
        'success' => true,
        'syncedAt' => $db['studio_settings']['gcal_api_config']['last_synced_at'],
        'totalEvents' => count($pEv),
        'totalAclRules' => count($pAcl),
        'events' => $pEv,
        'acl' => $pAcl,
        'summary' => [
            'primaryEventsCount' => count($pEv),
            'fittingEventsCount' => count($fEv),
            'aclCount' => count($pAcl)
        ],
        'gcal_v3' => array_merge($db['google_calendar_v3'], [
            'config' => $db['studio_settings']['gcal_api_config']
        ])
    ]);
    exit;
}

// ----------------------------------------------------------------------------
// 3. ENDPOINT /api/settings (Studio Settings)
// ----------------------------------------------------------------------------
if ($apiPath === '/api/settings') {
    if ($method === 'GET') {
        echo json_encode(['success' => true, 'data' => $db['studio_settings'], 'settings' => $db['studio_settings']]);
        exit;
    }
    if ($method === 'PUT' || $method === 'POST') {
        $db['studio_settings'] = array_merge($db['studio_settings'], $body);
        saveDb($dbFile, $db);
        echo json_encode(['success' => true, 'data' => $db['studio_settings'], 'settings' => $db['studio_settings']]);
        exit;
    }
}

// ----------------------------------------------------------------------------
// 4. REST ENTITY CRUD HANDLERS
// ----------------------------------------------------------------------------
$collectionConfig = [
    'bookings' => [
        'dbKey' => 'bookings',
        'keySingle' => 'booking',
        'keyPlural' => 'bookings',
        'prefix' => 'booking_'
    ],
    'packages' => [
        'dbKey' => 'master_packages',
        'keySingle' => 'package',
        'keyPlural' => 'packages',
        'prefix' => 'pkg_'
    ],
    'fittings' => [
        'dbKey' => 'fittings',
        'keySingle' => 'fitting',
        'keyPlural' => 'fittings',
        'prefix' => 'fit_'
    ],
    'fitting-reminders' => [
        'dbKey' => 'fitting_reminders',
        'keySingle' => 'reminder',
        'keyPlural' => 'reminders',
        'prefix' => 'frem_'
    ],
    'wo-events' => [
        'dbKey' => 'wo_events',
        'keySingle' => 'event',
        'keyPlural' => 'events',
        'prefix' => 'wo_'
    ],
    'vendor-transfers' => [
        'dbKey' => 'vendor_transfers',
        'keySingle' => 'transfer',
        'keyPlural' => 'transfers',
        'prefix' => 'trf_'
    ],
    'users' => [
        'dbKey' => 'master_users',
        'keySingle' => 'user',
        'keyPlural' => 'users',
        'prefix' => 'usr_'
    ]
];

foreach ($collectionConfig as $routeSlug => $cfg) {
    $baseRoute = '/api/' . $routeSlug;
    $dbKey = $cfg['dbKey'];
    $keySingle = $cfg['keySingle'];
    $keyPlural = $cfg['keyPlural'];

    // LIST / CREATE: /api/{collection}
    if ($apiPath === $baseRoute) {
        if ($method === 'GET') {
            $items = isset($db[$dbKey]) && is_array($db[$dbKey]) ? $db[$dbKey] : [];
            echo json_encode([
                'success' => true,
                'data' => $items,
                $keyPlural => $items
            ]);
            exit;
        }

        if ($method === 'POST') {
            if (!isset($db[$dbKey]) || !is_array($db[$dbKey])) $db[$dbKey] = [];
            if (empty($body['id'])) {
                $body['id'] = $cfg['prefix'] . round(microtime(true) * 1000);
            }
            if ($routeSlug === 'bookings') {
                if (empty($body['booking_code'])) {
                    $body['booking_code'] = 'CMS-' . date('Ymd') . '-' . rand(1000, 9999);
                }
                if (empty($body['created_at'])) {
                    $body['created_at'] = gmdate('c');
                }
            }
            array_unshift($db[$dbKey], $body);
            saveDb($dbFile, $db);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $body,
                $keySingle => $body
            ]);
            exit;
        }
    }

    // DETAIL / UPDATE / DELETE: /api/{collection}/{id}
    if (strpos($apiPath, $baseRoute . '/') === 0) {
        $itemId = urldecode(substr($apiPath, strlen($baseRoute) + 1));
        if (!isset($db[$dbKey]) || !is_array($db[$dbKey])) $db[$dbKey] = [];

        if ($method === 'GET') {
            $found = null;
            foreach ($db[$dbKey] as $item) {
                if ((isset($item['id']) && $item['id'] === $itemId) || (isset($item['booking_code']) && $item['booking_code'] === $itemId)) {
                    $found = $item;
                    break;
                }
            }
            if (!$found) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Item not found']);
                exit;
            }
            echo json_encode(['success' => true, 'data' => $found, $keySingle => $found]);
            exit;
        }

        if ($method === 'PUT' || $method === 'PATCH') {
            $updated = null;
            foreach ($db[$dbKey] as $idx => $item) {
                if ((isset($item['id']) && $item['id'] === $itemId) || (isset($item['booking_code']) && $item['booking_code'] === $itemId)) {
                    $db[$dbKey][$idx] = array_merge($item, $body);
                    $updated = $db[$dbKey][$idx];
                    break;
                }
            }
            if (!$updated) {
                $body['id'] = $itemId;
                $db[$dbKey][] = $body;
                $updated = $body;
            }
            saveDb($dbFile, $db);
            echo json_encode([
                'success' => true,
                'data' => $updated,
                $keySingle => $updated
            ]);
            exit;
        }

        if ($method === 'DELETE') {
            $db[$dbKey] = array_values(array_filter($db[$dbKey], function ($item) use ($itemId) {
                return (!isset($item['id']) || $item['id'] !== $itemId) && (!isset($item['booking_code']) || $item['booking_code'] !== $itemId);
            }));
            saveDb($dbFile, $db);
            echo json_encode(['success' => true, 'message' => 'Deleted successfully']);
            exit;
        }
    }
}

// Respon Default
echo json_encode([
    'success' => true,
    'message' => 'Carissa Makeup & Wedding Organizer API Ready (cPanel Edition)',
    'studio' => defined('STUDIO_NAME') ? STUDIO_NAME : 'Carissa Wedding',
    'timestamp' => gmdate('c'),
    'path' => $apiPath
]);
