var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = Schema({
  name: { type: String, required: true, minlength: 1 },
  description: { type: String, required: true, minlength: 10 },
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  price: { type: Number, min: 0.0, required: true },
  inStock: { type: Number, min: 0, required: true }
});

ItemSchema.virtual('url').get(function () {
  return '/inventory/item/' + this._id;
});

module.exports = mongoose.model('Item', ItemSchema);
