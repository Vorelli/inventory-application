var mongoose = require('mongoose');
var async = require('async');
const category = require('../models/category');
var Item = mongoose.model('Item');
var Shipment = mongoose.model('Shipment');
var Category = mongoose.model('Category');
const { validationResult, body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var fs = require('fs');

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

exports.itemCreatePost = [
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === 'undefined') req.body.category = [];
      else req.body.category = new Array(req.body.category);
    }
    next();
  },

  sanitizeBody('name').escape(),
  sanitizeBody('price').escape(),
  sanitizeBody('inStock').escape(),

  body('name', 'Product name is required.').trim().isLength({ min: 1 }),
  body('description', 'Product description is required.')
    .trim()
    .isLength({ min: 1 }),
  body('price')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Price is required.')
    .isNumeric({ min: 0.01 })
    .withMessage('Price must be greater than 0.'),

  async (req, res, next) => {
    const errors = validationResult(req);
    var item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      inStock: req.body.inStock,
      categories: req.body.category
    });

    if (!errors.isEmpty()) {
      const getCategories = {
        categories: function (cb) {
          Category.find().exec(cb);
        }
      };

      const afterGet = function (err, results) {
        if (err) next(err);
        results.categories.forEach((category) => {
          if (item.categories.indexOf(category._id) !== -1) {
            category.checked = true;
          }
        });
        res.render('itemForm', {
          title: 'Create Item',
          categories: results.categories,
          item: item,
          errors: errors.array()
        });
      };
      async.parallel(getCategories, afterGet);
    } else {
      item.save(function (err, theItem) {
        if (err) next(err);
        else res.redirect(item.url);
      });
    }
  }
];

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
  const getItemAndCategories = {
    item: function (cb) {
      Item.findById(req.params.id).exec(cb);
    },
    categories: function (cb) {
      Category.find(cb);
    }
  };

  const afterGet = function (err, results) {
    if (err) next(err);
    if (results.item == null || results.item === undefined) {
      res.redirect('/inventory');
    }
    results.categories.forEach((category) => {
      if (results.item.categories.indexOf(category._id) !== -1) {
        category.checked = 'True';
      }
    });
    res.render('itemForm', {
      title: 'Update Item',
      categories: results.categories,
      item: results.item
    });
  };

  async.parallel(getItemAndCategories, afterGet);
};

exports.itemUpdatePut = [
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === 'undefined') req.body.category = [];
      else req.body.category = new Array(req.body.category);
    }
    next();
  },

  sanitizeBody('name').escape(),
  sanitizeBody('price').escape(),
  sanitizeBody('inStock').escape(),

  body('name', 'Product name is required.').trim().isLength({ min: 1 }),
  body('description', 'Product description is required.')
    .trim()
    .isLength({ min: 1 }),
  body('price')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Price is required.')
    .isNumeric({ min: 0.01 })
    .withMessage('Price must be greater than 0.'),

  async (req, res, next) => {
    const errors = validationResult(req);

    var newItem = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      inStock: req.body.inStock,
      categories: req.body.category,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      const getCategories = {
        categories: function (cb) {
          Category.find().exec(cb);
        }
      };

      const afterGet = function (err, results) {
        if (err) next(err);
        results.categories.forEach((category) => {
          if (newItem.categories.indexOf(category._id) !== -1) {
            category.checked = true;
          }
        });

        res.render('itemForm', {
          title: 'Update Item',
          categories: results.categories,
          item: newItem,
          errors: errors.array()
        });
      };

      async.parallel(getCategories, afterGet);
    } else {
      const oldItem = await Item.findById(req.params.id);
      Item.findByIdAndUpdate(req.params.id, newItem, {}, function (
        err,
        theItem
      ) {
        if (err) next(err);
        if (
          !req.body.picture &&
          fs.existsSync('public/images/' + oldItem.name + '.jpg')
        ) {
          fs.renameSync(
            'public/images/' + oldItem.name + '.jpg',
            'public/images/' + req.body.name + '.jpg'
          );
        }
        res.redirect(theItem.url);
      });
    }
  }
];

exports.itemDeleteGet = function (req, res, next) {
  const getItemAndShipments = {
    item: function (cb) {
      Item.findById(req.params.id).exec(cb);
    },
    shipments: function (cb) {
      Shipment.find({ items: req.params.id }).exec(cb);
    }
  };
  const afterGet = function (err, results) {
    if (err) next(err);
    res.render('itemDelete', {
      title: 'Delete Item',
      item: results.item,
      shipments: results.shipments
    });
  };
  async.parallel(getItemAndShipments, afterGet);
};

