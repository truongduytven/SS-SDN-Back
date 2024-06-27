const jwt = require('jsonwebtoken');
const { Member } = require('../models/allModel');

function authenticateToken(req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
    const decoded = jwt.verify(token, 'helloduy');
    req.user = decoded;
    Member.findById(req.user.userId).select('-password').then(member => {
        if(!member) {
            return res.status(401).json({ message: 'Access denied. User not found.' });
        }
        req.user = member;
        next();
    }).catch(err => {
        res.status(500).json({ message: 'Internal server error.' });
    })
    } catch {
        res.status(400).json({ message: 'Invalid token.' });
    }
}

function checkAdmin(req, res, next) {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
}
module.exports = { checkAdmin, authenticateToken }