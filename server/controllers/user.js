const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const clearImage = require('../utils/clearImage');

module.exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).send({
            message: errors.array().map(error => error.msg)
        });
    }

    try {
        const user = await User.findOneAndUpdate({ email }, { status: 'connected' });

        if (user) {
            const matched = await bcrypt.compare(password, user.password);
            if (matched) {
                const token = jwt.sign(
                    { email: user.email, name: user.name, userId: user._id.toString() },
                    process.env.TOKEN_SECRET_KEY,
                    { expiresIn: '1h' }
                );
                res
                    .status(200)
                    .json({
                        message: 'user logged in',
                        token: token,
                        user: { email: user.email, name: user.name, _id: user._id.toString(), picture: user.picture }
                    });
            } else {
                res.status(422).send({
                    message: ['Your password is invalid'],
                });
            }
        } else {
            res.status(422).send({
                message: ['wrong email address'],
            });
        }
    }
    catch (err) {
        return res.status(500).send({
            message: [`something went wrong: ${err}`],
        });
    };
}

module.exports.postLogout = async (req, res) => {
    await User.findOneAndUpdate({ _id: req.body.userId }, { status: 'disconnected' });
    res.status(200).send('User disconnected');
};

module.exports.postSignup = async (req, res) => {
    const { fullName, email, password } = req.body;
    const errors = validationResult(req);

    if (!req.file) errors.errors.push({ msg: 'No valid image provided' });

    if (!errors.isEmpty()) {
        return res.status(422).send({
            message: errors.array().map(error => error.msg),
        });
    }

    const pictureSrc = req.file.path.replace('\\', '/');

    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(422).send({
                message: ['mail already exists, please use another email'],
            });
        } else {
            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = new User({
                name: fullName,
                email: email,
                password: hashedPassword,
                picture: pictureSrc
            });

            await newUser.save();
            res.status(201).json({
                message: 'User created',
                userId: newUser._id.toString()
            });
        }
    } catch (e) {
        return res.status(e.statusCode || 500).send({
            message: [`something went wrong: ${e}`],
        });
    }
}

module.exports.resetPassword = async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).send({
            message: errors.array().map(error => error.msg),
        });
    }
    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(422).send({
                message: ['Couldn\'t find your email'],
            });
        } else {
            const hashedPassword = await bcrypt.hash(password, 12);

            await User.updateOne({ email }, { password: hashedPassword });

            res.status(200).json({
                userId: user._id.toString()
            });
        }

    } catch (e) {
        return res.status(500).send({
            message: [`something went wrong: ${e}`],
        });
    }
};


module.exports.getAllUsers = async (req, res) => {
    try {
        const keyword = req.query.search || null;
        const filter = keyword ? {
            $or: [
                {
                    name: { $regex: keyword, $options: 'i' }
                },
                {
                    email: { $regex: keyword, $options: 'i' }
                }
            ],
            $and: [
                {
                    _id: { $ne: req.userId }
                }
            ]
        } : { _id: { $ne: req.userId } }

        const users = await User.find(filter, 'name email picture _id');

        res.status(200).send(users);

    } catch (error) {
        return res.status(500).send({
            message: [`something went wrong: ${error}`],
        });
    }
};

module.exports.updateUser = async (req, res) => {
    const { newName } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).send({
            message: errors.array().map(error => error.msg)
        });
    }

    try {
        let updateUser = await User.findOne({ _id: req.userId }).select('-password');

        if (req.file) clearImage(updateUser.picture);

        if (!newName) {
            updateUser.picture = req.file.path.replace('\\', '/')
        } else {
            updateUser.name = newName;
        };

        updateUser = await updateUser.save();
        res.status(200).send(updateUser);

    } catch (error) {
        return res.status(500).send({
            message: [`something went wrong: ${error}`],
        });
    }
};