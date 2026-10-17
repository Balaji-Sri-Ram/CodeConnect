const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Configure dotenv to load from root directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('./config/db');

const app = express();

// Performance Diagnostics: Safe Request Duration Logger
// Logs [TIMESTAMP] METHOD /path STATUS - XX.Xms (never logs bodies, passwords, or tokens)
app.use((req, res, next) => {
    const start = process.hrtime.bigint();
    res.on('finish', () => {
        // Exclude frequent /health pings from cluttering logs if desired, or keep as a one-line debug
        const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
        const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
        const logLine = `[${timestamp}] ${req.method} ${req.originalUrl || req.url} ${res.statusCode} - ${elapsedMs.toFixed(1)}ms`;

        // Highlight slow queries/endpoints (> 500ms) for performance tracking
        if (elapsedMs > 500) {
            console.warn(`⚠️ [SLOW REQUEST] ${logLine}`);
        } else {
            console.log(logLine);
        }
    });
    next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Basic Route
app.get('/', (req, res) => {
    res.send('CodeConnect API is running');
});

// Lightweight Health Check Endpoint (For UptimeRobot / Pingers)
// Returns HTTP 200 immediately without running expensive database queries
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: Math.round(process.uptime())
    });
});

// Readiness Endpoint (Checks MongoDB connection health)
app.get('/health/ready', (req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    if (isDbConnected) {
        return res.status(200).json({
            status: 'ready',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    }

    return res.status(503).json({
        status: 'degraded',
        database: 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/problems', require('./routes/problems'));
app.use('/api/profile', require('./routes/profiles'));
app.use('/api/submissions', require('./routes/submissions'));
app.use('/api/challenges', require('./routes/challenges'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/notifications', require('./routes/notifications'));

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Global Asynchronous Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(`[Unhandled Error] ${err.message}`, err.stack);
    if (res.headersSent) {
        return next(err);
    }
    res.status(err.status || 500).json({
        message: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

