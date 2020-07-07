var mongoose = require('mongoose');
var async = require('async');
const category = require('../models/category');
var Item = mongoose.model('Item');
var Shipment = mongoose.model('Shipment');
var Category = mongoose.model('Category');
const { validationResult, body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

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
  const getCategories = {
    categories: function (cb) {
      Category.find().exec(cb);
    }
  };
  const afterGet = function (err, results) {
    if (err) next(err);
    res.render('itemForm', {
      title: 'Create Item',
      categories: results.categories
    });
  };
  async.parallel(getCategories, afterGet);
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
      Item.findById(req.params.id).populate('categories').exec(cb);
    },
    shipment: function (cb) {
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
  var getAllParentCategories = {
    categories: function (cb) {
      Category.find({ parentCategory: null }).exec(cb);
    }
  };

  var afterGet = function (err, results) {
    if (err) next(err);
    res.render('categoryIndex', {
      title: 'View Parent Categories',
      categories: results.categories
    });
  };

  async.parallel(getAllParentCategories, afterGet);
};

exports.categoryCreateGet = function (req, res, next) {
  var getCategories = {
    categories: function (cb) {
      Category.find(cb);
    }
  };

  var afterGet = function (err, results) {
    if (err) next(err);
    res.render('categoryForm', {
      title: 'Create Category',
      categories: results.categories,
      errors: null
    });
  };

  async.parallel(getCategories, afterGet);
};

exports.categoryCreatePut = [
  sanitizeBody('*').escape(),

  body('name', 'Name must not be empty').trim().isLength({ min: 1 }),

  (req, res, next) => {
    const errors = validationResult(req);

    var category = new Category({
      name: req.body.name,
      parentCategory: req.body.parentCategory
    });
    if (!errors.isEmpty()) {
      var getCategories = {
        categories: function (cb) {
          Category.find(cb);
        }
      };

      var afterGet = function (err, results) {
        if (err) next(err);
        res.render('categoryForm', {
          title: 'Create Category',
          categories: results.categories,
          errors: errors,
          selected: category.parentCategory,
          name: category.name
        });

        async.parallel(getCategories, afterGet);
      };
    } else {
      category.save(function (err) {
        if (err) next(err);
        console.log(category);
        res.redirect(category.url);
      });
    }
  }
];

exports.categoryView = function (req, res, next) {
  var getCategoriesAndItems = {
    category: function (cb) {
      if (req.params.id.length !== 24) {
        res.redirect('/inventory/categories');
        return;
      }
      Category.findById(req.params.id).populate('parentCategory').exec(cb);
    },
    categories: function (cb) {
      Category.find({ parentCategory: req.params.id }).exec(cb);
    },
    items: function (cb) {
      Item.find({ categories: req.params.id }).exec(cb);
    }
  };

  var afterGet = function (err, results) {
    if (err) next(err);
    if (results.category == null || results.category === undefined) {
      res.redirect('/inventory/categories');
    }
    console.log(results.category);

    res.render('categoryView', {
      title: results.category.name,
      categories: results.categories,
      category: results.category,
      items: results.items
    });
  };

  async.parallel(getCategoriesAndItems, afterGet);
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
