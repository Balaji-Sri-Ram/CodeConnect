const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Submission = require('../models/Submission');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

// Register Helper
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d',
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const { email, password, full_name, role } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            email,
            password: hashedPassword,
            role: role || 'student',
        });

        await user.save();

        // Create Profile
        const profile = new Profile({
            user: user._id,
            full_name: full_name || email.split('@')[0],
            role: role || 'student', // Redundant but useful in profile
        });

        await profile.save();

        res.json({
            _id: user._id,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/auth/login
// @desc    Auth user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({
            _id: user._id,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
// We need middleware for this. For now layout the route.
// router.get('/me', auth, async (req, res) => { ... });

// @route   PUT /api/auth/password
// @desc    Update user password
// @access  Private
router.put('/password', protect, async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'Please provide a new password' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // protect middleware ensures req.user.id is available
        const user = await User.findById(req.user.id);

        if (user) {
            user.password = hashedPassword;
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE /api/auth/profile
// @desc    Delete user and profile
// @access  Private
router.delete('/profile', protect, async (req, res) => {
    try {
        // Remove submissions
        await Submission.deleteMany({ user: req.user.id });
        // Remove notifications
        await Notification.deleteMany({ recipient: req.user.id });
        // Remove profile
        await Profile.findOneAndDelete({ user: req.user.id });
        // Remove user
        await User.findOneAndDelete({ _id: req.user.id });

        res.json({ message: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
