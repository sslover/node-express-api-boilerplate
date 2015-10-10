var express = require('express');
var router = express.Router();

/* GET home route */
router.get('/', function(req, res, next) {
  
  var jsonData = {
  	'name': 'node-express-api-boilerplate',
  	'api-status':'OK'
  }

  // respond with json data
  res.json(jsonData)
});

module.exports = router;