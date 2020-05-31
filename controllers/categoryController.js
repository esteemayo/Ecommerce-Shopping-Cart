const Category = require('../models/Category');
const factory = require('../controllers/handlerFactory');

exports.getAllCAtegories = factory.getAll(Category);
exports.getCategory = factory.getOne(Category);
exports.createCategory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category);