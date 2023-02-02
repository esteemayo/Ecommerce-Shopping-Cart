const Page = require('../models/Page');
const factory = require('../controllers/handlerFactory');

exports.getAllPages = factory.getAll(Page);
exports.getPage = factory.getOne(Page);
exports.createPage = factory.createOne(Page);
exports.updatePage = factory.updateOne(Page);
exports.deletePage = factory.deleteOne(Page);
