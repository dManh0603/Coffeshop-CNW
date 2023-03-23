const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const slug = require('mongoose-slug-generator');

const CourseSchema = new Schema({
    id: Number,
    name: { type: String, maxLength: 600, },
    slug: { type: String, slug: 'name', unique: true, },
}, {
    _id: false,
    timestamps: true,
});

// Custom query helpers
CourseSchema.query.sortable = function (req) {
    if (req.query.hasOwnProperty('_sort')) {
        const isValidType = ['asc', 'desc'].includes(req.query.type);
        return this.sort({
            [req.query.column]: isValidType ? req.query.type : 'desc'
        })
    }
    return this;
}

// Add plugin for mongoose
mongoose.plugin(slug);

//Add plugin for Course models
CourseSchema.plugin(AutoIncrement);
CourseSchema.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true,
});

module.exports = mongoose.model('Course', CourseSchema);