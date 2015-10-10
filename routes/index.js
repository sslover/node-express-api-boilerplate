var express = require('express');
var router = express.Router();

/* GET home route */
router.get('/', function(req, res, next) {
  var jsonData = {
  	'name': 'node-express-api-boilerplate',
  	'api-status':'OK'
  }
  res.json({'status':'OK'})
});

module.exports = router;