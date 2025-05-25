require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    mongoURI: process.env.MONGO_DB_URL || '',
    jwtSecret: process.env.JWT_SECRET || '',
    backendUrl: process.env.BACKEND_URL || 'http://localhost:3000',
    mode: process.env.NODE_ENV || 'development',
    emailUser: process.env.EMAIL_USER,
    emailPassword: process.env.EMAIL_PASSWORD,
};
