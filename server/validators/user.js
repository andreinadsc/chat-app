const { body } = require('express-validator');

const User = require('../models/user');

module.exports.login = [
    body('email')
        .isEmail().withMessage('invalid email')
];

module.exports.signup = [
    body('fullName').isLength({ min: 4 })
        .withMessage('Your name should be at leats 4 characters long '),
    body('email')
        .isEmail().withMessage('Please enter a valid email')
        .custom((value) => {
            return User
                .findOne({ email: value })
                .then(user => {
                    if (user) return Promise.reject('this email already exist, please use another email');
                });
        }),
    body('password').
        isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage('Use At Least 8 Characters One Uppercase Letter One Lowercase Letter And One Number In Your Password'),
    body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.password) throw new Error('passwords do not match');
                return true;
            })
];

module.exports.resetPassword = [
    body('email')
        .isEmail().withMessage('Enter a valid email')
        .custom((value) => {
            return User
                .findOne({ email: value })
                .then(user => {
                    if (!user) return Promise.reject('this email does not belong to any registered user');
                });
        }),
    body('password').
        isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage('Use At Least 8 Characters One Uppercase Letter One Lowercase Letter And One Number In Your Password'),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
];

module.exports.logout = [
    body('userId')
    .custom((value) => {
        return User
            .findOne({ _id: value })
            .then(user => {
                if (!user) return Promise.reject('this user does not exits');
            });
    })
];