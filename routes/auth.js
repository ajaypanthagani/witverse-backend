/*
    this file contains all the authentication related routes
*/

/*importing required modules*/
const express = require('express');
const cors = require('./cors');
const passport = require('passport');
const authenticate = require('../authenticate');

const response = require('../response');

/*importing required models*/
const User = require('../models/users');

/*creating an express router instance*/
const router = express.Router();


/*creating a router for login functionality*/
router.route('/login')
.options(cors.corsWithOptions, (req, res)=>{ res.sendStatus(200) }) //options method to send the route resources and capabilities, for cors
.get(cors.cors, passport.authenticate('local'), (req, res, next)=>{ //get method, unsupported

    //create and error
    const error = new Error(`GET method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass the error to next method (error handler)
    return next(error);

})
.post(cors.corsWithOptions, passport.authenticate('local'), (req, res, next) => { //post method to authenticate user based on the credentials sent using passports local strategy

    //passport attatches user object to req object

    //creating a jwt token based on the user id
    const token = authenticate.getToken({_id : req.user._id});

    //responding with a success message and jwt token
    res.status(200).json({message : 'login successful', token : token});

})
.put(cors.corsWithOptions, passport.authenticate('local'), (req, res, next) => {//put method, not supported

    //create error
    const error = new Error(`POST method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass the error to next method (error handler)
    return next(error);

})
.delete(cors.corsWithOptions, passport.authenticate('local'), (req, res, next)=>{//delete method, not supported

    //create error
    const error = new Error(`DELETE method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass the error to next method (error handler)
    return next(error);

})


/*creating route for the user resource*/
router.route('/user')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) }) //options method to send the route resources and capabilities, for cors
.get(cors.cors, authenticate.verifyUser, async (req, res, next)=>{ //get method to fetch the current authenticated user

    //wrapping the user into a json object with required formatting
    const user = response.wrapUser(req.user, req.user);

    //responding with the user with success status
    return res.status(200).json(user);
    
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //post method, not supported

    //create error
    const error = new Error(`POST method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass the error to next method (error handler)
    return next(error);

})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //put method, not supported

    //create error
    const error = new Error(`POST method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass the error to the next method (error handler)
    return next(error);

})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{ //delete method, not supported

    //create error
    const error = new Error(`POST method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass the error to next method (error handler)
    return next(error);

})


/*creating route for password reset functionality*/
router.route('/reset-password')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) }) //options method to send the route resources and capabilities, for cors
.get(cors.cors, authenticate.verifyUser, (req, res, next)=>{ //get method, not supported

    //create new error
    const error = new Error(`GET method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass the error to next method (error handler)
    return next(error);

})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //post method to reset the password
    
    //retrieving passwords sent on the req body
    const passwords = req.body;

    //check if both old passwor and new password are provided
    if(passwords.oldPassword && passwords.newPassword){

        //retrieving current authenticated user
        const user = req.user;


        //callling the changePassword method on the user object attatched by the passport local mongoose plugin
        user.changePassword(passwords.oldPassword, passwords.newPassword)
        .then( //handling the returned promise with then catch

            (response) => {

                //respond with status message
                return res.status(200).json(response);
            }
        )
        .catch( //catch any errors

            (error) => {

                //pass the errors to next method (error handler)
                return next(error);
            }
        )
    }
    else{ //if old password and new password are not provided

        //create an error
        const error = new Error('old password and new password are required');
        error.status = 400;

        //pass the error to next method (error handler)
        return next(error);
    }
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //put method, not supported

    //create error
    const error = new Error(`POST method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass the error to the next method (error handler)
    return next(error);

})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{ //delete method, not supported


    //create error
    const error = new Error(`POST method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass the error to the next method (error handler)
    return next(error);

})


//export the router
module.exports = router;