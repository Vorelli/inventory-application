var mongoose = require('mongoose');
var async = require('async');
var Item = mongoose.model('Item');
var Shipment = mongoose.model('Shipment');

exports.index = function (req, res, next) {
  var getInventory = {
    item: function (cb) {
      Item.find(cb);
    }
  };

  var afterGet = function (err, results) {
    if (err) return next(err);
    if (results.item == null) return next(err);
    res.render('index', { title: 'Inventory', inventory: results.item });
  };

  async.parallel(getInventory, afterGet);
};

exports.itemCreateGet = function (req, res, next) {
  res.send('Item create GET UNDONE');
};

exports.itemCreatePut = function (req, res, next) {
  res.send('Item create PUT UNDONE');
};

exports.itemView = function (req, res, next) {
  const getItemAndShipment = {
    item: function (cb) {
      if (req.params.id.length !== 24) {
        res.redirect('/');
        return;
      }
      Item.findById(req.params.id).exec(cb);
    },
    shipment: function (cb) {
      console.log('looking for shipment....');
      Shipment.find({ items: req.params.id }).exec(cb);
    }
  };
  const afterGet = function (err, results) {
    console.log('finsihed get');
    if (err) next(err);
    if (results.item == null || results.item === undefined) res.redirect('/');
    res.render('itemView', {
      title: 'View Item',
      item: results.item,
      shipment: results.shipment
    });
  };
  async.parallel(getItemAndShipment, afterGet);
};

exports.itemUpdateGet = function (req, res, next) {
  res.send('Item ' + req.params.id + ' Update GET UNDONE');
};

exports.itemUpdatePut = function (req, res, next) {
  res.send('Item ' + req.params.id + ' Update POST UNDONE');
};

exports.itemDeleteGet = function (req, res, next) {
  res.send('Item ' + req.params.id + ' Delete GET UNDONE');
};

exports.itemDeletePut = function (req, res, next) {
  res.send('Item ' + req.params.id + ' Delete POST UNDONE');
};

exports.categoryViewAll = function (req, res, next) {
  res.send('Category View all UNDONE');
};

exports.categoryCreateGet = function (req, res, next) {
  res.send('Category create GET UNDONE');
};

exports.categoryCreatePut = function (req, res, next) {
  res.send('Category create POST UNDONE');
};

exports.categoryView = function (req, res, next) {
  res.send('Category ' + req.params.id + ' View UNDONE');
};

exports.categoryUpdateGet = function (req, res, next) {
  res.send('Category ' + req.params.id + ' Update GET UNDONE');
};

exports.categoryUpdatePut = function (req, res, next) {
  res.send('Category ' + req.params.id + ' Update POST UNDONE');
};

exports.categoryDeleteGet = function (req, res, next) {
  res.send('Category ' + req.params.id + ' Delete GET UNDONE');
};

exports.categoryDeletePut = function (req, res, next) {
  res.send('Category ' + req.params.id + ' Delete POST UNDONE');
};
