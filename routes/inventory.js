var express = require('express');
var router = express.Router();
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: async function (req, file, cb) {
    await req.body.name;
    cb(null, req.body.name + '.jpg');
  }
});
var upload = multer({ storage: storage });

const inventoryController = require('../controllers/inventoryController');

// /inventory/                      - main view (maybe show all items)
// /inventory/item/:id/             - single item
// /inventory/item/:id/delete       - delete item
// /inventory/item/:id/update       - update item
// /inventory/item/create/          - create item
// /inventory/categories/           - view categories
// /inventory/categories/create/    - create category
// /inventory/categories/:id        - view category and items within
// /inventory/categories/:id/update - update category
// /inventory/categories/:id/delete - delete category

router.get('/', inventoryController.index);
// homepage

router.get('/item/create', inventoryController.itemCreateGet);
// create item get

router.post(
  '/item/create',
  upload.single('picture'),
  inventoryController.itemCreatePost
);
// create item put

router.get('/item/:id', inventoryController.itemView);
// view singular item

router.get('/item/:id/update', inventoryController.itemUpdateGet);
// update item get

router.post(
  '/item/:id/update',
  upload.single('picture'),
  inventoryController.itemUpdatePut
);
// update item put

router.get('/item/:id/delete', inventoryController.itemDeleteGet);
// update item get

router.post('/item/:id/delete', inventoryController.itemDeletePut);
// update item put

router.get('/categories', inventoryController.categoryViewAll);
// view all categories

router.get('/categories/create', inventoryController.categoryCreateGet);
// create category get

router.post('/categories/create', inventoryController.categoryCreatePut);
// create category put

router.get('/categories/:id', inventoryController.categoryView);
// create category get

router.get('/categories/:id/update', inventoryController.categoryUpdateGet);
// create category get

router.post('/categories/:id/update', inventoryController.categoryUpdatePut);
// create category put

router.get('/categories/:id/delete', inventoryController.categoryDeleteGet);
// create category get

router.post('/categories/:id/delete', inventoryController.categoryDeletePut);
// create category put

module.exports = router;
