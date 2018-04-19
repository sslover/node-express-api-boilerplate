var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var geocoder = require('geocoder'); // geocoder library

// our db model
var Animal = require("../models/model.js");

// simple route to render am HTML form that can POST data to our server
// NOTE that this is not a standard API route, and is really just for testing
router.get('/create-pet', function(req,res){
  res.render('pet-form.html')
})

router.get('/create-pet-location', function(req,res){
  res.render('pet-form-with-location.html')
})

// simple route to render an HTML page that pulls data from our server and displays it on a page
// NOTE that this is not a standard API route, and is really for testing
router.get('/show-pets', function(req,res){
  res.render('show-pets.html')
})

/**
 * GET '/'
 * Default home route. Just relays a success message back.
 * @param  {Object} req
 * @return {Object} json
 */
router.get('/', function(req, res) {

  var jsonData = {
  	'name': 'node-express-api-boilerplate',
  	'api-status':'OK'
  }

  // respond with json data
  res.json(jsonData)
});

// /**
//  * POST '/api/create'
//  * Receives a POST request of the new animal, saves to db, responds back
//  * @param  {Object} req. An object containing the different attributes of the Animal
//  * @return {Object} JSON
//  */

router.post('/api/create', function(req, res){

    console.log(req.body);

    // pull out the information from the req.body
    var name = req.body.name;
    var age = req.body.age;
    var tags = req.body.tags.split(","); // split string into array
    var weight = req.body.weight;
    var color = req.body.color;
    var url = req.body.url;

    // hold all this data in an object
    // this object should be structured the same way as your db model
    var animalObj = {
      name: name,
      age: age,
      tags: tags,
      description: {
        weight: weight,
        color: color
      },
      url: url
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

      //return res.json(jsonData);
      return res.redirect('/show-pets')

    })
});

// /**
//  * GET '/api/get/:id'
//  * Receives a GET request specifying the animal to get
//  * @param  {String} req.params.id - The animalId
//  * @return {Object} JSON
//  */

router.get('/api/get/:id', function(req, res){

  var requestedId = req.params.id;

  // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findById
  Animal.findById(requestedId, function(err,data){

    // if err or no user found, respond with error
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that animal'};
       return res.json(error);
    }

    // otherwise respond with JSON data of the animal
    var jsonData = {
      status: 'OK',
      animal: data
    }

    return res.json(jsonData);

  })
})

// /**
//  * GET '/api/get'
//  * Receives a GET request to get all animal details
//  * @return {Object} JSON
//  */

router.get('/api/get', function(req, res){

  // mongoose method to find all, see http://mongoosejs.com/docs/api.html#model_Model.find
  Animal.find(function(err, data){
    // if err or no animals found, respond with error
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find animals'};
      return res.json(error);
    }

    // otherwise, respond with the data

    var jsonData = {
      status: 'OK',
      animals: data
    }

    res.json(jsonData);

  })

})

// /**
//  * GET '/api/search'
//  * Receives a GET request to search an animal
//  * @return {Object} JSON
//  */
router.get('/api/search', function(req,res){

  // first use req.query to pull out the search query
  var searchTerm = req.query.name;
  console.log("we are searching for " + searchTerm);

  // let's find that animal
  Animal.find({name: searchTerm}, function(err,data){
    // if err, respond with error
    if(err){
      var error = {status:'ERROR', message: 'Something went wrong'};
      return res.json(error);
    }

    //if no animals, respond with no animals message
    if(data==null || data.length==0){
      var message = {status:'NO RESULTS', message: 'We couldn\'t find any results'};
      return res.json(message);
    }

    // otherwise, respond with the data

    var jsonData = {
      status: 'OK',
      animals: data
    }

    res.json(jsonData);
  })

})

// /**
//  * POST '/api/update/:id'
//  * Receives a POST request with data of the animal to update, updates db, responds back
//  * @param  {String} req.params.id - The animalId to update
//  * @param  {Object} req. An object containing the different attributes of the Animal
//  * @return {Object} JSON
//  */

