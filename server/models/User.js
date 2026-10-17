const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'company'],
        default: 'student',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Index for role-based counts and notification dispatch
UserSchema.index({ role: 1 });

module.exports = mongoose.model('User', UserSchema);

