var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => res.redirect('/inventory'));
// redirect to homepage

module.exports = router;
