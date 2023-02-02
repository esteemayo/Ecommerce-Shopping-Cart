const fs = require('fs');

// models
const Category = require('../../models/Category');
const Page = require('../../models/Page');
const Product = require('../../models/Product');
const User = require('../../models/User');

require('../../startup/db')();

// read JSON file
const products = JSON.parse(fs.readFileSync(`${__dirname}/products.json`, 'utf-8'));
const categories = JSON.parse(fs.readFileSync(`${__dirname}/categories.json`, 'utf-8'));
const pages = JSON.parse(fs.readFileSync(`${__dirname}/pages.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

// Iimport data into database
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

// delete all data from database
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
