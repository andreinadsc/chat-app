const { validationResult } = require('express-validator');

const Chat = require('../models/chat');
const Message = require('../models/message');
const User = require('../models/user');

module.exports.sendMessage = async (req, res) => {
    const errors = validationResult(req);
    const { chatId, content } = req.body;

    if (!errors.isEmpty()) {
        return res.status(422).send({
            message: errors.array().map(error => error.msg)
        });
    }

    try {
        const newMessage = new Message({
            sender: req.userId,
            content,
            chat: chatId
        });

        let savedMessage = await newMessage.save();
        savedMessage = await savedMessage.
            populate([
                {
                    path: 'sender',
                    select: 'name picture'
                },
                {
                    path: 'chat',
                    populate: [{
                        path: 'users',
                        select: 'name picture status',
                        model: 'User'
                    }]
                }
            ]).execPopulate();

        await Chat.findByIdAndUpdate(chatId, { latestMessage: savedMessage });

        res.status(200).send(savedMessage);

    } catch (e) {
        return res.status(500).send({
            message: [`something went wrong: ${e}`],
        });
    }
};

module.exports.allMessages = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).send({
            message: errors.array().map(error => error.msg)
        });
    }
    try {
        let messages = await Message.find({ chat: req.params.chatId })
            .populate('sender', 'name picture email')
            .populate('chat');

        messages = await User.populate(messages, {
            path: 'chat.users',
            select: 'name picture email status',
        });

        res.status(200).send(messages);

    } catch (e) {
        return res.status(500).send({
            message: [`something went wrong: ${e}`],
        });
    }
};

