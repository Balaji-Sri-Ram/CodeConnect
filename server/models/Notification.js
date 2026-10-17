
const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['new_challenge', 'coin_reward', 'info'],
        default: 'info'
    },
    title: {
        type: String, // e.g., "New Challenge Posted", "Daily Challenge Completed"
        required: true
    },
    message: {
        type: String, // Subtitle text: "Created by Google", "LeetCoding Challenge 2025"
    },
    metadata: {
        type: Object, // Flexible container for: { coins: 10, companyId: "...", companyName: "Google" }
        default: {}
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes for notification queries and mark-all-read updates
NotificationSchema.index({ recipient: 1, createdAt: -1 });
NotificationSchema.index({ recipient: 1, isRead: 1 });

module.exports = mongoose.model('Notification', NotificationSchema);

