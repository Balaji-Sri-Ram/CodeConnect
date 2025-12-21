const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Profile = require('../models/Profile');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/submissions
// @desc    Submit a solution
// @access  Private
router.post('/', protect, async (req, res) => {
    const { problem_id, code, language, status, type } = req.body; // Added type: 'problem' | 'challenge'

    try {
        const submissionData = {
            user: req.user.id,
            code,
            language,
            status
        };

        // Assign to correct field based on type
        if (type === 'challenge') {
            submissionData.challenge = problem_id;
        } else {
            submissionData.problem = problem_id;
        }

        const submission = new Submission(submissionData);
        await submission.save();

        if (status === 'passed') {
            const profile = await Profile.findOne({ user: req.user.id });

            // Determine which model to query
            let ProblemModel;
            if (type === 'challenge') {
                ProblemModel = require('../models/Challenge');
            } else {
                ProblemModel = require('../models/Problem');
            }

            const problemDoc = await ProblemModel.findById(problem_id);

            if (profile && problemDoc) {
                // Check if user already solved this specific problem/challenge
                const query = {
                    user: req.user.id,
                    status: 'passed',
                    _id: { $ne: submission._id }
                };

                // Add problem/challenge filter
                if (type === 'challenge') {
                    query.challenge = problem_id;
                } else {
                    query.problem = problem_id;
                }

                const existingPassed = await Submission.findOne(query);

                if (!existingPassed) {
                    let coinsToAdd = 10; // Default (Easy)
                    const diff = problemDoc.difficulty ? problemDoc.difficulty.toLowerCase() : 'easy';

                    if (diff === 'medium') coinsToAdd = 25;
                    else if (diff === 'hard') coinsToAdd = 50;

                    profile.coins += coinsToAdd;
                    await profile.save();

                    // Create Notification
                    try {
                        const Notification = require('../models/Notification');
                        const notifTitle = (problemDoc && problemDoc.title) ? problemDoc.title : "Problem Solved";
                        const notifMessage = type === 'challenge'
                            ? "Company Challenge"
                            : "Practice Problem";

                        await new Notification({
                            recipient: req.user.id,
                            type: 'coin_reward',
                            title: notifTitle,
                            message: notifMessage,
                            metadata: { coins: coinsToAdd }
                        }).save();
                    } catch (notifError) {
                        console.error("Notification creation failed:", notifError);
                    }

                    // Return with coins awarded
                    return res.json({ submission, coinsAwarded: coinsToAdd });
                }
            }
        }

        // Return submission with 0 coins if not passed or already solved (or profile/problem not found)
        res.json({ submission, coinsAwarded: 0 });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/submissions/my
// @desc    Get current user submissions
// @access  Private
router.get('/my', protect, async (req, res) => {
    try {
        const submissions = await Submission.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .populate('problem', ['title', 'difficulty'])
            .populate('challenge', ['title', 'difficulty']);
        res.json(submissions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/submissions/stats
// @desc    Get user stats (solved counts)
// @access  Private
router.get('/stats', protect, async (req, res) => {
    try {
        const submissions = await Submission.find({ user: req.user.id, status: 'passed' })
            .populate('problem', 'difficulty')
            .populate('challenge', 'difficulty');

        // Calculate stats
        // Dedup problems
        const solvedMap = new Map();
        submissions.forEach(sub => {
            const item = sub.problem || sub.challenge;
            if (item) {
                solvedMap.set(item._id.toString(), item.difficulty);
            }
        });

        const stats = {
            total: solvedMap.size,
            easy: 0,
            medium: 0,
            hard: 0
        };

        solvedMap.forEach((difficulty) => {
            const diff = difficulty.toLowerCase();
            if (stats[diff] !== undefined) {
                stats[diff]++;
            }
        });

        res.json(stats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/submissions/stats/:userId
// @desc    Get user stats by user ID
// @access  Public
router.get('/stats/:userId', async (req, res) => {
    try {
        const submissions = await Submission.find({ user: req.params.userId, status: 'passed' })
            .populate('problem', 'difficulty')
            .populate('challenge', 'difficulty');

        // Calculate stats
        // Dedup problems
        const solvedMap = new Map();
        submissions.forEach(sub => {
            const item = sub.problem || sub.challenge;
            if (item) {
                solvedMap.set(item._id.toString(), item.difficulty);
            }
        });

        const stats = {
            total: solvedMap.size,
            easy: 0,
            medium: 0,
            hard: 0
        };

        solvedMap.forEach((difficulty) => {
            const diff = difficulty.toLowerCase();
            if (stats[diff] !== undefined) {
                stats[diff]++;
            }
        });

        res.json(stats);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            // Return empty stats instead of 404/500 if user valid but no subs
            return res.json({ total: 0, easy: 0, medium: 0, hard: 0 });
        }
        res.status(500).send('Server error');
    }
});

module.exports = router;
