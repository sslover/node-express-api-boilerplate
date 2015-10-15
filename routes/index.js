var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// our db model
var Animal = require("../models/model.js");

/**
 * GET '/'
 * Default home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */
router.get('/', function(req, res, next) {
  
  var jsonData = {
  	'name': 'node-express-api-boilerplate',
  	'api-status':'OK'
  }

  // respond with json data
  res.json(jsonData)
});


/**
 * POST '/api/create'
 * Receives a POST request of the new user and location, saves to db, responds back
 * @param  {Object} req. An object containing the different attributes of the Person
 * @return {Object} JSON
 */

router.post('/api/create', function(req, res, next){

    console.log(req.body);

    // pull out the information from the req.body
    var name = req.body.name;
    var age = req.body.age;
    var tags = req.body.tags.split(","); // split string into array
    var weight = req.body.weight;
    var color = req.body.color;

    // hold all this data in an object
    // this object should be structured the same way as your db model
    var animalObj = {
      name: name,
      age: age,
      tags: tags,
      description: {
        weight: weight,
        color: color
      }
    };

    // create a new animal model instance, passing in the object
    var animal = new Animal(animalObj);

    // now, save that animal instance to the database
    // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model-save    
    animal.save(function(err,data){
      // if err saving, respond back with error
      if (err){
        var error = {status:'ERROR', message: 'Error saving animal'};
        return res.json(error);
      }

      console.log('saved a new animal!');
      console.log(data);

      // now return the json data of the new animal
      var jsonData = {
        status: 'OK',
        animal: data
      }

      return res.json(jsonData);

    })  
});

// /**
//  * GET '/api/get/:id'
//  * Receives a GET request specifying the user to get
//  * @param  {String} req.param('id'). The userId
//  * @return {Object} JSON
//  */

// exports.getOne = function(req,res){

//   var requestedId = req.param('id');

//   // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findById
//   Person.findById(requestedId, function(err,data){

//     // if err or no user found, respond with error 
//     if(err || data == null){
//       var jsonData = {status:'ERROR', message: 'Could not find that person'};
//        return res.json(jsonData);
//     }

//     // otherwise respond with JSON data of the user
//     var jsonData = {
//       status: 'OK',
//       person: data
//     }

//     return res.json(jsonData);
  
//   })
// }

// /**
//  * GET '/api/get'
//  * Receives a GET request to get all user details
//  * @return {Object} JSON
//  */

// exports.getAll = function(req,res){

//   // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.find
//   Person.find(function(err, data){
//     // if err or no users found, respond with error 
//     if(err || data == null){
//       var jsonData = {status:'ERROR', message: 'Could not find people'};
//       return res.json(jsonData);
//     }

//     // otherwise, respond with the data 

//     var jsonData = {
//       status: 'OK',
//       people: data
//     } 

//     res.json(jsonData);

//   })

// }

// /**
//  * POST '/api/update/:id'
//  * Receives a POST request with data of the user to update, updates db, responds back
//  * @param  {String} req.param('id'). The userId to update
//  * @param  {Object} req. An object containing the different attributes of the Person
//  * @return {Object} JSON
//  */

// exports.update = function(req,res){

//   var requestedId = req.param('id');

//   // pull out the name and location
//   var name = req.body.name;
//   var location = req.body.location;

//   //now, geocode that location
//   geocoder.geocode(location, function ( err, data ) {

//     console.log(data);
    
//     // if we get an error, or don't have any results, respond back with error
//     if (err || data.status == 'ZERO_RESULTS'){
//       var jsonData = {status:'ERROR', message: 'Error finding location'};
//       res.json(jsonData);
//     }

//     // otherwise, update the user

//     var locationName = data.results[0].formatted_address; // the location name
//     var lon = data.results[0].geometry.location.lng;
//     var lat = data.results[0].geometry.location.lat;
    
//     // need to put the geo co-ordinates in a lng-lat array for saving
//     var lnglat_array = [lon,lat];

//     var dataToUpdate = {
//       name: name,
//       locationName: locationName,
//       locationGeo: lnglat_array
//     };

//     // now, update that person
//     // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate  
//     Person.findByIdAndUpdate(requestedId, dataToUpdate, function(err,data){
//       // if err saving, respond back with error
//       if (err){
//         var jsonData = {status:'ERROR', message: 'Error updating person'};
//         return res.json(jsonData);
//       }

//       console.log('updated the person!');
//       console.log(data);

//       // now return the json data of the new person
//       var jsonData = {
//         status: 'OK',
//         person: data
//       }

//       return res.json(jsonData);

//     })

//   });

// }

// /**
//  * GET '/api/delete/:id'
//  * Receives a GET request specifying the user to delete
//  * @param  {String} req.param('id'). The userId
//  * @return {Object} JSON
//  */

// exports.remove = function(req,res){

//   var requestedId = req.param('id');

//   // Mongoose method, http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
//   Person.findByIdAndRemove(requestedId,function(err, data){
//     if(err || data == null){
//       var jsonData = {status:'ERROR', message: 'Could not find that person to delete'};
//       return res.json(jsonData);
//     }

//     // otherwise, respond back with success
//     var jsonData = {
//       status: 'OK',
//       message: 'Successfully deleted id ' + requestedId
//     }

//     res.json(jsonData);

//   })

// }

module.exports = router;