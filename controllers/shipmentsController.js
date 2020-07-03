exports.index = function (req, res, next) {
  res.send('Index UNDONE');
};

exports.shipmentCreateGet = function (req, res, next) {
  res.send('Shipment create GET UNDONE');
};

exports.shipmentCreatePut = function (req, res, next) {
  res.send('Shipment create POST UNDONE');
};

exports.shipmentView = function (req, res, next) {
  res.send('Shipment ' + req.params.id + ' View UNDONE');
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
