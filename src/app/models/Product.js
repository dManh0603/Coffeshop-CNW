const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const slug = require('mongoose-slug-generator');

const ProductSchema = new Schema({
    name: { type: String, maxLength: 600, },
    description: { type: String },
    price: { type: Number },
    isPublished: { type: String, maxLength: 8, },
    imageId: { type: String, unique: true },
    slug: { type: String, slug: 'name', unique: true, },
    product_id: { type: Number, unique: true }
}, {
    timestamps: true,
});

// Add text index on the name field
ProductSchema.index({ name: 'text' });

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

// Add plugin for Course models
ProductSchema.plugin(AutoIncrement, { inc_field: 'product_id' });
ProductSchema.plugin(mongooseDelete, {
    overrideMethods: 'all',
    deletedAt: true,
});

module.exports = mongoose.model('Product', ProductSchema);
