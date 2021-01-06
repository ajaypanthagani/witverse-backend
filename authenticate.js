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

/*serialize user into session and deserialize user from session*/
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/*function to create a JSON web token*/
exports.getToken = function(user) {
    return jwt.sign(user, config.SECRET_KEY, {expiresIn: "7d"});
};

/*creating options variable for jwt authentication*/
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.SECRET_KEY;

/*setting up a JSON web token based authentication strategy*/
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

/*verify admin level access, authorization*/
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