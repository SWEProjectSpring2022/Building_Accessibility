// set up Express
var express = require('express');
var app = express();

// set up BodyParser
//var util = require('util')
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// import the Building class from Building.js
var Building = require('./Building.js');

/***************************************/

// endpoint for creating a new building
// this is the action of the "create new building" form

// app.use('/new_building', (req,res) => {



// });

app.use('/create', bodyParser.json(), (req, res) => {

	// construct the Building from the form data which is in the request body
	var newBuilding = new Building ({
		name: req.body.name,
		accessible_entrance: req.body.accessible_entrance == "yes" ? true : false,
		accessible_restroom: req.body.accessible_restroom == "yes" ? true : false,
		handicap_parking: req.body.handicap_parking == "yes" ? true : false
	    });

	// save the person to the database
	newBuilding.save( (err) => { 
		if (err) {
		    res.type('html').status(200);
		    res.write('uh oh: ' + err);
		    console.log(err);
		    res.end();
		}
		else {
		    // display the "successfull created" message
		    res.send('successfully added ' + newBuilding.name + ' to the database');
		}
	    } ); 
    }
    );

app.use('/create', bodyParser.json(), (req, res) => {

	// construct the Building from the form data which is in the request body
	var newBuilding = new Building ({
		name: req.body.name,
		accessible_entrance: req.body.accessible_entrance == "yes" ? true : false,
		accessible_restroom: req.body.accessible_restroom == "yes" ? true : false,
		handicap_parking: req.body.handicap_parking == "yes" ? true : false
	    });

	// save the person to the database
	newBuilding.save( (err) => { 
		if (err) {
		    res.type('html').status(200);
		    res.write('uh oh: ' + err);
		    console.log(err);
		    res.end();
		}
		else {
		    // display the "successfull created" message
		    res.send('successfully added ' + newBuilding.name + ' to the database');
		}
	    } ); 
    }
    );

app.use('/delete', bodyParser.json(), (req, res) => {
	
	// construct the Building from the form data which is in the request body
	var filter = {'name' : req.body.name};
	Building.findOneAndDelete( filter, (err,building) => {
		if(err){
			console.log('uh oh' + err);
		} else if(!building){
			console.log("No building found");
		} else{
			console.log("Building found");
		}
	});
    res.send('successfully deleted ' + req.body.name + ' from the database');
    }
    );

// endpoint for showing all the buildings
app.use('/all', (req, res) => {
    
	// find all the Person objects in the database
	Building.find( {}, (err, buildings) => {
		if (err) {
		    res.type('html').status(200);
		    console.log('uh oh' + err);
		    res.write(err);
		}
		else {
		    if (buildings.length == 0) {
			res.type('html').status(200);
			res.write('There are no people');
			res.end();
			return;
		    }
		    else {
			res.type('html').status(200);
			res.write('Here are the buildings in the database:');
			res.write('<ul>');
			// show all the people
			buildings.forEach( (building) => {
			    res.write('<li>');
			    res.write('Name: ' + building.name + '; accessible entrance: ' + building.accessible_entrance + '; accessible restroom: ' + building.accessible_restroom + '; handicap parking: ' + building.handicap_parking);
			    // this creates a link to the /delete endpoint
			    res.write(" <a href=\"/delete?name=" + building.name + "\">[Delete]</a>");
			    res.write('</li>');
					 
			});
			res.write('</ul>');
			res.end();
		    }
		}
	    });
});




// endpoint for accessing data via the web api
// to use this, make a request for /api to get an array of all Person objects
// or /api?name=[whatever] to get a single object
app.use('/api', (req, res) => {
	// construct the query object
	var queryObject = {};
	if (req.query.name) {
	    // if there's a name in the query parameter, use it here
	    queryObject = { "name" : req.query.name };
	}
    
	Building.find( queryObject, (err, buildings) => {
		console.log(buildings);
		if (err) {
		    console.log('uh oh' + err);
		    res.json({});
		}
		else if (buildings.length == 0) {
		    // no objects found, so send back empty json
		    res.json({});
		}
		else if (buildings.length == 1 ) {
		    var building = buildings[0];
		    // send back a single JSON object
		    res.json( { "name" : building.name , "accessible entrance" : building.accessible_entrance, "accessible restroom" : building.accessible_restroom , "handicap parking" : building.handicap_parking} );
		}
		else {
		    // construct an array out of the result
		    var returnArray = [];
		    buildings.forEach( (building) => {
			    returnArray.push( { "name" : building.name, "accessible entrance" : building.accessible_entrance, "accessible restroom" : building.accessible_restroom, "handicap parking" : building.handicap_parking } );
			});
		    // send it back as JSON Array
		    res.json(returnArray); 
		}
		
	    });
    });




/*************************************************/

// app.use('/new', (req, res) => {
// 	var newPerson = new Person({name: req.query.name,
// 								age: req.query.age,
// 								accessible_entrance = req.query.accessible_entrance});

// 	newPerson.save((err) => {
// 		if(err){
// 			res.json({'status' : 'error'});
// 			console.log(err);
// 		} else{
// 			res.json({'status' : 'success'});
// 		}
// 	});
// });

app.use('/public', express.static('public'));


// app.use('/', (req, res) => { res.redirect('/public/buildingform.html'); } );
app.use('/', (req, res) => { res.redirect('/public/main.html'); } );

//app.use('/new_building', (req, res) => { res.redirect('/public/buildingform.html');});


app.listen(3000,  () => {
	console.log('Listening on port 3000');
    });
