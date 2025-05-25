const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./logger');

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        logger.info('MongoDB Atlas connection successful');
    } catch (error) {
        logger.error('MongoDB connection failed', error);
        process.exit(1); 
    }
};

module.exports = connectDB;
