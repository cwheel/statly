var express = require('express');
var session = require('express-session');
var cookie = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var passportLocal = require('passport-local');
var app = express();

var statly = require('../statly');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookie());
app.use(session({ 
    secret: 'test_app',
    saveUninitialized: true, 
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal(function(username, password, done) {
    done(null, {username: username});
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user)
});

app.get('/login', passport.authenticate('local'), function(req, res) {
    res.send("authed in test app");
});

app.get('/test', function(req, res) {
    statly.clockRequest(req, res);

    res.send("hi");
});

app.use(statly.initialize(app, "test_application", "/static"));


app.use(express.static(__dirname + "/static"));
app.listen(3001);
exports = module.exports = app;