const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

exports.getAll = Model => catchAsync(async (req, res, next) => {
    // console.log(req.query);
    const features = new APIFeatures(Model.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const doc = await features.query;
    // const doc = await features.query.explain();

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: doc.length,
        data: {
            doc
        }
    });
});

exports.getOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
    });
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            doc
        }
    });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!doc) {
        return next(new AppError('No document found with the ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
    });
});

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new AppError('No document found with the ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});