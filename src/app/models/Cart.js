const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const cartSchema = new mongoose.Schema({
  accountId: { type: String, maxLength: 255 },
  items: [{
    productSlug: { type: String, maxLength: 255 },
    quantity: { type: Number, default: 1 },
  }],
});

cartSchema.plugin(AutoIncrement, { inc_field: 'cart_id' });

module.exports = mongoose.model('Cart', cartSchema); 