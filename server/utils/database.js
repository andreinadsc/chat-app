require('dotenv').config();

const mongoose = require('mongoose');

const mongoConnect = (callback) => {
    mongoose.connect(process.env.MONGODB_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        .then(client => {
            callback();
        })
        .catch(err => {
            console.log(`Error: ${err}`);
            process.exit();
        });
};


module.exports.mongoConnect = mongoConnect;
