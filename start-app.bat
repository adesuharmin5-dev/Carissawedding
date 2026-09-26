@echo off
title CARISSA PROFESIONAL MAKE UP ARTIST & WEDDING ORGANIZER
cls
echo =========================================================================
echo       CARISSA PROFESIONAL MAKE UP ARTIST & WEDDING ORGANIZER           
echo =========================================================================
echo.
echo  [1] Buka Form Booking Klien (booking.html / index.html)
echo  [2] Buka Panel Khusus Admin (admin.html)
echo  [3] Jalankan Server Node.js (API + Web Hosting)
echo  [4] Keluar
echo.
echo =========================================================================
set /p choice="Pilih menu (1/2/3/4): "

if "%choice%"=="1" (
    echo Membuka Form Booking Klien...
    start "" "%~dp0booking.html"
    exit
)

if "%choice%"=="2" (
    echo Membuka Panel Khusus Admin...
    start "" "%~dp0admin.html"
    exit
)

if "%choice%"=="3" (
    echo Menjalankan Node.js Server di http://localhost:3000 ...
    node "%~dp0server.js"
    pause
    exit
)

if "%choice%"=="4" (
    exit
)

start "" "%~dp0booking.html"
exit
