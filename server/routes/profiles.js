const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const User = require('../models/User'); // Import User model
const Challenge = require('../models/Challenge'); // Import Challenge model
const Submission = require('../models/Submission'); // Import Submission model
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        let profile = await Profile.findOne({ user: userId }).populate('user', ['email', 'role']).lean();

        if (!profile) {
            // Self-healing: auto-create default profile for this user if it doesn't exist
            const defaultName = req.user.email ? req.user.email.split('@')[0] : 'User';
            const newProfile = new Profile({
                user: userId,
                full_name: defaultName,
                role: req.user.role || 'student',
                coins: 0
            });
            await newProfile.save();
            profile = await Profile.findById(newProfile._id).populate('user', ['email', 'role']).lean();
        }

        res.json(profile);
    } catch (err) {
        console.error("Error in GET /profile/me:", err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', protect, async (req, res) => {
    const {
        full_name,
        bio,
        resume_url,
        whatsapp,
        github_url,
        linkedin_url,
        avatar_url,
        company_name,
        website
    } = req.body;

    const userId = req.user.id || req.user._id;

    // Build profile object
    const profileFields = {};
    profileFields.user = userId;
    if (full_name !== undefined) profileFields.full_name = full_name;
    if (bio !== undefined) profileFields.bio = bio;
    if (resume_url !== undefined) profileFields.resume_url = resume_url;
    if (whatsapp !== undefined) profileFields.whatsapp = whatsapp;
    if (github_url !== undefined) profileFields.github_url = github_url;
    if (linkedin_url !== undefined) profileFields.linkedin_url = linkedin_url;
    if (avatar_url !== undefined) profileFields.avatar_url = avatar_url;
    if (company_name !== undefined) profileFields.company_name = company_name;
    if (website !== undefined) profileFields.website = website;

    try {
        let profile = await Profile.findOne({ user: userId });

        if (profile) {
            // Update
            profile = await Profile.findOneAndUpdate(
                { user: userId },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
        }

        // Create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error("Error in POST /profile:", err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/profile/:id
// @desc    Get profile by user ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.id }).populate('user', ['email', 'role']).lean();

        if (!profile) return res.status(400).json({ message: 'Profile not found' });

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ message: 'Profile not found' });
        }
        res.status(500).send('Server error');
    }
});

// @route   GET /api/profile
// @desc    Get all profiles (supports optional ?role=student or ?role=company)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const query = {};
        if (req.query.role) {
            const matchingUsers = await User.find({ role: req.query.role }).select('_id').lean();
            const userIds = matchingUsers.map(u => u._id);
            query.user = { $in: userIds };
        }

        let dbQuery = Profile.find(query).populate('user', ['email', 'role']).sort({ coins: -1 }).lean();

        if (req.query.limit) {
            dbQuery = dbQuery.limit(parseInt(req.query.limit));
        }

        const profiles = await dbQuery;
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/profile/stats/company
// @desc    Get company dashboard stats
// @access  Private (Company only ideally, but keeping generic protect for now)
router.get('/stats/company', protect, async (req, res) => {
    try {
        // Parallelize initial queries
        const [totalCandidates, maxCoinProfile, myChallenges] = await Promise.all([
            User.countDocuments({ role: 'student' }),
            Profile.findOne().sort({ coins: -1 }).select('coins').lean(),
            Challenge.find({ company: req.user.id }).select('_id').lean()
        ]);

        let topPerformersCount = 0;
        let engagement = 0;

        const secondaryPromises = [];

        if (maxCoinProfile) {
            secondaryPromises.push(
                Profile.countDocuments({ coins: maxCoinProfile.coins }).then(c => {
                    topPerformersCount = c;
                })
            );
        }

        const challengeIds = myChallenges.map(c => c._id);
        if (challengeIds.length > 0) {
            secondaryPromises.push(
                Promise.all([
                    Submission.distinct('user', { challenge: { $in: challengeIds } }),
                    Submission.distinct('user', { challenge: { $in: challengeIds }, status: 'passed' })
                ]).then(([starters, completers]) => {
                    if (starters.length > 0) {
                        engagement = Math.round((completers.length / starters.length) * 100);
                    }
                })
            );
        }

        await Promise.all(secondaryPromises);

        res.json({
            totalCandidates,
            topPerformers: topPerformersCount,
            engagement: `${engagement}%`
        });

    } catch (err) {
        console.error("Error fetching company stats:", err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
