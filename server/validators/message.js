const { body } = require('express-validator');

const Chat = require('../models/chat');

module.exports.isValidMessage = [
    body('chatId')
        .custom((value) => {
            return Chat
                .findOne({ _id: value })
                .then(chat => {
                    if (!chat) return Promise.reject('This chat doesn\'t exist');
                });
        }),
    body('content')
        .exists()
        .withMessage('Your message needs some text')
];

module.exports.isValidChat = [
    body('chatId')
        .custom((value) => {
            return Chat
                .findOne({ _id: value })
                .then(chat => {
                    if (!chat) return Promise.reject('This chat doesn\'t exist');
                });
        })
];





