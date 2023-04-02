const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const cartSchema = new mongoose.Schema({
  items: [cartItemSchema],
  total: {
    type: Number,
    required: true,
    default: 0
  }
});

cartSchema.plugin(AutoIncrement, {inc_field: 'cart_id'});

module.exports = mongoose.model('Cart', cartSchema); 