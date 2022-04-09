var mongoose = require('mongoose');

// the host:port must match the location where you are running MongoDB
// the "myDatabase" part can be anything you like
mongoose.connect('mongodb://localhost:27017/myDatabase');

var Schema = mongoose.Schema;

var buildingSchema = new Schema({
	name: {type: String, required: true, unique: true},
    address: {type: String, required: true, unique: true},
    accessible_entrance: {type: String,required: true, unique: false},
    accessible_restroom: {type: String, required: true,unique:false},
    handicap_parking : {type: String, required: true, unique: false}
    });

// export personSchema as a class called Person
module.exports = mongoose.model('Building', buildingSchema);

buildingSchema.methods.standardizeName = function() {
    this.name = this.name.toLowerCase();
    return this.name;
}
