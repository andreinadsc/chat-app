
const express = require('express');

const messageController = require('../controllers/message');
const messageValidator = require('../validators/message');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();

router.post('/', [isAuth, messageValidator.isValidMessage], messageController.sendMessage);

router.get('/:chatId', isAuth, messageController.allMessages);

module.exports = router;
