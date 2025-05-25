const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./utils/db');
const routes = require('./routes');
const errorHandler = require('./utils/errorHandler');
const logger = require('./utils/logger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for audio and images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use('/', routes);

// Error handling
app.use(errorHandler);

// Database connection
connectDB()
  .then(() => {
    logger.info('Connected to MongoDB Atlas');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error('Failed to connect to MongoDB Atlas', error);
  });

module.exports = app;
