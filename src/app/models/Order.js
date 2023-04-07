const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const OrderSchema = new Schema({
    created_by: { type: String, maxLength: 255, },
    payment_id: { type: String, maxLength: 255, },
    firstname: { type: String, maxLength: 255 },
    lastname: { type: String, maxLength: 255 },
    email: { type: String, maxLength: 255 },
    phone: { type: String, maxLength: 20 },
    address: { type: String, maxLength: 600 },
    isPaid: { type: Boolean, default: false },
    items: [{
        product_id: { type: Number, },
        quantity: { type: Number, default: 1 },
    }],
    total: { type: Number, maxLength: 255 },
}, {
    timestamps: true,
});

// Add text index on the name field
OrderSchema.index({ phone: 'text' });

// Custom query helpers
OrderSchema.query.sortable = function (req) {
    if (req.query.hasOwnProperty('_sort')) {
        const isValidType = ['asc', 'desc'].includes(req.query.type);
        return this.sort({
            [req.query.column]: isValidType ? req.query.type : 'desc'
        })
    }
    return this;
}

// Add plugin for Course models
OrderSchema.plugin(AutoIncrement, { inc_field: 'order_id' });

module.exports = mongoose.model('Order', OrderSchema);
