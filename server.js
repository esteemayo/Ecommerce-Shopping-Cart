import app from './app.js';
// require('./startup/db')();

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const PORT = process.env.PORT || 9000;

const server = app.listen(PORT, () => console.log(`APP LISTENING ON PORT ${PORT}`));

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
