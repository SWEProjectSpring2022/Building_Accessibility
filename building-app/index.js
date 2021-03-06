// set up Express
var express = require('express');
var app = express();

// set up BodyParser
//var util = require('util')
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// import the Building class from Building.js
var Building = require('./Building.js');
var Form = require('./Form.js');
app.set('view engine', 'ejs');


	var buildingToBeEdited = "";

	app.use('/test', (req, res) => {
	// create a JSON object
	var data = { 'message' : 'It works!' };
      	// send it back
	res.json(data);
    });


	app.use('/create', bodyParser.json(), (req, res) => {

	// construct the Building from the form data which is in the request body
	var newBuilding = new Building ({
		name: req.body.name,
		address: req.body.address,
		accessible_entrance: req.body.accessible_entrance,
		//accessible_restroom: req.body.accessible_restroom == "yes" ? true : false,
		accessible_restroom: req.body.accessible_restroom,
		handicap_parking: req.body.handicap_parking
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
		}); 
	});

	app.use('/addForms', bodyParser.json(), (req, res) => {

		// construct the Building from the form data which is in the request body
		var newForm = new Form ({
			name: req.body.name,
			building_name : req.body.building_name,
			description : req.body.description
			});
	
		// save the form to the database
		newForm.save( (err) => { 
			if (err) {
				res.type('html').status(200);
				res.write('uh oh: ' + err);
				console.log(err);
				res.end();
			}
			else {
				// display the "successfull created" message
				res.send('successfully added ' + newForm.name + " buidlding: " + newForm.building_name + ' to the database');
			}
			} ); 
	});

	app.use('/androidGetForms', (req,res)=>{
		Form.find((err, allForms) => {
			if(err){
				res.json({'status': 'Error'});
			} else if(allForms.length == 0){
				res.json({'status' : 'None'});
			} else{
				res.json({'status' : 'Success',
						'forms' : allForms} );
			}
		});

	});


		app.use('/androidAddForms', bodyParser.json(), (req, res) => {

			// construct the Building from the form data which is in the request body
			var newForm = new Form ({
				name: req.query.name,
				building_name : req.query.building_name,
				description : req.query.description
				});
		
			// save the form to the database
			newForm.save( (err) => { 
				if (err) {
					// res.type('html').status(200);
					// res.write('uh oh: ' + err);
					// console.log(err);
					// res.end();
					var data1 = { 'message' : 'Error' };
					res.json(data1);
				}
				else {
					// display the "successfull created" message
					var data = { 'message' : 'Submitted' };
      				// send it back
					res.json(data);
					//res.send('successfully added ' + newForm.name + " buidlding: " + newForm.building_name + ' to the database');
				}
				} ); 
			}
			);

app.use('/delete', bodyParser.json(), (req, res) => {
	
	// construct the Building from the form data which is in the request body
	var filter = {'name' : req.body.name};
	var passed = 0;
	Building.findOneAndDelete( filter, (err,building) => {
		if(err){
			console.log('uh oh' + err);
		} else if(!building){
			console.log("No building found");
		} else{
			console.log("Building found");
			var passed = 1;
		}
	});
	if (passed == 1){
    	res.send('successfully deleted ' + req.body.name + ' from the database');
	}
	else{
		res.send(req.body.name + ' does not exist');

	}
}
);

// endpoint for showing all the buildings
app.use('/all', (req, res) => {
    
	// find all the Building objects in the database
	Building.find( {}, (err, buildings) => {
		if (err) {
		    res.type('html').status(200);
		    console.log('uh oh' + err);
		    res.write(err);
		}
		else {
			if (buildings.length == 0) {
				res.type('html').status(200);
				res.write('There are no buildings');
				res.end();
				return;
		    }
		    else {

				// Below single line accessed from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
				buildings.sort((a, b) => a.name.localeCompare(b.name))

				res.type('html').status(200);
				res.write('Here are the buildings in the database:');
				res.write('<ul>');
				// show all the buildings
				buildings.forEach( (building) => {
					res.write('<li>');
					res.write('Name: ' + building.name + '; address: ' + building.address + '; accessible entrance: ' + building.accessible_entrance + '; accessible restroom: ' + building.accessible_restroom + '; handicap parking: ' + building.handicap_parking);
					// this creates a link to the /delete endpoint
					//res.write(" <a href=\"/delete?name=" + building.name + "\">[Delete]</a>");
					res.write('</li>');
					 
			});
			res.write('</ul>');
			res.end();
		    }
		}
	    });
});

