const { validationResult } = require('express-validator');

const Notification = require('../models/notification');
const Chat = require('../models/chat');
const Message = require('../models/message');
const User = require('../models/user');

module.exports.addNotification = async (req, res) => {
    const errors = validationResult(req);
    const { chatId, messageId, users } = req.body;

    if (!errors.isEmpty()) {
        return res.status(422).send({
            message: errors.array().map(error => error.msg)
        });
    }

    try {
        let recipientsTmp = [];

        const message = await Message.findOne({ _id: messageId });

        if (!users || users.length === 0) {
            const recipients = await Chat.findOne({ _id: chatId });
            recipientsTmp = recipients.users.filter(item => item.toString() !== message.sender._id.toString());
        } else recipientsTmp = users.split(',');

        const notification = new Notification({
            recipients: recipientsTmp,
            message: messageId,
            chat: chatId
        });

        let saveNotification = await notification.save();
        saveNotification = await saveNotification
            .populate([{
                path: 'message',
                populate: [
                    { path: 'sender', select: 'name _id' }
                ]
            }, {
                path: 'chat',
                populate: [
                    {
                        path: 'users',
                        select: 'name picture email status',
                    }
                ]
            }]
            ).execPopulate();

        res.status(200).send(saveNotification);

    } catch (e) {
        return res.status(500).send({
            message: [`something went wrong: ${e}`],
        });
    }
};

module.exports.allNotifications = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).send({
            message: errors.array().map(error => error.msg)
        });
    }
    
    try {
        let notifications = await Notification.find({ recipients: { $elemMatch: { $eq: req.userId } } })
            .populate([{
                path: 'message',
                populate: [
                    { path: 'sender', select: 'name _id' }
                ]
            },
            {
                path: 'chat',
                populate: [
                    {
                        path: 'users',
                        select: 'name picture email status'
                    }
                ]
            }
        ]).exec();

        res.status(200).send(notifications);

    } catch (e) {
        console.log(e)
        return res.status(500).send({
            message: [`something went wrong: ${e}`],
        });
    }
};

module.exports.removeNotification = async (req, res) => {
    const errors = validationResult(req);
    const { chatId } = req.params;

    if (!errors.isEmpty()) {
        return res.status(422).send({
            message: errors.array().map(error => error.msg)
        });
    }

    try {

        await Notification.updateMany({ chat: chatId }, { $pull: { recipients: req.userId } });
        await Notification.deleteMany({ 'recipients': { $size: 0 } });


        res.status(200).json({ message: 'Notifcations remove' })

    } catch (e) {
        return res.status(500).send({
            message: [`something went wrong: ${e}`],
        });
    }
};



