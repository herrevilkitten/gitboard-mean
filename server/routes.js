var Board = require('./models/board'),
    User = require('./models/user'),
    express = require('express'),
    path = require('path'),
    passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth2').Strategy;
var GOOGLE_CLIENT_ID = process.env.GITBOARD_GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET = process.env.GITBOARD_GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL = 'http://localhost:8080/auth/google/callback',
    userCache = {
        byId: {},
        byProvider: {
            GOOGLE: {}
        }
    };

passport.serializeUser(function(id, done) {
    done(null, id);
});

passport.deserializeUser(function(id, done) {
    console.log('Deserializing', id);
    var user = userCache.byId[id];
    if (user) {
        done(null, user);
    } else {
        User.findOne({'_id': id}, function(error, user) {
            console.log('Mongoose found:', error, user);
            userCache.byId[user._id] = user;
            userCache.byProvider.GOOGLE[user.providerId] = user;
            if (error) {
                done(error, null);
            } else {
                done(null, user);
            }
        });
    }
});

passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function() {

            // To keep the example simple, the user's Google profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the Google account with a user record in your database,
            // and return that user instead.
            console.log('Google profile:', profile);
            var newUser = {
                    provider: 'GOOGLE',
                    providerId: profile.id,
                    name: profile.displayName,
                    email: profile.email,
                    picture: '',
                    lastAccess: new Date().getTime()
                },
                query = {
                    providerId: newUser.providerId,
                    provider: newUser.provider
                };

            if (profile.photos && profile.photos.length > 0) {
                newUser.picture = profile.photos[0].value;
            }

            console.log('Attempting to update or create:', newUser);
            User.findOneAndUpdate(query, newUser, {upsert: true}, function(error, user) {
                console.log('Mongoose upserted:', error, user);
                if (error) {
                    done(error, null);
                }
                userCache.byId[user._id] = user;
                userCache.byProvider.GOOGLE[user.providerId] = user;
                done(null, user._id);
            });
        });
    }
));

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}


function authenticationRoutes(app) {
    console.log('Setting up authentication routes');
    var router = express.Router();

    router.get('/signin', passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/plus.login',
            'https://www.googleapis.com/auth/plus.profile.emails.read'
        ]
    }));

    router.get('/callback', passport.authenticate('google', {
        successRedirect: '/board',
        failureRedirect: '/'
    }));

    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;
}

function apiRoutes(app) {
    console.log('Setting up API routes');
    var router = express.Router();

    router.use(ensureAuthenticated);

    router.get('/me', function(req, res) {
        res.json(req.user);
    });

    router.route('/board')
        .get(function(req, res) {
            console.log('Querying database for all boards');
            // use mongoose to get all nerds in the database
            Board.find(function(err, boards) {
                console.log('Results:', err, boards);

                // if there is an error retrieving, send the error.
                // nothing after res.send(err) will execute
                if (err)
                    res.send(err);

                res.json(boards); // return all nerds in JSON format
            });
        })
        .post(function(req, res) {
            console.log('Creating new board with data:', req.body);
            var createdOn = new Date();
            var board = new Board({
                name: req.body.params.name || 'New Board',
                owner: req.user.id,
                createdOn: createdOn,
                modifiedOn: createdOn
            });
            board.save(function(err, board) {
                if (err) {
                    res.send(err);
                }

                res.json(board);
            });
        });

    router.route('/board/:boardId')
        .get(function(req, res) {
            console.log('Querying database for board', req.params.boardId);
            // use mongoose to get all nerds in the database
            Board.findOne({'_id': req.params.boardId}, function(err, boards) {
                console.log('Results:', err, boards);

                // if there is an error retrieving, send the error.
                // nothing after res.send(err) will execute
                if (err)
                    res.send(err);

                res.json(boards); // return all nerds in JSON format
            });
        });


    return router;
}

function boardRoutes(app) {
    var router = express.Router();

    router.use(ensureAuthenticated);

    router.get('/', function(req, res) {
        console.log('Requesting boards page');
        res.sendFile(path.join(__dirname, '../build/web', 'boards.html')); // load our public/index.html file
    });

    router.get('/:boardId', function(req, res) {
        console.log('Requesting boards page');
        res.sendFile(path.join(__dirname, '../build/web', 'boards.html')); // load our public/index.html file
    });

    return router;
}

module.exports = function(app) {
    app.use('/auth/google', authenticationRoutes(app));
    app.use('/api', apiRoutes(app));
    app.use('/board', boardRoutes(app));

    console.log('Setting up default route');
    app.get('/', function(req, res) {
        console.log('Requesting front page');
        res.sendFile(path.join(__dirname, '../build/web', 'index.html')); // load our public/index.html file
    });
};