app.use('/showInformation', (req,res) => {
	var query = {"name" : req.query.name };
	Building.findOne(query, (err, result) => {
		if (err) {
			res.render("error", {'error' : err});
		}
		else {
			res.render("viewForm", {"building" : result});
		}
	})
});

app.use('/allForView', (req, res) => {
    
	// find all the Building objects in the database
	Building.find( {}, (err, buildings) => {
		if (err) {
		    res.type('html').status(200);
		    console.log('uh oh' + err);
		    res.write(err);
		}
		else {
			if (buildings.length == 0) {
				res.type('html').status(200);
				res.write('There are no buildings');
				res.end();
				return;
		    }
		    else {

				// Below single line accessed from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
				buildings.sort((a, b) => a.name.localeCompare(b.name))

				res.type('html').status(200);
				res.write('Here are the buildings in the database:');
				res.write('<ul>');
				// show all the buildings
				buildings.forEach( (building) => {
					res.write('<li>');
					res.write('Name: ' + building.name);
					
					res.write(" <a href=\"/showInformation?name=" + building.name + "\">[ViewInfo]</a>");
					res.write('</li>');
					 
			});
			res.write('</ul>');
			res.end();
		    }
		}
	    });
});

app.use('/viewForms', (req, res) => {
    
	// find all the Building objects in the database
	Form.find( {}, (err, forms) => {
		if (err) {
		    res.type('html').status(200);
		    console.log('uh oh' + err);
		    res.write(err);
		}
		else {
			if (forms.length == 0) {
				res.type('html').status(200);
				res.write('There are no forms submitted to the admin');
				res.end();
				return;
		    }
		    else {

				// Below single line accessed from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
				forms.sort((a, b) => a.name.localeCompare(b.name))

				res.type('html').status(200);
				res.write('Here are the forms in the database:');
				res.write('<ul>');
				// show all the buildings
				forms.forEach( (form) => {
					res.write('<li>');
					res.write('User Name: ' + form.name);
					res.write('<br>');
					res.write('Building Name: ' + form.building_name);
					res.write('<br>');
					res.write('Description:' + form.description);
					res.write('</li>');
					 
			});
			res.write('</ul>');
			res.end();
		    }
		}
	    });
});


app.use('/view', (req, res) => {
	var queryObject = {};
	if (req.query.name) {
	    queryObject = { "name" : req.query.name };
	}

	var filter = {'name' : req.query.name};
	Building.findOne( filter, (err,building) => {
		if(err){
			console.log('uh oh' + err);
		} else if(!building){
			console.log("No building found");
		} else{
			res.write('<li>');
			res.write('Name: ' + building.name + '; address: ' + building.address + '; accessible entrance: ' + building.accessible_entrance + '; accessible restroom: ' + building.accessible_restroom + '; handicap parking: ' + building.handicap_parking);
			res.write('</li>');
			console.log("Building found");
		}
	});
    res.redirect('/all');
});

app.use('/delete', (req, res) => {
	var queryObject = {};
	if (req.query.name) {
	    queryObject = { "name" : req.query.name };
	}

	var filter = {'name' : req.query.name};
	Building.findOneAndDelete( filter, (err,building) => {
		if(err){
			console.log('uh oh' + err);
		} else if(!building){
			console.log("No building found");
		} else{
			console.log("Building found");
		}
	});
    res.redirect('/all');
});

