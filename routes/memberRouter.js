const express = require('express');
const memberController = require('../controllers/memberController');
const { authenticateToken, checkAdmin } = require('../controllers/middlewareController');

const memberRouter = express.Router()

memberRouter.get('/', authenticateToken, checkAdmin, memberController.getAllMembers);
memberRouter.put('/:id', authenticateToken, memberController.updateProfile);


module.exports = memberRouter