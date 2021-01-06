/*
*
    this file contains routes related to search funtionality
*
*/

/* importing required modules*/
const express = require('express');
const cors = require('./cors');
const authenticate = require('../authenticate');
const response = require('../response');

/*importing db models*/
const Quote = require('../models/quotes');
const User = require('../models/users');

/*creating express router instance*/
const router = express.Router();

/*creating route to search in quotes resource*/
router.route('/quotes')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200)) //options method to send the route resources and capabilities, for cors
.get(cors.cors, authenticate.verifyUser, async (req, res, next) => { //get method to search for a specific quote based on text fields


    //tryc catch block to catch and handle any possible errors
    try {

        //retrieving search query if any or taking an empty string
        const searchFor = req.query.searchFor || '';

        //fetching all the quotes that have the related query in their text fields
        let results = await Quote.find({$text : { $search : searchFor }}).populate('author');

        //wrapping the quotes into a json objec of required formatting
        results = results.map( (result) => response.wrapQuote(result, req.user) );
        
        //respondign with results with success status
        res.status(200).json(results);

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

/*creating route to search in quotes resource*/
router.route('/users')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200)) //options method to send the route resources and capabilities, for cors
.get(cors.cors, authenticate.verifyUser, async (req, res, next) => { //get method to search for specific quotes based on text fields

    //try catch block to catch handle any possible errors
    try {

        //retrieving search query if any or taking an empty string
        const searchFor = req.query.searchFor || '';
    
        //fetching results based on related query
        let results = await User.find({ $or : [{ username : { $regex : searchFor } }, { firstname : { $regex : searchFor } }, { lastname : { $regex : searchFor } }] });

        //wrapping the results in a json object with required formatting
        results = results.map( (result) => response.wrapUser(result, req.user) );
        
        //responding with result with success status
        res.status(200).json(results);
        
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


module.exports = router;