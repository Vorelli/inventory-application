var express = require('express');
var router = express.Router();

const shipmentsController = require('../controllers/shipmentsController');

// /shipments/                      - view shipments
// /shipments/create/               - create shipment
// /shipments/:id/                  - view shipment
// /shipments/:id/update/           - update shipment
// /shipments/:id/delete/           - delete shipment

router.get('/', shipmentsController.index);

router.get('/create', shipmentsController.shipmentCreateGet);

router.post('/create', shipmentsController.shipmentCreatePut);

router.get('/:id', shipmentsController.shipmentView);

router.get('/:id/update', shipmentsController.shipmentUpdateGet);

router.post('/:id/update', shipmentsController.shipmentUpdatePut);

router.get('/:id/delete', shipmentsController.shipmentDeleteGet);

router.post('/:id/delete', shipmentsController.shipmentDeletePut);

module.exports = router;
