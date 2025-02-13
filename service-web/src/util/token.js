const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const generateToken = (user) => {
    return jwt.sign({ id: user.member_id, username: user.username }, JWT_SECRET, {
        expiresIn: '1h',
    });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.member_id, username: user.username }, JWT_SECRET, {
        expiresIn: '5h',
    });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

const decodeToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

module.exports = {
    generateToken,
    generateRefreshToken,
    verifyToken,
    decodeToken,
};

