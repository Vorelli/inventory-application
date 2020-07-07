var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var ShipmentSchema = Schema({
  date: { type: Date, required: true },
  items: [{ type: mongoose.Types.ObjectId, ref: 'Item' }],
  itemQuantities: [Number]
});

ShipmentSchema.virtual('url').get(function () {
  return '/shipments/' + this._id;
});

ShipmentSchema.virtual('dateFormatted').get(function () {
  return moment(this.date).format('YYYY-MM-DD');
});

module.exports = mongoose.model('Shipment', ShipmentSchema);
