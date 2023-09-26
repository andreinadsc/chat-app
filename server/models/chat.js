const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatSchema = new Schema(
    {
        chatName: {
            type: String,
            required: true,
            trim: true
        },
        isGroupChat: {
            type: Boolean,
            default: false
        },
        groupPicture: {
            type: String,
            default: '../images/group-default.jpeg'
        },
        groupAdmin: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        latestMessage: {
            type: Schema.Types.ObjectId,
            ref: 'Message'
        },
        users: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Chat', chatSchema);