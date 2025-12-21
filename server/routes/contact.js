const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// @route   POST api/contact
// @desc    Save contact message
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const newContact = new Contact({
            name,
            email,
            message
        });

        const savedContact = await newContact.save();

        res.json(savedContact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
