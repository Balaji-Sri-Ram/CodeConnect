const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');

// @route   GET /api/problems
// @desc    Get all problems
// @access  Public
router.get('/', async (req, res) => {
    try {
        let query = Problem.find().select('-input -output'); // Hide test cases from list

        if (req.query.limit) {
            query = query.limit(parseInt(req.query.limit));
        }

        const problems = await query;
        res.json(problems);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/problems/:id
// @desc    Get problem by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);

        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        res.json(problem);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Problem not found' });
        }
        res.status(500).send('Server error');
    }
});

module.exports = router;
