const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        // required: true, // Can be null if it's a company challenge? Or use a separate field? 
        // Let's keep it optional or use dynamic refs if needed. 
        // For now, let's assume standard problems have this.
    },
    challenge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Challenge',
    },
    code: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        default: 'javascript',
    },
    status: {
        type: String,
        enum: ['passed', 'failed', 'compiling'],
        default: 'compiling',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Indexes for user submission lookups, history sorting, and stats calculation
SubmissionSchema.index({ user: 1, createdAt: -1 });
SubmissionSchema.index({ user: 1, status: 1 });
SubmissionSchema.index({ challenge: 1, status: 1 });
SubmissionSchema.index({ user: 1, problem: 1, status: 1 });

module.exports = mongoose.model('Submission', SubmissionSchema);

