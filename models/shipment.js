var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShipmentSchema = Schema({
  date: { type: Date, required: true },
  items: { type: Array }
});

ShipmentSchema.virtual('url').get(function () {
  return '/shipments/' + this._id;
});

module.exports = mongoose.model('Shipment', ShipmentSchema);
