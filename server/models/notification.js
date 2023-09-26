const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
    {
        recipients: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat'
        },
        message: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Notification', notificationSchema);