/*
this file deals with the authentication functionality of the app.
*/


/*importing required modules*/

const passport = require('passport');
const LocalStrategy= require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const User = require('./models/users');
const config = require('./config.js');

/*setting up local authentication strategy and exporting it as 'local'*/

exports.local = passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


exports.getToken = function(user) {
    return jwt.sign(user, config.SECRET_KEY, {expiresIn: "7d"});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.SECRET_KEY;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        // console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
}));

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (req,res, next)=>{
    const user = req.user;
    if(user.admin){
        
        next();
    }
    else{

        const err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        next(err);
    }
}