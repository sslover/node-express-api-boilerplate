var express = require('express');
var router = express.Router();

/* GET home route */
router.get('/', function(req, res, next) {
  
  var jsonData = {
  	'name': 'node-express-api-boilerplate',
  	'api-status':'hello'
  }

  // respond with json data
  res.json(jsonData)
});

router.get('/api/v1/test', function(req,res,next){
	  var jsonData = {
  	'name': 'node-express-api-boilerplate',
  	'api-status':'msdfsfs'
  }

  // respond with json data
  res.json(jsonData)
})

module.exports = router;