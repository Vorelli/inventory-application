var mongoose = require('mongoose');
var Shipment = mongoose.model('Shipment');
var async = require('async');
const { sanitizeBody } = require('express-validator/filter');
var Item = mongoose.model('Item');
const { body, validationResult } = require('express-validator/check');
var moment = require('moment');

exports.index = function (req, res, next) {
  var getShipments = {
    shipments: function (cb) {
      Shipment.find(cb);
    }
  };

  const afterGet = function (err, results) {
    if (err) next(err);
    else {
      res.render('shipmentsIndex', {
        title: 'View Shipments',
        shipments: results.shipments
      });
    }
  };

  async.parallel(getShipments, afterGet);
};

exports.shipmentCreateGet = function (req, res, next) {
  const getItems = {
    inventory: function (cb) {
      Item.find(cb);
    }
  };

  const afterGet = function (err, results) {
    if (err) next(err);
    else {
      res.render('shipmentsForm', {
        title: 'Create Shipment',
        inventory: results.inventory
      });
    }
  };

  async.parallel(getItems, afterGet);
};

exports.shipmentCreatePut = [
  (req, res, next) => {
    if (!(req.body.item instanceof Array)) {
      if (typeof req.body.item === 'undefined') req.body.item = [];
      else req.body.item = new Array(req.body.item);
    }
    if (!(req.body.itemQuantities instanceof Array)) {
      if (typeof req.body.itemQuantities === 'undefined') {
        req.body.itemQuantities = [];
      } else req.body.itemQuantities = new Array(req.body.itemQuantities);
    }
    next();
  },

  sanitizeBody('date').escape(),

  body('date', 'The date is required.').isISO8601(),
  body('item')
    .isLength({ min: 1 })
    .withMessage('At least an item is required.')
    .isArray()
    .withMessage('Must be an array.')
    .custom((value, { req }) => value.length === req.body.itemQuantities.length)
    .withMessage('Must have the same number of items as with itemQuantities.'),
  body('itemQuantities', 'At least an item is required.')
    .isLength({ min: 1 })
    .isArray(),

  function (req, res, next) {
    req.body.date = moment(req.body.date);
    console.log(req.body.date);
    const shipment = new Shipment({
      date: req.body.date,
      items: req.body.item,
      itemQuantities: req.body.itemQuantities
    });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const getItems = {
        items: function (cb) {
          Item.find(cb);
        }
      };
      const afterGet = function (err, results) {
        if (err) next(err);
        else {
          res.render('shipmentsForm', {
            title: 'Create Shipment',
            shipment: shipment,
            inventory: results.items,
            errors: errors.array()
          });
        }
      };

      async.parallel(getItems, afterGet);
    } else {
      shipment.save({}, function (err, theShipment) {
        if (err) next(err);
        else res.redirect(theShipment.url);
      });
    }
  }
];

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
    else if (results.shipment == null) res.redirect('/shipments');
    else {
      res.render('shipmentsView', {
        title: 'View Shipment',
        shipment: results.shipment
      });
    }
  };

  async.parallel(getShipment, afterGet);
};

exports.shipmentUpdateGet = function (req, res, next) {
  const getShipmentAndItems = {
    shipment: function (cb) {
      Shipment.findById(req.params.id).exec(cb);
    },
    inventory: function (cb) {
      Item.find(cb);
    }
  };

  const afterGet = function (err, results) {
    if (err) next(err);
    else if (results.shipment == null || results.shipment === undefined) {
      res.redirect('/shipments');
    } else {
      res.render('shipmentsForm', {
        title: 'Update Shipment',
        inventory: results.inventory,
        shipment: results.shipment
      });
    }
  };

  async.parallel(getShipmentAndItems, afterGet);
};

exports.shipmentUpdatePut = [
  (req, res, next) => {
    if (!(req.body.item instanceof Array)) {
      if (typeof req.body.item === 'undefined') req.body.item = [];
      else req.body.item = new Array(req.body.item);
    }
    if (!(req.body.itemQuantities instanceof Array)) {
      if (typeof req.body.itemQuantities === 'undefined') {
        req.body.itemQuantities = [];
      } else req.body.itemQuantities = new Array(req.body.itemQuantities);
    }
    next();
  },

  sanitizeBody('date').escape(),

  body('date', 'The date is required.').isISO8601(),
  body('item')
    .isLength({ min: 1 })
    .withMessage('At least an item is required.')
    .isArray()
    .withMessage('Must be an array.')
    .custom((value, { req }) => value.length === req.body.itemQuantities.length)
    .withMessage('Must have the same number of items as with itemQuantities.'),
  body('itemQuantities', 'At least an item is required.')
    .isLength({ min: 1 })
    .isArray(),

  function (req, res, next) {
    req.body.date = moment(req.body.date);
    const shipment = new Shipment({
      date: req.body.date,
      items: req.body.item,
      itemQuantities: req.body.itemQuantities,
      _id: req.params.id
    });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const getItems = {
        items: function (cb) {
          Item.find(cb);
        }
      };
      const afterGet = function (err, results) {
        if (err) next(err);
        else {
          res.render('shipmentsForm', {
            title: 'Create Shipment',
            shipment: shipment,
            inventory: results.items,
            errors: errors.array()
          });
        }
      };

      async.parallel(getItems, afterGet);
    } else {
      Shipment.findByIdAndUpdate(
        req.params.id,
        shipment,
        {},
        (err, theShipment) => {
          if (err) next(err);
          else res.redirect(theShipment.url);
        }
      );
    }
  }
];

exports.shipmentDeleteGet = function (req, res, next) {
  const getShipment = {
    shipment: function (cb) {
      Shipment.findById(req.params.id).populate('items').exec(cb);
    }
  };

  const afterGet = function (err, results) {
    if (err) next(err);
    else if (results.shipment == null || results.shipment === undefined) {
      res.redirect('/shipments');
    } else {
      res.render('shipmentsDelete', {
        title: 'Delete Shipment',
        shipment: results.shipment
      });
    }
  };

  async.parallel(getShipment, afterGet);
};

exports.shipmentDeletePut = function (req, res, next) {
  Shipment.findByIdAndDelete(req.body.shipmentid, function (err) {
    if (err) next(err);
    else res.redirect('/shipments');
  });
};
