const { Member } = require('../models/allModel')
const bcrypt = require('bcrypt')

class memberController {
    async getAllMembers(req, res) {
        try {
            const members = await Member.find({})
            const memberFilter = members.filter(member => member.isAdmin === false)
            res.status(200).json(memberFilter)
        } catch (error) {
            res.json({ message: error.message })
        }
    }
    async updateProfile(req, res) {
        try {
            const memberId = req.params.id
            const member = await Member.findById(memberId)
            if (!member) {
                return res.status(404).json({ message: 'Member not found' })
            }
            const { name, yob, password, newPassword, confirmPassword } = req.body
            if (!name) {
                return res.status(400).json({ message: 'Name is required' })
            }
            if (!yob) {
                return res.status(400).json({ message: 'Year of birth is required' })
            }
            if (newPassword || confirmPassword) {
                if (!password) {
                    return res.status(400).json({ message: 'Password is required' })
                } else {
                    const comparePassword = await bcrypt.compare(password, member.password)
                    if (!comparePassword) {
                        return res.status(400).json({ message: 'Password is incorrect' })
                    }
                }
                if (!newPassword || !confirmPassword) {
                    return res.status(400).json({ message: 'New password and confirm password are required' })
                }
                if (newPassword.leghth < 6) {
                    return res.status(400).json({ message: 'Password must be at least 6 characters' })
                }
                if (newPassword === password) {
                    return res.status(400).json({ message: 'The new password cannot be the same as the old password' })
                }
                if (newPassword !== confirmPassword) {
                    return res.status(400).json({ message: 'Confirm password is not match' })
                }
            }
            if (name) {
                member.name = name
            }
            if (yob) {
                member.yob = yob;
            }
            if (newPassword && newPassword === confirmPassword && password === member.password) {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                member.password = hashedPassword;
            }
            await member.save()
            res.json({ message: 'Update profile successfully' })
        } catch {
            res.json({ message: error.message })
        }
    }
}

module.exports = new memberController()