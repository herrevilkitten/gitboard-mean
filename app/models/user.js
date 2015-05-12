var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    provider: String,
    providerId: String,
    name: String,
    email: String,
    picture: String,
    lastAccess: Number
});

module.exports = mongoose.model('User', UserSchema);
