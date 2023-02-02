const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const db = process.env.DATABASE_LOCAL;

module.exports = () => {
  mongoose.connect(db, {
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
};
