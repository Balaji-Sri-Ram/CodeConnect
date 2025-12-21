const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    full_name: {
        type: String,
    },
    avatar_url: {
        type: String,
    },
    coins: {
        type: Number,
        default: 0,
    },
    bio: {
        type: String,
    },
    resume_url: {
        type: String,
    },
    whatsapp: {
        type: String,
    },
    github_url: {
        type: String,
    },
    linkedin_url: {
        type: String,
    },
    company_name: { // For company profiles
        type: String,
    },
    website: {
        type: String,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Profile', ProfileSchema);
