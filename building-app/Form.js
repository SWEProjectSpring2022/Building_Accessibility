var mongoose = require('mongoose');

// the host:port must match the location where you are running MongoDB
// the "myDatabase" part can be anything you like
mongoose.connect('mongodb://localhost:27017/myDatabase');

var Schema = mongoose.Schema;

var formSchema = new Schema({
	name: {type: String, required: true, unique: false},
    building_name: {type: String, required: true, unique: false},
    description : {type: String, required: false, unique: false}
    });

// export formSchema as a class called Form
module.exports = mongoose.model('Form', formSchema);
db.collection.dropIndexes();

formSchema.methods.standardizeName = function() {
    this.name = this.name.toLowerCase();
    return this.name;
}


