const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Basic Route
app.get('/', (req, res) => {
    res.send('CodeConnect API is running');
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

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
