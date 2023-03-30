const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const slug = require('mongoose-slug-generator');

const ProductSchema = new Schema({
    id: Number,
    name: { type: String, maxLength: 600, },
    description: { type: String },
    price: { type: Number },
    isPublished: { type: String, maxLength: 8, },
    imageId: { type: String, unique: true },
    slug: { type: String, slug: 'name', unique: true, },
}, {
    _id: false,
    timestamps: true,
});

// Custom query helpers
ProductSchema.query.sortable = function (req) {
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
ProductSchema.plugin(AutoIncrement);
ProductSchema.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true,
});

module.exports = mongoose.model('Product', ProductSchema);