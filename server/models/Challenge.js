const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Linking to the User who created it (role: company)
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'easy',
    },
    topic: {
        type: String,
    },
    input_example: {
        type: String,
    },
    output_example: {
        type: String,
    },
    deadline: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Index for company challenge queries and sorting
ChallengeSchema.index({ company: 1, createdAt: -1 });

module.exports = mongoose.model('Challenge', ChallengeSchema);

