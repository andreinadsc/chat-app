const { body } = require('express-validator');

const User = require('../models/user');
const Chat = require('../models/chat');
const Message = require('../models/message');

module.exports.addNotification = [
    body('chatId')
        .custom((value) => {
            return Chat
                .findOne({ _id: value})
                .then(chat => {
                    if (!chat) return Promise.reject('This chat doesn\'t exist');
                });
        }),
    body('messageId')
        .custom((value) => {
            return Message
                .findOne({ _id: value})
                .then(chat => {
                    if (!chat) return Promise.reject('This message doesn\'t exist');
                });
        })
];

