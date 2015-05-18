var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BoardSchema = new Schema({
    name: String,
    owner: String
});

module.exports = mongoose.model('Board', BoardSchema);
