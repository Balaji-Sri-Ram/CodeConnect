const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
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
        enum: ['Easy', 'Medium', 'Hard'], // Using Title Case to match JSON
        required: true,
    },
    topics: [{
        type: String,
    }],
    input: {
        type: String,
    },
    output: {
        type: String,
    },
    // Can add testCases array if we want structured test cases later
});

module.exports = mongoose.model('Problem', ProblemSchema);
