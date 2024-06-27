const express = require('express');
const authController = require('../controllers/authController');
const authRouter = express.Router()

authRouter.route('/login')

.post(authController.loginMember)

authRouter.route('/me')
.get(authController.getMe)

authRouter.route('/register')
.post(authController.registerMember)


module.exports = authRouter