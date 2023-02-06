import app from './app.js';
// require('./startup/db')();

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION!🔥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

app.set('port', process.env.PORT || 9000);

const server = app.listen(app.get('port'), async () => {
  console.log(`App listening on port → ${server.address().port}`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION!🔥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
