const { validationResult } = require('express-validator');

const Chat = require('../models/chat');
const User = require('../models/user');

const clearImage = require('../utils/clearImage');


module.exports.accessChat = async (req, res) => {
    const errors = validationResult(req);
    const userId = req.params.userId;

    if (!errors.isEmpty()) {
        return res.status(422).send({
            message: errors.array().map(error => error.msg)
        });
    }

    const isChat = await Chat.find({
        $and: [
            { isGroupChat: false },
            { users: { $elemMatch: { $eq: req.userId } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    })
        .populate('users', '-password')
        .populate({
            path: 'latestMessage',
            populate: [{
                path: 'sender',
                select: 'name picture email',
                model: 'User'
            }]
        });

    if (isChat.length > 0) {
        res.status(200).json({ chatExist: true, chat: isChat[0] })
    } else {
        try {
            const newChat = new Chat({
                chatName: 'sender',
                isGroupChat: false,
                users: [req.userId, userId]
            });
            const chat = await newChat.save(newChat);
            const fullChat = await Chat.findOne({ _id: chat._id }).populate('users', '-password');

            res.status(200).send({ chat: fullChat });

        } catch (e) {
            return res.status(500).send({
                message: [`something went wrong: ${e}`],
            });
        }
    }
};

module.exports.getChats = async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.userId } } })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate('latestMessage')
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: 'latestMessage.sender',
                    select: 'name picture email',
                });
                res.status(200).send(results);
            });
    } catch (e) {
        return res.status(500).send({
            message: [`something went wrong: ${e}`],
        });
    }
};

module.exports.createGroup = async (req, res) => {
    const errors = validationResult(req);
    const { users, groupName } = req.body;
    const pictureSrc = !req.file ? './images/group-default.png' : req.file.path.replace('\\', '/');

    if (!errors.isEmpty()) {
        return res.status(422).send({
            message: errors.array().map(error => error.msg)
        });
    }

    const usersObject = JSON.parse(users);
    usersObject.push(req.userId);

    try {
        const groupChat = new Chat({
            chatName: groupName,
            users: usersObject,
            isGroupChat: true,
            groupAdmin: req.userId,
            groupPicture: pictureSrc
        });

        let saveGroup = await groupChat.save()
        saveGroup = await saveGroup.populate('users', '-passwords').populate('groupAdmin', '-passwords').execPopulate();

        res.status(200).send(saveGroup);
    } catch (error) {
        return res.status(500).send({
            message: [`something went wrong: ${error}`],
        });
    }
};

module.exports.updateGroup = async (req, res) => {
    const { newGroupName, chatId } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).send({
            message: errors.array().map(error => error.msg)
        });
    }

    try {
        let updateChat = await Chat.findOne(
            { _id: chatId, isGroupChat: true }
        );

        if (req.file) clearImage(updateChat.groupPicture);

        if (!newGroupName) {
            updateChat.groupPicture = req.file.path.replace('\\', '/')
        } else {
            updateChat.chatName = newGroupName;
        };

        updateChat = await updateChat.save();
        updateChat = await updateChat.populate('users', '-passwords').populate('groupAdmin', '-passwords').execPopulate();

        res.status(200).send(updateChat);
    } catch (error) {
        return res.status(500).send({
            message: [`something went wrong: ${error}`],
        });
    }
};

module.exports.updateUsers = async (req, res) => {
    const { chatId, groupAdmin, isLeaving } = req.body;
    const users = JSON.parse(req.body.users);

    if (!isLeaving && users.length <= 2) throw new Error('You need to add at least two users to your group');
    else if (isLeaving && users.length < 1) {
        const chat = await Chat.findOneAndDelete({_id: chatId})
        clearImage(chat.groupPicture)
        return res.status(200).send({message: 'deleted', _id: chatId});
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).send({
            message: errors.array().map(error => error.msg)
        });
    }

    const updateValues = groupAdmin ?
        { $set: { users: users }, groupAdmin: groupAdmin }
        : { $set: { users: users } }


    const updateChat = await Chat.findOneAndUpdate(
        { _id: chatId, isGroupChat: true },
        updateValues,
        { new: true }
    )
        .populate('users', '-password')
        .populate('groupAdmin', '-password');

    res.status(200).send(updateChat);
};

