const express = require('express');
const brandController = require('../controllers/brandController');
const { authenticateToken, checkAdmin } = require('../controllers/middlewareController') 
const brandRouter = express.Router()

brandRouter.route('/')
.get(brandController.getAllBrand)
.post(authenticateToken, checkAdmin, brandController.createBrand)

brandRouter.route('/:id')
.put(authenticateToken, checkAdmin, brandController.updateBrand)
.delete(authenticateToken, checkAdmin, brandController.deleteBrand)


module.exports = brandRouter