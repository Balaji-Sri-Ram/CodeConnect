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
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['email', 'role']);

        if (!profile) {
            return res.status(400).json({ message: 'There is no profile for this user' });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
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

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (full_name) profileFields.full_name = full_name;
    if (bio) profileFields.bio = bio;
    if (resume_url) profileFields.resume_url = resume_url;
    if (whatsapp) profileFields.whatsapp = whatsapp;
    if (github_url) profileFields.github_url = github_url;
    if (linkedin_url) profileFields.linkedin_url = linkedin_url;
    if (avatar_url !== undefined) profileFields.avatar_url = avatar_url;
    if (company_name) profileFields.company_name = company_name;
    if (website) profileFields.website = website;

    try {
        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            // Update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
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
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/profile/:id
// @desc    Get profile by user ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.id }).populate('user', ['email', 'role']);

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
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['email', 'role']).sort({ coins: -1 });
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
        // 1. Total Candidates (Students/Developers) -> Count of users with role 'student'
        const totalCandidates = await User.countDocuments({ role: 'student' });

        // 2. Top Performers
        // Logic:
        // - Sort students by coins descending
        // - If top 1 has more coins than top 2 -> 1
        // - If top 1 and top 2 same coins -> 2
        // - If top 1, 2, 3 same coins -> 3
        // - Generally: Count how many students have the MAX score found.

        let topPerformersCount = 0;

        // Find highest coin count first
        const maxCoinProfile = await Profile.findOne().sort({ coins: -1 }).select('coins');

        if (maxCoinProfile) {
            const maxCoins = maxCoinProfile.coins;
            // Count how many profiles have this maxCoins
            topPerformersCount = await Profile.countDocuments({ coins: maxCoins });
        }

        // 3. Engagement 
        // Logic: (Unique Users with PASSED submissions / Unique Users with ANY submissions) * 100

        // Get all challenges for this company
        const myChallenges = await Challenge.find({ company: req.user.id }).select('_id');
        const challengeIds = myChallenges.map(c => c._id);

        let engagement = 0;

        if (challengeIds.length > 0) {
            // Find unique users who have submitted (ANY status) to these challenges
            const startersCount = await Submission.distinct('user', {
                challenge: { $in: challengeIds }
            });
            const totalStarters = startersCount.length;

            if (totalStarters > 0) {
                // Find unique users who have passed these challenges
                const completersCount = await Submission.distinct('user', {
                    challenge: { $in: challengeIds },
                    status: 'passed'
                });
                const totalCompleters = completersCount.length;

                engagement = Math.round((totalCompleters / totalStarters) * 100);
            }
        }

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
