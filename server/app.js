require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const multer = require('multer');
const crypto = require('crypto');

const mongoConnect = require('./utils/database').mongoConnect;

const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
const messagesRoutes = require('./routes/message');
const notificationsRoutes = require('./routes/notification');

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        crypto.randomBytes(10, (error, buffer) => {
            if (error) throw error;
            const parts = file.originalname.split('.');
            const extension = parts[parts.length - 1];
            const filename = buffer.toString('hex') + '.' + extension;
            callback(null, filename);
        });
    }
});

const fileFilter = (req, file, callback) => {
    const allowedExtensions = ['image/jpg', 'image/jpeg', 'image/png'];
    if (allowedExtensions.includes(file.mimetype)) {
        callback(null, true);
    } else {
        return callback(null, false);
    }
};

app.use(bodyParser.json({ limit: '50mb' }));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('picture'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use('/user', userRoutes);
app.use('/chats', chatRoutes);
app.use('/messages', messagesRoutes);
app.use('/notifications', notificationsRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    res.status(status).json({ message: error.message, data: error.data });
});


mongoConnect(() => {
    const server = app.listen(process.env.PORT || 8080);
    const io = require('./utils/socket').init(server);
    io.on('connection', (socket) => {
        socket.on('setup', userId => {
            socket.join(userId);
            socket.emit('connected')
        });

        socket.on('join chat', room => {
            socket.join(room);
            console.log(`User joined chat ${room}`);
        });

        socket.on('update chat', (chat, userId) => {
            console.log('updating group');
            if (!chat.users) return console.log('group deleted');
            chat.users.forEach(user => {
                if (user._id === userId) return;
                console.log('emitting changes')
                socket.in(user._id).emit('applying changes', chat);
            });
        });

        socket.on('typing', (room) => socket.in(room).emit('typing'));
        socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

        socket.on('new message', newMessage => {
            const { chat, sender } = newMessage;
            if (!chat.users) return console.log('chat users not defined');
            chat.users.forEach(user => {
                if (user._id === sender._id) return;
                console.log('emitting message')
                socket.in(user._id).emit('message recieved', newMessage);
            });
        });
    });
});
