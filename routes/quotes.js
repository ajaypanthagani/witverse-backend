/*
*
    this file contains all the routes related to quotes resource
*
*/

/*importing required modules*/
const express = require('express');
const cors = require('./cors');
const authenticate = require('../authenticate');
const response = require('../response');

/*importing required db models*/
const Quote = require('../models/quotes');

/*creating a express router instance*/
const router = express.Router();

/*creating a route for quotes resource*/
router.route('/')
.options(cors.corsWithOptions, (req, res)=> res.sendStatus(200)) //options method to send the route resources and capabilities, for cors
.get(cors.cors, authenticate.verifyUser, async (req, res, next)=>{ //get method to fetch all the quotes

    //try catch block to catch and handle any possible errors
    try {

        //creating a variable to store query parameters
        const queryParams = req.query;

        //find quotes based on query params and populate author
        let quotes = await Quote.find(queryParams).populate('author');

        //wrap the quotes in json object of required formatting
        quotes = quotes.map( (quote) => response.wrapQuote(quote, req.user) );

        //respond with quotes with success status
        return res.status(200).json(quotes);
        
    } catch (error) { //catch any error
        
        //pass the error to next method (error handler)
        return next(error);
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{ //post method to create a quote

    //try catch block to catch and handle any possible errors
    try {
        
        //if quote text is not null in request body
        if(req.body.text){

            //retrieving quote data from request body
            const quoteData = req.body;

            //adding an author field to quote data
            quoteData.author = req.user._id;

            //create a new quote
            const newQuote = new Quote(quoteData);

            //saving the quote to database
            const quote = await newQuote.save();

            //populating author of saved quote
            await quote.populate('author').execPopulate();

            //wrap the quote into a json object of required formatting
            const createdQuote = response.wrapQuote(quote, req.user);

            //responding with the newly created quote with success status
            return res.status(200).json(createdQuote);
        }
        else{ //if quote text is missing from request body
            
            //create error
            const error = new Error('quote text is missing');
            error.status = 400;
            
            //pass the error to next method (error handler)
            return next(error);
        }

    } catch (error) { //catch any error
        
        //pass the error to next method (error handler)
        return next(error);

    }
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //put method, not supported

    const error = new Error(`PUT method is not supported on ${req.originalUrl}`);
    error.status = 400;
    next(error);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next)=>{ //delete method to delete all the quotes, authorized only to admin

    //try catch block to catch and handle any possible errors
    try {

        //deleting all the quotes
        const op = await Quote.deleteMany({});

        //responding with operation message
        return res.status(200).json(op);

    } catch (error) { //catch any error
        
        //pass the error to next method (error handler)
        return next(error);
    }


});


router.route('/:id')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200)) //options method to send the route resources and capabilities, for cors
.get(cors.cors, authenticate.verifyUser, async (req, res, next)=>{ //get method to fetch a single quote

    //retrieving quote id from request parameters
    const id = req.params.id;

    //try catch block to catch and handle any possible error
    try {
        
        //find quote with given id and populate author
        let quote = await Quote.findById(id).populate('author');

        //if quote is not null
        if(quote){

            //wrap the quote into a json object of required formatting
            quote = response.wrapQuote(quote, req.user);

            //respond with quote with success status
            res.status(200).json(quote);
        }
        else{ //if quote is null

            //create error
            const error = new Error(`quote with id ${id} doesn't exist`);
            error.status = 404;

            //pass the error to next method (error handler)
            return next(error);
        }

    } catch (error) { //catch any error
        
        //pass the error to next method (error handler)
        return next(error);
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{ //post method, not supported

    //create error
    const error = new Error(`POST method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass the error to next method (error handler)
    return next(error);
})
.put(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{ //put method to update a quote

    //retrieve quote id from request parameter
    const id = req.params.id;

    //try catch block to catch and hanlde any possible error
    try {
        
        //find quote with given id and populate author
        const quote = await Quote.findById(id).populate('author');

        //if the user id of current user and author is the same, allow
        if(quote.author.equals(req.user._id)){

            //retrieve quote data from request body
            const quoteData = req.body;

            //updating all the fields that are sent
            quote.text = quoteData.text ? quoteData.text : quote.text;
            quote.tags = quoteData.tags ? quoteData.tags : quote.tags;
            quote.emotion = quoteData.emotion ? quoteData.emotion : quote.emotion;

            //saving the quote
            let updatedQuote = await quote.save();

            //wrapping the updated quote in json object of required formatting
            updatedQuote = response.wrapQuote(updatedQuote, req.user);

            //respondin with updated quote with success message
            return res.status(200).json(updatedQuote);

        }
        else{ //if author is not the current user dont allow

            //create error
            const error = new Error('you are not authorized to do that');
            error.status = 403;

            //pass the error to next method (error handler)
            return next(error);
        }
    } catch (error) { //catch any error
        
        //pass the error to next method (error handler)
        return next(error);
    }
})
.delete(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{ //delete method to delete a specific quote


    //retrieving quote id from req parameters
    const id = req.params.id;

    //try catch block to catch and handle any possible errors
    try {

        //find quote by id
        const quote = await Quote.findById(id);

        //see if the author is same as the requesting user
        if( quote.author.equals(req.user._id)){

            //delete the quote
            const op = await Quote.findByIdAndDelete(id);
            
            return res.status(200).send(op);
        }
        else{ //if author and current user not same

            //create error
            const error = new Error('you are not authorized to do that');
            error.status = 403;

            //pass the error to next method
            return next(error);
        }
    } catch (error) { //catch any error
        
        //pass the error to next method
        return next(error);
    }
});


/*creating route to fetch quotes by a specific author*/
router.route('/by/:userId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200)) //options method to send the route resources and capabilities, for cors
.get(cors.cors, authenticate.verifyUser, async (req, res, next) => { //get method to get quotes by specific author

    //try catch block to catch and handle any possible errors
    try{

        //retrieving user id from request parameters
        const userId = req.params.userId;

        //find quote with author with given id and populate author
        const quotes = await Quote.find({'author' : userId}).populate('author');

        //wrap the quote into a json object with required formatting
        const wrapped = quotes.map((quote) => response.wrapQuote(quote, req.user));

        //respond with wrapped quote with success status
        res.status(200).json(wrapped);
    }
    catch(error){ //catch any error

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

/*exporting router*/
module.exports = router;