require('dotenv').config()

module.exports = {
    PORT: process.env.PORT || 3000,
    MONGODB_URL: process.env.MONGODB_URL,
    MONGO_PASS: process.env.MONGO_PASS,
    // Add other configuration settings here
  };