router.post('/api/update/:id', function(req, res){

   var requestedId = req.params.id;

   var dataToUpdate = {}; // a blank object of data to update

    // pull out the information from the req.body and add it to the object to update
    var name, age, weight, color, url;

    // we only want to update any field if it actually is contained within the req.body
    // otherwise, leave it alone.
    if(req.body.name) {
      name = req.body.name;
      // add to object that holds updated data
      dataToUpdate['name'] = name;
    }
    if(req.body.age) {
      age = req.body.age;
      // add to object that holds updated data
      dataToUpdate['age'] = age;
    }
    if(req.body.weight) {
      weight = req.body.weight;
      // add to object that holds updated data
      dataToUpdate['description'] = {};
      dataToUpdate['description']['weight'] = weight;
    }
    if(req.body.color) {
      color = req.body.color;
      // add to object that holds updated data
      if(!dataToUpdate['description']) dataToUpdate['description'] = {};
      dataToUpdate['description']['color'] = color;
    }
    if(req.body.url) {
      url = req.body.url;
      // add to object that holds updated data
      dataToUpdate['url'] = url;
    }

    var tags = []; // blank array to hold tags
    if(req.body.tags){
      tags = req.body.tags.split(","); // split string into array
      // add to object that holds updated data
      dataToUpdate['tags'] = tags;
    }


    console.log('the data to update is ' + JSON.stringify(dataToUpdate));

    // now, update that animal
    // mongoose method findByIdAndUpdate, see http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
    Animal.findByIdAndUpdate(requestedId, dataToUpdate, function(err,data){
      // if err saving, respond back with error
      if (err){
        var error = {status:'ERROR', message: 'Error updating animal'};
        return res.json(error);
      }

      console.log('updated the animal!');
      console.log(data);

      // now return the json data of the new animal
      var jsonData = {
        status: 'OK',
        animal: data
      }

      return res.json(jsonData);

    })

})

/**
 * GET '/api/delete/:id'
 * Receives a GET request specifying the animal to delete
 * @param  {String} req.params.id - The animalId
 * @return {Object} JSON
 */

router.get('/api/delete/:id', function(req, res){

  var requestedId = req.params.id;

  // Mongoose method to remove, http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
  Animal.findByIdAndRemove(requestedId,function(err, data){
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that animal to delete'};
      return res.json(error);
    }

    // otherwise, respond back with success
    var jsonData = {
      status: 'OK',
      message: 'Successfully deleted id ' + requestedId
    }

    res.json(jsonData);

  })

})

// examples of a GET route using an HTML template

router.get('/pets', function(req,res){

  Animal.find(function(err, data){
    // if err or no animals found, respond with error
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find animals'};
      return res.json(error);
    }

    // otherwise, respond with the data

    var templateData = {
      status: 'OK',
      animals: data
    }

    res.render('pet-template.html',templateData);

  })

})

module.exports = router;


// examples of a GET route using an HTML template
router.get('/edit/:id', function(req,res){

  var requestedId = req.params.id;

  // mongoose method, see http://mongoosejs.com/docs/api.html#model_Model.findById
  Animal.findById(requestedId, function(err,data){
    // if err or no user found, respond with error
    if(err || data == null){
      var error = {status:'ERROR', message: 'Could not find that animal'};
       return res.json(error);
    }

    // otherwise preprate data of the animal
    var templateData = data;

    return res.render('edit-form.html', templateData);

  })
})

router.post('/api/create/location', function(req, res){

    console.log(req.body);

    // pull out the information from the req.body
    var name = req.body.name;
    var age = req.body.age;
    var tags = req.body.tags.split(","); // split string into array
    var weight = req.body.weight;
    var color = req.body.color;
    var url = req.body.url;
    var location = req.body.location;

    // hold all this data in an object
    // this object should be structured the same way as your db model
    var animalObj = {
      name: name,
      age: age,
      tags: tags,
      description: {
        weight: weight,
        color: color
      },
      url: url
    };

  // if there is no location, return an error
    if(!location) return res.json({status:'ERROR', message: 'You are missing a required field or have submitted a malformed request.'})

    console.log('location is --> ' + location);
    //now, let's geocode the location
    geocoder.geocode(location, function (err,data) {

      // if we get an error, or don't have any results, respond back with error
      if (!data || data==null || err || data.status == 'ZERO_RESULTS'){
        var error = {status:'ERROR', message: 'Error finding location'};
        return res.json({status:'ERROR', message: 'You are missing a required field or have submitted a malformed request.'})
      }

      console.log(data);
      // else, let's pull put the lat lon from the results
      var lon = data.results[0].geometry.location.lng;
      var lat = data.results[0].geometry.location.lat;

      // now, let's add this to our animal object from above
      animalObj.location = {
        geo: [lon,lat], // need to put the geo co-ordinates in a lng-lat array for saving
        name: data.results[0].formatted_address // the location name
      }

      // now, let's save it to the database
      // create a new animal model instance, passing in the object we've created
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
});

module.exports = router;
