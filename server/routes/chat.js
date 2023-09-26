const express = require('express');

const chatController = require('../controllers/chat');
const chatValidator = require('../validators/chat');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();

router.post('/:userId', isAuth, chatController.accessChat);

router.get('/', isAuth, chatController.getChats);

router.post('/group/create', [isAuth, chatValidator.createGroup], chatController.createGroup);

router.put('/group/update', [isAuth, chatValidator.updateGroup], chatController.updateGroup);

router.put('/group/users', [isAuth, chatValidator.updateGroupUsers], chatController.updateUsers);

module.exports = router;
