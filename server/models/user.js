const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true,
            default: 'disconnected'
        },
        picture: {
            type: String,
            required: true,
            default: '../images/profile-default.jpeg'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);