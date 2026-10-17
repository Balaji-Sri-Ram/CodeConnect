const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

            const user = await User.findById(decoded.id).select('-password').lean();

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // CRITICAL: .lean() removes Mongoose virtuals, so assign user.id explicitly
            user.id = user._id.toString();
            req.user = user;

            return next();
        } catch (error) {
            console.warn(`[Auth Warning] ${error.message}`);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
