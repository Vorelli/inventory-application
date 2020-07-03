exports.index = function (req, res, next) {
  res.send('Index UNDONE');
};

exports.itemCreateGet = function (req, res, next) {
  res.send('Item create GET UNDONE');
};

exports.itemCreatePut = function (req, res, next) {
  res.send('Item create PUT UNDONE');
};

exports.itemView = function (req, res, next) {
  res.send('Item ' + req.params.id + ' View UNDONE');
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
