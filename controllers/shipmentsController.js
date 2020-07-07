var mongoose = require('mongoose');
var Shipment = mongoose.model('Shipment');
var async = require('async');

exports.index = function (req, res, next) {
  var getShipments = {
    shipments: function (cb) {
      Shipment.find(cb);
    }
  };

  const afterGet = function (err, results) {
    if (err) next(err);
    res.render('shipmentsIndex', {
      title: 'View Shipments',
      shipments: results.shipments
    });
  };

  async.parallel(getShipments, afterGet);
};

exports.shipmentCreateGet = function (req, res, next) {
  res.send('Shipment create GET UNDONE');
};

exports.shipmentCreatePut = function (req, res, next) {
  res.send('Shipment create POST UNDONE');
};

exports.shipmentView = function (req, res, next) {
  var getShipment = {
    shipment: function (cb) {
      if (req.params.id.length !== 24) {
        res.redirect('/');
        return;
      }
      Shipment.findById(req.params.id).populate('items').exec(cb);
    }
  };

  var afterGet = function (err, results) {
    if (err) next(err);
    if (results.shipment == null) res.redirect('/shipments');
    console.log(results.shipment);
    res.render('shipmentsView', {
      title: 'View Shipment',
      shipment: results.shipment
    });
  };

  async.parallel(getShipment, afterGet);
};

exports.shipmentUpdateGet = function (req, res, next) {
  res.send('Shipment ' + req.params.id + ' Update GET UNDONE');
};

exports.shipmentUpdatePut = function (req, res, next) {
  res.send('Shipment ' + req.params.id + ' Update POST UNDONE');
};

exports.shipmentDeleteGet = function (req, res, next) {
  res.send('Shipment ' + req.params.id + ' Delete GET UNDONE');
};

exports.shipmentDeletePut = function (req, res, next) {
  res.send('Shipment ' + req.params.id + ' Delete POST UNDONE');
};
