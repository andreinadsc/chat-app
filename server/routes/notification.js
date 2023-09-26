
const express = require('express');

const notificationController = require('../controllers/notification');
const notificationValidator = require('../validators/notification');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();

router.post('/', [isAuth, notificationValidator.addNotification] , notificationController.addNotification);

router.get('/', isAuth , notificationController.allNotifications);

router.delete('/:chatId', isAuth, notificationController.removeNotification);

module.exports = router;
