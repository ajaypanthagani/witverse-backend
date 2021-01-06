/*
    this file contains all the routes for 'comment' resouce
*/

/*importing all required modules*/
const express = require('express');
const cors = require('./cors');
const authenticate = require('../authenticate');
const response = require('../response');

/*importing all the required models*/
const Quote = require('../models/quotes');


/*creating a express router instance*/
const router = express.Router();

/*creating route for comments resource on a specific quote with given id*/
router.route('/:quoteId')
.options(cors.corsWithOptions, (req, res)=> res.sendStatus(200)) //options method to send the route resources and capabilities, for cors
.get(cors.cors, authenticate.verifyUser, async (req, res, next)=>{ //get method to fetch all the comments on a given quote

    //retrieving the quote id from the parameters
    const quoteId = req.params.quoteId;

    //try catch block to catch any possible errors
    try {
        
        //find quote with given id and populate comments author
        const quote = await (Quote.findById(quoteId).populate('comments.author'));


        //if quote is not null
        if(quote){

            //store quote comments in a seperate variable
            const comments = quote.comments;

            //wrapping all the comments into a json object with required formatting
            const wrappedComments = comments.map((comment) => response.wrapComment(comment, req.user));

            //respond with the comments with success status
            return res.status(200).json(wrappedComments);
        }
        else{ //if quote is null

            //create an error
            const error = new Error(`quote with id : ${quoteId} doesn't exist`);
            error.status = 404;

            //pass the error to next method (error handler)
            return next(error);

        }
    } catch (error) { //catch any error
        
        //pass the error to next method (errror handler)
        return next(error);
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{ //post method to create a comment on a post

    //retrieve quote id from parameters
    const quoteId = req.params.quoteId;

    //try catch block to catch and handle any possible errors
    try {
        
        //find quote with given id
        const quote = await Quote.findById(quoteId);

        //if quote is not null
        if(quote){

            //retrieving the received comment data from req body
            const commentData = req.body;

            //if comment text is not null
            if(commentData.text){

                //setting author with current authenticated id
                commentData.author = req.user._id;

                //pushing the newly created comment into the comments array in quote
                quote.comments.push(commentData);

                //saving the quote
                await quote.save();

                //populating the quote comments and comment authors
                const populatedQuote = await quote.populate({ 
                                 path: 'comments',
                                 populate: {
                                   path: 'author',
                                   model: 'User'
                                 } 
                              })
                              .execPopulate();
                
                //wrapping all the comments in a json object with required format
                const comments = populatedQuote.comments.map((comment) => response.wrapComment(comment, req.user));

                //responding with comments with success code
                res.status(200).json(comments);
            }
            else{ //if comment text is not provided in request body, comment is null

                //create error
                const error = new Error("comment is required");
                error.status = 400;

                //pass the error variable to next method (error handler)
                return next(error);
            }
        }
        else{ //if quote is null

            //create error
            const error = new Error(`quote with id : ${quoteId} doesn't exist`);
            error.status = 404;

            //passing the error to next method (error handler)
            return next(error);

        }
    } catch (error) { //catching any errors
        
        //passing the error to next method (error handler)
        return next(error);
    }
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{ //put method, not supported

    //create error
    const error = new Error(`PUT method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass the error to next method (error handler)
    return next(error);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next)=>{ //delete method to delete all comments on a post
    
    //retrieve quote id from parameters
    const quoteId = req.params.quoteId;

    //try catch block to catch and handle any possible errors
    try {
        
        //find quote with given id
        const quote = await Quote.findById(quoteId);

        //if quote is not null
        if(quote){

            //emtpy the comments array
            quote.comments = [];

            //update the quote
            const updatedQuote = await quote.save();

            //respond with updated quote with success status
            res.status(200).json(updatedQuote);

        }
        else{ //if quote is null

            //create error
            const error = new Error(`quote with id : ${quoteId} doesn't exist`);
            error.status = 404;

            //pass error to next method (error handler)
            return next(error);

        }
    } catch (error) { //catch any error
        
        //pass error to next method (error handler)
        return next(error);
    }
})

/*creating route for a single comment resource*/
router.route('/:quoteId/:commentId')
.options(cors.cors, (req, res) => res.sendStatus(200)) //options method to send the route resources and capabilities, for cors
.get(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{ //get method to fetch a comment with given comment id


    //retrieving quote id and comment id from request parameters
    const quoteId = req.params.quoteId;
    const commentId = req.params.commentId;

    //try catch block to catch and handle any possible error
    try {
        
        //find quote with given id and populate comments author
        const quote = await Quote.findById(quoteId).populate('comments.author');

        //if quote is not null
        if(quote){

            //find the required comment with given comment id
            const comment = quote.comments.find((comment) => comment._id.toString() === commentId);

            //if comment is not null
            if(comment){

                //wrap the comment into json object with required format
                const wrappedComment = response.wrapComment(comment, req.user);

                //respond with formatted commment with success status
                return res.status(200).json(wrappedComment);

            }
            else{ //if comment is null
                
                //create error
                const error = new Error(`comment with id : ${commentId} doesn't exist`);
                error.status = 404;

                //pass the error variable to next method (error handler)
                return next(error);

            }
        }
        else{ //if quote is null

            //create error
            const error = new Error(`quote with id : ${quoteId} doesn't exist`);
            error.status = 404;

            //pass the error to next method (error handler)
            return next(error);

        }
    } catch (error) { //catch any error
        
        //pass the error to next method (error handler)
        return next(error);

    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => { //post method, not supported

    //create error
    const error = new Error(`POST method is not supported on ${req.originalUrl}`);

    error.status = 400;

    //pass the error variable to next method (error handler)
    return next(error);

})
.put(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{ //put method to update a comment


    //retrieve quote id and comment id from request parameters
    const quoteId = req.params.quoteId;
    const commentId = req.params.commentId;

    //try catch block to catch and handle any possible errors
    try {
        
        //find quote with given id and populate comments author
        const quote = await Quote.findById(quoteId).populate('comments.author');

        //if quote is not null
        if(quote){

            //find comment with given comment id from comments array
            const comment = quote.comments.find((comment) => comment._id.toString() === commentId);


            //if comment is not null
            if(comment){

                //check if comment author is the same as user requesting to edit the comment
                if(req.user._id === comment.author){ //if user id and comment author are same then proceed

                    //update comment with given comment id in comments array with new comment text
                    quote.comments.id(commentId).text = req.body.text ? req.body.text : quote.comments.id(commentId).text;

                    //save quote
                    await quote.save();
                    
                    //wrap the updated comment into a json object with required formattting
                    const wrappedComment = response.wrapComment(quote.comments.id(commentId), req.user);
                    
                    //respond with updated comment with success status
                    return res.status(200).json(wrappedComment);
                }
                else{ //if author and user id are not same, do not let editing the comment
                    
                    //create an error
                    const error = new Error(`you are not authorized to do that`);
                    error.status = 403;

                    //pass the error to next method (error handler)
                    return next(error);
                }

            }
            else{ //if comment is null
                
                //create error
                const error = new Error(`comment with id : ${commentId} doesn't exist`);
                error.status = 404;

                //pass the error to next method (error handler)
                return next(error);

            }
        }
        else{ //if quote is null

            //create error
            const error = new Error(`quote with id : ${quoteId} doesn't exist`);
            error.status = 404;

            //pass the error to next method (error handler)
            return next(error);

        }
    } catch (error) { //catch any errors
        
        //pass the error to next method (error handler)
        return next(error);

    }
})
.delete(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{//delete method to delete comment on a quote

    //retrieve quote id and comment id from request parameters
    const quoteId = req.params.quoteId;
    const commentId = req.params.commentId;

    //try catch block to catch and handle any possible errors
    try {
        
        //find quote with given id and populate comments author
        const quote = await Quote.findById(quoteId).populate('comments.author');

        //if quote is not null
        if(quote){

            //find comment with given id from comments array on quote object
            const comment = quote.comments.find((comment) => comment._id.toString() === commentId);

            //if comment is not null
            if(comment){

                //checking if the comment author and requesting user is the same
                if( req.user._id.equals(comment.author._id) ){

                    //filtering out the comment to be deleted
                    quote.comments = quote.comments.filter( (comment) => comment._id.toString() !== commentId);

                    //saving quote
                    await quote.save();
                    
                    //replying with success message
                    res.status(200).json({success : true, message : 'comment deleted successfully'});

                }
                else{//if user id and author id don't match do not allow deleting

                    //create error
                    const error = new Error(`you are not authorized to do that`);
                    error.status = 403;

                    //pass the error variable to the next method
                    return next(error);
                    
                }
                
            }
            else{ //if comment is null
                
                //create an error
                const error = new Error(`comment with id : ${commentId} doesn't exist`);
                error.status = 404;

                //pass error to next method (error handler)
                return next(error);

            }
        }
        else{ //if quote is null


            //create an error
            const error = new Error(`quote with id : ${quoteId} doesn't exist`);
            error.status = 404;

            //pass error to next method (error handler)
            return next(error);

        }
    } catch (error) { //catch any error
        
        //pass error to next method (error handler)
        return next(error);

    }
})

//export router
module.exports = router;