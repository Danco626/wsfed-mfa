var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log('in index');
  res.render('index', { title: 'Auth0 Webapp sample Nodejs' });
});

module.exports = router;
