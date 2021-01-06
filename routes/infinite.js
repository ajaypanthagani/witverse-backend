/*
    this file contains routes that support infinite scrolling feature for the client
*/

/*importing required modules*/
const express = require('express')
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const response = require('../response');

/*creating express router instance*/
const router =  express.Router();


/*importing required models*/
const Quote = require('../models/quotes');
const User = require('../models/users');

/*creating a route for quotes with special parameter limit to get the desired number of quotes*/
router.route('/quotes/:limit')
.options(cors.corsWithOptions, ( req, res)=> res.sendStatus(200)) //options method to send the route resources and capabilities, for cors
.get(cors.cors, authenticate.verifyUser, async (req, res, next)=>{ //get method to get the desired number of quotes

    //retrieve the limit from request parameters and parse it into a number
    const limit = parseInt(req.params.limit);

    //try catch block to catch and handle any possible errors
    try {

        //getting all the user ids that the current user is following along with his user id
        const authorIds = req.user.following.concat(req.user._id);

        //finding quotes authored by any of the users followed by the current user, newest first
        let quotes = await Quote.find({ 'author' : { $in : authorIds } }).sort({'_id' : -1}).populate('author').limit(limit);

        //wrapping all the quotes into a json object of required formatting
        quotes = quotes.map( (quote) => response.wrapQuote(quote, req.user) );

        //responding with quotes with success status
        return res.status(200).json(quotes);

    } catch (error) { //catch any error
        
        //pass the error to next method (error handler)
        return next(error);
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //post method, not supported

    //create error
    const error = new Error(`POST method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass error to next method (error handler)
    return next(error);

})
.put(cors.cors, authenticate.verifyUser, (req, res, next) => { //put method, not supported

    //create error
    const error = new Error(`PUT method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass error to next method (error handler)
    return next(error);

})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //delete method, not supported

    //create error
    const error = new Error(`DELETE method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass error to next method (error handler)
    return next(error);

});

/*creating route to fetch quotes created before a certain id*/
router.route('/quotes/:startingId/:limit')
.options(cors.corsWithOptions, ( req, res)=> res.sendStatus(200)) //options method to send the route resources and capabilities, for cors
.get(cors.cors, authenticate.verifyUser, async (req, res, next)=>{

    //typecasting string to mongoose object id
    const startingId = mongoose.Types.ObjectId(req.params.startingId);

    //retrieving id from request parameters and parse it to a number
    const limit = parseInt(req.params.limit);

    //try catch block to catch and handle any possible error
    try {

        //getting all the user ids that the current user is following along with his user id
        const authorIds = req.user.following.concat(req.user._id);
        
        //finding quotes authored by any of the users followed by the current user, newest first, created after a certain id
        let quotes = await Quote.find({ '_id' : {$lt : startingId}, 'author' : { $in : authorIds }}).sort({'_id' : -1}).populate('author').limit(limit);

        //wrap the quotes into json objects of required formatting
        quotes = quotes.map( (quote) => response.wrapQuote(quote, req.user) );

        //responding with quotes with success status
        return res.status(200).json(quotes);

    } catch (error) { //catch any error
        
        //pass the error to next method (error handler)
        return next(error);
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //post method, not supported

    //create error
    const error = new Error(`POST method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass error to next method (error handler)
    return next(error);

})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //put method, not supported

    //create error
    const error = new Error(`PUT method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass error to next method (error handler)
    return next(error);

})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //delete method, not supported

    //create error
    const error = new Error(`DELETE method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass error to next method (error handler)
    return next(error);

});

/*creating a route for users with special parameter limit to get the desired number of quotes*/
router.route('/users/:limit')
.options(cors.corsWithOptions, ( req, res)=> res.sendStatus(200)) //options method to send the route resources and capabilities, for cors
.get(cors.cors, authenticate.verifyUser, async (req, res, next)=>{ //get metho to get the desired number of users

    //retrieving limit from request paramters and parse it to a number
    const limit = parseInt(req.params.limit);

    //try catch block to catch and handle any possible errors
    try {
        
        //fetching users with a limit
        let users = await User.find().limit(limit);


        //wrapping users into a json object of desired formatting
        users = users.map( (user) => response.wrapUser(user, req.user) );

        //responding with users with success status
        return res.status(200).json(users);

    } catch (error) { //catch any error
        
        //pass the error to next method (error handler)
        return next(error);
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //post method, not supported

    //create error
    const error = new Error(`POST method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass error to next method (error handler)
    return next(error);

})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //put method, not supported

    //create error
    const error = new Error(`PUT method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass error to next method (error handler)
    return next(error);

})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //delete method, not supported

    //create error
    const error = new Error(`DELETE method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass error to next method (error handler)
    return next(error);

});

router.route('/users/:startingId/:limit')
.options(cors.corsWithOptions, ( req, res)=> res.sendStatus(200)) //options method to send the route resources and capabilities, for cors
.get(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{ //get method to fetch desired number of users after a specific id

    //typecasting string to mongoose object id
    const startingId = mongoose.Types.ObjectId(req.params.startingId);

    //retrieving limit from request paramters and parse it to number
    const limit = parseInt(req.params.limit);

    //try catch block to catch and handle any possible errors
    try {
        
        //find users created after a specific id with a limit
        let users = await User.find({_id : {$gt : startingId}}).limit(limit);

        //wrap all the users into json objects of required formatting
        users = users.map( (user) => response.wrapUser(user, req.user) );

        //respond with users with success status
        return res.status(200).json(users);

    } catch (error) { //catch any errors
        
        //pass the error to next method (error handler)
        return next(error);
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //post method, not supported

    //create error
    const error = new Error(`POST method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass error to next method (error handler)
    return next(error);

})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //put method, not supported

    //create error
    const error = new Error(`PUT method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass error to next method (error handler)
    return next(error);

})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //delete method, not supported

    //create error
    const error = new Error(`DELETE method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass error to next method (error handler)
    return next(error);

});

//exporting router
module.exports = router;