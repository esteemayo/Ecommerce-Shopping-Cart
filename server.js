const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE_LOCAL;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(cons => {
        // console.log(cons.connections);
        console.log('MongoDB Connected...');
    })
    .catch(err => console.log(`COULD NOT CONNECT TO MONGODB: ${err}`));

const PORT = process.env.PORT || 9000;

const server = app.listen(PORT, () => console.log(`APP LISTENING ON PORT ${PORT}`));

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});