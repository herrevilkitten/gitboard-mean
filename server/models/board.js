var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BoardSchema = new Schema({
    name: String,
    owner: String,
    createdOn: Date,
    modifiedOn: Date,
    shapes: {},
    actions: []
});

module.exports = mongoose.model('Board', BoardSchema);