app.use('/showEditForm', (req,res) => {
	var query = {"name" : req.query.name };
	Building.findOne(query, (err, result) => {
		if (err) {
			res.render("error", {'error' : err});
		}
		else {
			res.render("editForm", {"building" : result});
		}
	})
});

app.use('/allForEditing', (req, res) => {
    
	// find all the Building objects in the database
	Building.find( {}, (err, buildings) => {
		if (err) {
		    res.type('html').status(200);
		    console.log('uh oh' + err);
		    res.write(err);
		}
		else {
			if (buildings.length == 0) {
				res.type('html').status(200);
				res.write('There are no buildings');
				res.end();
				return;
		    }
		    else {

				// Below single line accessed from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
				buildings.sort((a, b) => a.name.localeCompare(b.name))

				res.type('html').status(200);
				res.write('Here are the buildings in the database:');
				res.write('<ul>');
				// show all the buildings
				buildings.forEach( (building) => {
					res.write('<li>');
					res.write('Name: ' + building.name + '; address: ' + building.address + '; accessible entrance: ' + building.accessible_entrance + '; accessible restroom: ' + building.accessible_restroom + '; handicap parking: ' + building.handicap_parking);
					
					res.write(" <a href=\"/showEditForm?name=" + building.name + "\">[Edit]</a>");
					res.write('</li>');
					 
			});
			res.write('</ul>');
			res.end();
		    }
		}
	    });
});

app.use('/edit', bodyParser.json(), (req, res) => {
	var queryObject = {};
	if (req.query.name) {
	    queryObject = { "name" : req.query.name };
	}

	// worked when filter was req.body.name and the
	// html contained an initial search for the building's name in the edit form
	//var filter = {'name' : req.query.name};
	var filter = {'name' : req.body.name};
	console.log(req.query.name);

	if (req.body.newname == null || !req.body.newname) {
		req.body.newname = req.body.name;
	}

	if (req.body.newaddress == null || !req.body.newaddress) {
		req.body.newaddress = req.body.address;
	}
	
	var newBuilding = new Building ({
		name: req.body.newname,
		address: req.body.newaddress,
		accessible_entrance: req.body.accessible_entrance,
		accessible_restroom: req.body.accessible_restroom,
		handicap_parking: req.body.handicap_parking
	    });

	Building.findOneAndUpdate( filter, 
		{$set: {
			name: newBuilding.name,
			address: newBuilding.address,
			accessible_entrance: newBuilding.accessible_entrance,
			accessible_restroom: newBuilding.accessible_restroom,
			handicap_parking: newBuilding.handicap_parking
		}}, 
		(err, building) => {
		if(err){
			console.log('uh oh' + err);
		} else if(!building){
			console.log("No building found");
		} else {
			console.log("Building found");	
		} 
	});
	console.log("Entry updated successfully");
	res.redirect('/allForEditing');
});

// endpoint for accessing data via the web api
// to use this, make a request for /api to get an array of all Building objects
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
		    res.json( { "name" : building.name ,
			"address" : building.address, 
				"accessible entrance" : building.accessible_entrance, 
					"accessible restroom" : building.accessible_restroom , 
						"handicap parking" : building.handicap_parking} );
		}
		else {
		    // construct an array out of the result
		    var returnArray = [];
		    buildings.forEach( (building) => {
			    returnArray.push( { "name" : building.name,
				"address" : building.address,
					"accessible entrance" : building.accessible_entrance, 
						"accessible restroom" : building.accessible_restroom, 
							"handicap parking" : building.handicap_parking } );
			});
		    // send it back as JSON Array
		    res.json(returnArray); 
		}
		
	    });
    });

app.use('/public', express.static('public'));


// app.use('/', (req, res) => { res.redirect('/public/buildingform.html'); } );
app.use('/', (req, res) => { res.redirect('/public/main.html'); } );

//app.use('/new_building', (req, res) => { res.redirect('/public/buildingform.html');});


app.listen(3000,  () => {
	console.log('Listening on port 3000');
    });
