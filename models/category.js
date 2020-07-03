var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 100 },
  parentCategory: { type: Schema.Types.ObjectId, ref: 'Category' }
});

CategorySchema.virtual('url').get(function () {
  return '/inventory/categories/' + this._id;
});

module.exports = mongoose.model('Category', CategorySchema);
