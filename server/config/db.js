const mongoose = require('mongoose');

// Connection options optimized for MongoDB Atlas and serverless/container hosts like Render
const mongooseOptions = {
    maxPoolSize: 10,             // Maintain up to 10 socket connections
    minPoolSize: 2,              // Keep at least 2 connections open for fast responses
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging on cold start
    socketTimeoutMS: 45000,      // Close sockets after 45s of inactivity
    family: 4                    // Use IPv4, avoids DNS resolution delays on cloud hosts
};

let isConnected = false;

const connectDB = async () => {
    if (isConnected && mongoose.connection.readyState === 1) {
        return;
    }

    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/codeconnect';
        const conn = await mongoose.connect(uri, mongooseOptions);

        isConnected = true;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        // Avoid process.exit in cloud containers if reconnect is possible, but log clearly
        if (process.env.NODE_ENV === 'production') {
            console.error('Server will attempt reconnect on next request');
        } else {
            process.exit(1);
        }
    }
};

// Connection lifecycle event listeners
mongoose.connection.on('connected', () => {
    isConnected = true;
    console.log('MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
    console.error(`MongoDB runtime error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('MongoDB disconnected. Reconnecting...');
});

// Graceful shutdown
const gracefulExit = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
        console.log('MongoDB connection closed due to app termination');
    }
    process.exit(0);
};

process.on('SIGINT', gracefulExit);
process.on('SIGTERM', gracefulExit);

module.exports = connectDB;