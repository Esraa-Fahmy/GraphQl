const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  totalPrice: Number,
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

module.exports = mongoose.model('Order', orderSchema);
