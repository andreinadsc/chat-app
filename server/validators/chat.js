const { body } = require('express-validator');

const User = require('../models/user');
const Chat = require('../models/chat');

module.exports.createGroup = [
    body('users')
        .notEmpty()
        .custom((value) => {
            if (JSON.parse(value).length < 2) throw new Error('You need to add at least two users to your group');
            return true
        }),
    body('groupName')
        .exists()
        .withMessage('The name field is required')
];

module.exports.updateGroup = [
    body('chatId')
        .custom((value) => {
            return Chat
                .findOne({ _id: value, isGroupChat: true })
                .then(chat => {
                    if (!chat) return Promise.reject('This group chat doesn\'t exist');
                });
        })
];

module.exports.updateGroupUsers = [
    body('chatId')
        .custom((value) => {
            return Chat
                .findOne({ _id: value, isGroupChat: true })
                .then(chat => {
                    if (!chat) return Promise.reject('This chat no longer exists or the user you are trying to delete no longer belongs to this chat');
                });
        })
];