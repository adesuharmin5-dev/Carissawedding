/**
 * CARISSA PROFESIONAL MAKE UP ARTIST & WEDDING ORGANIZER
 * cPanel Node.js Selector (Phusion Passenger) Entry Point
 * -------------------------------------------------------
 * Di cPanel -> "Setup Node.js App", arahkan "Application startup file" ke:
 * app.js (atau server.js)
 */

const server = require('./server.js');
module.exports = server;
