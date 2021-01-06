/*
    this file contains routes accessible for unauthenticated users
*/

/*import required modules*/
const express = require('express');
const cors = require('./cors');

/*import required db models*/
const Quote = require('../models/quotes');

/*creating a express router instance*/
const router = express.Router();

/*creating router for quotes resource*/
router.route('/quotes')
.options(cors.corsWithOptions, (req, res)=>res.sendStatus(200)) //options method to send the route resources and capabilities, for cors
.get(cors.cors, async (req, res, next)=>{ //get method to fetch quotes for unauthenticated user

    try {
        
        //fetch 10 quotes, limited for unauthenticate user
        const quotes = await Quote.find({}).populate('author').limit(10);

        // quotes.push({"this is to test CI/CD" : "success"});
        
        //respond with the quotes with success status
        return res.status(200).json(quotes);

    } catch (error) { //catch any error
        
        //pass the error to next method (error handler)
        return next(error);
    }
})
.post(cors.corsWithOptions, (req, res, next)=>{ //post method, not supported

    //create error
    const error = new Error(`POST method is not supported on ${req.originalUrl}`);

    error.status = 400;

    //pass the error to next method
    return next(error);
})
.put(cors.corsWithOptions, (req, res, next)=>{ //put method, not supported
    
    //create error
    const error = new Error(`POST method is not supported on ${req.originalUrl}`);

    error.status = 400;

    //pass the error to next method
    return next(error);
})
.delete(cors.corsWithOptions, (req, res, next)=>{ //delete method, not supported

    //create error
    const error = new Error(`POST method is not supported on ${req.originalUrl}`);

    error.status = 400;

    //pass the error to next method
    return next(error);
});


/*export router*/
module.exports = router;