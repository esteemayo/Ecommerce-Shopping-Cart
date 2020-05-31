const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../../models/Category');
const Product = require('../../models/Product');
const Page = require('../../models/Page');
const User = require('../../models/User');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE_LOCAL;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(cons => {
        // console.log(cons.connections);
        console.log('MongoBD Connected...');
    })
    .catch(err => console.log(`COULD NOT CONNECT TO MONGODB: ${err}`));

// READ JSON FILE
const products = JSON.parse(fs.readFileSync(`${__dirname}/products.json`, 'utf-8'));
const categories = JSON.parse(fs.readFileSync(`${__dirname}/categories.json`, 'utf-8'));
const pages = JSON.parse(fs.readFileSync(`${__dirname}/pages.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

// IMPORT DATA INTO DATABASE
const importData = async () => {
    try {
        await Product.create(products);
        await Category.create(categories);
        await Page.create(pages);
        await User.create(users, { validateBeforeSave: false });
        console.log('Data successfully loaded!');
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

// DELETE ALL DATA FROM DATABASE
const deleteData = async () => {
    try {
        await Product.deleteMany();
        await Category.deleteMany();
        await Page.deleteMany();
        await User.deleteMany();
        console.log('Data successfully deleted!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}

console.log(process.argv);