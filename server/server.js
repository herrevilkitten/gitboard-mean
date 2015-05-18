var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var path = require('path');
var session = require('express-session'),
    passport = require('passport'),
    morgan = require('morgan'),
    mongoose = require('mongoose');

var db = require('./config/db');

var port = process.env.GITBOARD_PORT || 8080,
    secret = process.env.GITBOARD_SECRET || 'not a gitboard secret';

console.log('Base directory is', __dirname);
console.log('Running on port', port);
console.log('MongoDB url is', db.url);

mongoose.connect(db.url);

app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(path.join(__dirname, '../build/web')));
app.use(session({secret: secret}));
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('combined'));

require('./routes')(app); // configure our routes

app.listen(port);

console.log('Server is listening on port ' + port);

exports = module.exports = app;
