

class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        // 1A) FILTERING
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // 1B) ADVANCED FILTERING
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        // console.log(JSON.parse(queryStr));
        // console.log(this.queryString, queryObj);

        // let query = Product.find(JSON.parse(queryStr));
        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort() {
        // SORTING
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            console.log(sortBy);
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields() {
        // FIELD LIMITING
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate() {
        // PAGINATION
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        /*
        if (this.queryString.page) {
            const numProduct = await Product.countDocuments();
            if (skip >= numProduct) throw new Error('This page does not exist 🔥');
        }
        */

        return this;
    }
}

module.exports = APIFeatures;