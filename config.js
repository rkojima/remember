exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       'mongodb://localhost/rememorari';
exports.PORT = process.env.PORT || 8080;

// To configure the database URL, so that it could get, post, put, delete, etc.?