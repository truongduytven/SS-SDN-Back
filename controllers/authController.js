const { Member } = require("../models/allModel");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'helloduy';

class authController {
    async loginMember(req, res) {
        const { membername, password } = req.body;
        try {
            const user = await Member.findOne({ membername: membername })
            if (!user) {
                return res.status(400).json({ message: 'Member not found' })
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) { return res.status(400).json({ msg: 'Invalid credentials' }); }
            const payload = { userId: user._id };
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" })

            res.json({ token });    
        } catch {
            res.status(500).json({ message: error.message })
        }
    }
    async getMe(req, res) {
        const token = req.header('x-auth-token');

        if(!token) {
            return res.status(401).json({ message: 'No token, authorization denied' })
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await Member.findById(decoded.userId).select('-password');
            res.json({ user })
        } catch {
            res.status(500).json({ msg: 'Server error' });
        }
    }
    async registerMember(req, res) {
        const { membername, name, yob, password } = req.body;

        try {
            let user = await Member.findOne({ membername: membername })
            if(user) return res.status(400).json({ msg: 'User already exists' });
            const hashedPassword = await bcrypt.hash(password, 10);
            const newMember = new Member({ membername, name, password: hashedPassword, yob, isAdmin: false });
            newMember.save()
            res.json({ message: 'Member created successfully'})
        } catch {
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = new authController()