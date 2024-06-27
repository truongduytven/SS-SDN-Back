var express = require('express');
const watchController = require('../controllers/watchController');
const { authenticateToken, checkAdmin } = require('../controllers/middlewareController');
var watchRouter = express.Router()


watchRouter.route('/')
    .get(watchController.getAllWatch)
    .post(watchController.addWatch)

watchRouter.route('/:id')
    .get(watchController.getDetail)
    .put(authenticateToken, checkAdmin, watchController.updateWatch)
    .delete(authenticateToken, checkAdmin, watchController.deleteWatch);
    
watchRouter.route('/comments/:id')
    .get(authenticateToken, watchController.getComments)
    .post(authenticateToken, watchController.addNewComment)
    .put(authenticateToken, watchController.updateComment)
    .delete(authenticateToken, watchController.deleteComment);

module.exports = watchRouter;