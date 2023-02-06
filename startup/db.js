const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const devEnv = process.env.NODE_ENV !== 'production';
const { DATABASE, DATABASE_LOCAL, DATABASE_PASSWORD } = process.env;

const mongoURI = DATABASE.replace('<PASSWORD>', DATABASE_PASSWORD);
const dbLocal = DATABASE_LOCAL;

const db = devEnv ? dbLocal : mongoURI;

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    console.log(`MongoDB Connected → ${conn.connection.port}`);
  } catch (err) {
    throw err;
  }
};

module.exports = connectDb;
