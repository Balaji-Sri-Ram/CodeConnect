const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const { protect } = require('../middleware/authMiddleware');

const Profile = require('../models/Profile'); // Ensure Profile is required

// @route   GET /api/challenges
// @desc    Get all challenges
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Fetch challenges and populate basic user info
        let query = Challenge.find().populate('company', ['email']);

        if (req.query.limit) {
            query = query.limit(parseInt(req.query.limit));
        }

        const challenges = await query.lean(); // Use lean() for easier modification

        // Get unique company user IDs
        const companyIds = challenges.map(c => c.company?._id || c.company).filter(id => id);

        // Fetch profiles for these companies
        const profiles = await Profile.find({ user: { $in: companyIds } }).lean();

        // Create a map of user_id -> company_name
        const companyMap = {};
        profiles.forEach(p => {
            if (p.user) {
                companyMap[p.user.toString()] = p.company_name || p.full_name || "Unknown Company";
            }
        });

        // Attach company_name to challenges
        const challengesWithCompany = challenges.map(challenge => {
            const companyId = (challenge.company?._id || challenge.company || "").toString();
            let companyName = companyMap[companyId];

            // If profile didn't give a name, try to fallback to email from the populated User object
            if (!companyName || companyName === "Unknown Company") {
                if (challenge.company && challenge.company.email) {
                    const emailName = challenge.company.email.split('@')[0];
                    companyName = emailName.charAt(0).toUpperCase() + emailName.slice(1); // Capitalize
                } else {
                    companyName = "Unknown Company";
                }
            }

            // If challenge.company is an object, add company_name to it
            if (challenge.company && typeof challenge.company === 'object') {
                challenge.company.company_name = companyName;
            } else {
                challenge.company = {
                    _id: companyId,
                    company_name: companyName
                };
            }
            return challenge;
        });

        res.json(challengesWithCompany);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/challenges
// @desc    Create a challenge
// @access  Private (Company only)
router.post('/', protect, async (req, res) => {
    if (req.user.role !== 'company') {
        return res.status(403).json({ message: 'Only companies can create challenges' });
    }

    const { title, description, difficulty, topic, input_example, output_example, deadline } = req.body;

    try {
        const challenge = new Challenge({
            company: req.user.id,
            title,
            description,
            difficulty,
            topic,
            input_example,
            output_example,
            deadline
        });

        await challenge.save();

        // Notify all students
        try {
            const User = require('../models/User');
            const Notification = require('../models/Notification');
            const Profile = require('../models/Profile');

            // Get creator company name
            const companyProfile = await Profile.findOne({ user: req.user.id }).populate('user', ['email']);

            let companyName = companyProfile?.company_name;

            if (!companyName) {
                companyName = companyProfile?.full_name;
            }

            if (!companyName && companyProfile?.user?.email) {
                const emailName = companyProfile.user.email.split('@')[0];
                companyName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
            }

            if (!companyName) {
                companyName = "Unknown Company";
            }

            // Find all students
            const students = await User.find({ role: 'student' }).select('_id');
            console.log(`Found ${students.length} students to notify.`);

            if (students.length > 0) {
                const notifications = students.map(student => ({
                    recipient: student._id,
                    type: 'new_challenge',
                    title: title,
                    message: `Created by ${companyName}`,
                    metadata: { companyId: req.user.id, challengeId: challenge._id }
                }));

                await Notification.insertMany(notifications);
                console.log(`Created ${notifications.length} notifications for new challenge.`);
            }

        } catch (notifErr) {
            console.error("Failed to create notifications for challenge:", notifErr);
        }

        res.json(challenge);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/challenges/my
// @desc    Get challenges created by current company
// @access  Private
router.get('/my', protect, async (req, res) => {
    try {
        const challenges = await Challenge.find({ company: req.user.id });
        res.json(challenges);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT /api/challenges/:id
// @desc    Update a challenge
// @access  Private (Company only)
router.put('/:id', protect, async (req, res) => {
    try {
        let challenge = await Challenge.findById(req.params.id);

        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }

        // Check user
        // Check user
        if (!challenge.company) {
            console.error(`Challenge ${challenge._id} has no company assigned.`);
            return res.status(401).json({ message: 'Challenge has no company, cannot verify ownership.' });
        }

        const companyId = challenge.company._id ? challenge.company._id.toString() : challenge.company.toString();

        console.log(`PUT /challenges/:id - Challenge Company: ${companyId}, Request User: ${req.user.id}`);

        if (companyId !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const { title, description, difficulty, topic, input_example, output_example, deadline } = req.body;

        const challengeFields = {};
        if (title) challengeFields.title = title;
        if (description) challengeFields.description = description;
        if (difficulty) challengeFields.difficulty = difficulty;
        if (topic) challengeFields.topic = topic;
        if (input_example) challengeFields.input_example = input_example;
        if (output_example) challengeFields.output_example = output_example;
        if (deadline) challengeFields.deadline = deadline;

        challenge = await Challenge.findByIdAndUpdate(
            req.params.id,
            { $set: challengeFields },
            { new: true }
        );

        res.json(challenge);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        res.status(500).send('Server error');
    }
});

// @route   DELETE /api/challenges/:id
// @desc    Delete a challenge
// @access  Private (Company only)
router.delete('/:id', protect, async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);

        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }

        // Check user
        // Check user
        if (!challenge.company) {
            console.error(`Challenge ${challenge._id} has no company assigned.`);
            return res.status(401).json({ message: 'Challenge has no company, cannot verify ownership.' });
        }

        const companyId = challenge.company._id ? challenge.company._id.toString() : challenge.company.toString();

        console.log(`DELETE /challenges/:id - Challenge Company: ${companyId}, Request User: ${req.user.id}`);

        if (companyId !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await challenge.deleteOne();

        res.json({ message: 'Challenge removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        res.status(500).send('Server error');
    }
});

module.exports = router;
