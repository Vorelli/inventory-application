var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShipmentSchema = Schema({
  date: { type: Date, required: true },
  items: [mongoose.Types.ObjectId],
  itemQuantities: [Number]
});

ShipmentSchema.virtual('url').get(function () {
  return '/shipments/' + this._id;
});

module.exports = mongoose.model('Shipment', ShipmentSchema);