exports.itemDeletePut = function (req, res, next) {
  const getShipmentsAndItem = {
    shipments: function (cb) {
      Shipment.find({ items: req.body.itemid }).exec(cb);
    },
    item: function (cb) {
      Item.findById(req.body.itemid).exec(cb);
    }
  };

  const afterGet = function (err, results) {
    if (err) next(err);
    else if (results.item == null || results.item === undefined) {
      res.redirect('/inventory');
    } else if (results.shipments == null || results.shipments === undefined) {
      Item.findByIdAndDelete(req.body.itemid, (err) => {
        if (err) next(err);
        else res.redirect('/inventory');
      });
    } else {
      let error = null;
      results.shipments.forEach((shipment) => {
        for (let i = 0; i < shipment.items.length; i++) {
          if (shipment.items[i] || shipment.items[i]._id === req.body.itemid) {
            shipment.items.splice(i, 1);
            shipment.itemQuantities.splice(i, 1);
          }
        }
        Shipment.findByIdAndUpdate(shipment._id, shipment, (err) => {
          if (err) {
            error = err;
            next(err);
          }
        });
      });
      if (error == null) {
        if (fs.existsSync('public/images/' + results.item.name + '.jpg')) {
          fs.unlinkSync('public/images/' + results.item.name + '.jpg');
        }
        Item.findByIdAndDelete(req.body.itemid, (err) => {
          if (err) next(err);
          else res.redirect('/inventory');
        });
      } else {
        res.redirect('/inventory/item/' + req.body.itemid);
      }
    }
  };
  async.parallel(getShipmentsAndItem, afterGet);
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
  (req, res, next) => {
    if (req.body.parentCategory === 'None') req.body.parentCategory = null;
    next();
  },

  sanitizeBody('*').escape(),

  body('name', 'Name must not be empty').trim().isLength({ min: 1 }),
  body('parentCategory').optional({ checkFalsy: true, nullable: true }),

  (req, res, next) => {
    const errors = validationResult(req);

    var category = new Category({
      name: req.body.name
    });
    if (req.body.parentCategory !== '') {
      category.parentCategory = req.body.parentCategory;
    }
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
          errors: errors.array(),
          selected: category.parentCategory,
          name: category.name,
          selfID: null
        });

        async.parallel(getCategories, afterGet);
      };
    } else {
      category.save(function (err) {
        if (err) next(err);
        else res.redirect(category.url);
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
  const getCategoryAndCategories = {
    category: function (cb) {
      Category.findById(req.params.id).exec(cb);
    },
    categories: function (cb) {
      Category.find(cb);
    }
  };

  const afterGet = function (err, results) {
    if (err) next(err);
    if (!results.category) res.redirect('/inventory/categories');
    res.render('categoryForm', {
      title: 'Update Category',
      categories: results.categories,
      selected: results.category.parentCategory,
      selfID: results.category._id,
      name: results.category.name,
      errors: null
    });
  };

  async.parallel(getCategoryAndCategories, afterGet);
};

exports.categoryUpdatePut = [
  sanitizeBody('*').escape(),

  body('name', 'Name must not be empty').trim().isLength({ min: 1 }),

  (req, res, next) => {
    const errors = validationResult(req);

    var category = new Category({
      name: req.body.name,
      parentCategory: req.body.parentCategory,
      _id: req.params.id
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
          errors: errors.array(),
          selected: category.parentCategory,
          name: category.name,
          selfID: null
        });

        async.parallel(getCategories, afterGet);
      };
    } else {
      Category.findByIdAndUpdate(req.params.id, category, {}, function (
        err,
        theCategory
      ) {
        if (err) next(err);
        res.redirect(theCategory.url);
      });
    }
  }
];

exports.categoryDeleteGet = function (req, res, next) {
  const getCategoryAndItems = {
    category: function (cb) {
      Category.findById(req.params.id).exec(cb);
    },
    items: function (cb) {
      Item.find({ categories: req.params.id }).exec(cb);
    }
  };

  const afterGet = function (err, results) {
    if (err) next(err);

    res.render('categoryDelete', {
      title: 'Delete Category',
      items: results.items,
      category: results.category
    });
  };

  async.parallel(getCategoryAndItems, afterGet);
};

exports.categoryDeletePut = function (req, res, next) {
  let error = null;
  const getItems = {
    items: function (cb) {
      Item.find({ categories: req.params.id }).exec(cb);
    }
  };

  const afterGet = function (err, results) {
    error = err;
    if (err) next(err);
    else {
      results.items.forEach((item) => {
        for (let i = 0; i < item.categories.length; i++) {
          if (item.categories[i] === req.params.id) {
            item.categories.splice(i, 1);
          }
        }
        Item.findByIdAndUpdate(item._id, item, {}, (err) => {
          if (err) next(err);
          error = err;
        });
      });
    }
    if (error == null) {
      Category.findByIdAndDelete(req.body.categoryid, function (err) {
        if (err) next(err);
        res.redirect('/inventory/categories');
      });
    }
  };

  async.parallel(getItems, afterGet);
};
