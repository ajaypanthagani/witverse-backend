/*
    this file contains all the routes for actions such as:

    --> like (quote, comment)
    --> unlike (quote, comment)
    --> save quotes
    --> unsave quotes
*/


/*importing all the required modules*/
const express = require('express');
const cors = require('./cors');
const authenticate = require('../authenticate');
const response = require('../response');

/*importing required models*/
const User = require('../models/users');
const Quote = require('../models/quotes');

/*creating an express router instance*/ 
const router = express.Router();

/*creating a router for like resource of a quote*/
router.route('/like/quote/:id')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200)) //options method to send the route resources and capabilities, for cors
.get(cors.cors, authenticate.verifyUser, async (req, res, next) => { //get method to fetch all the likes of a quote with given id

    //retrieving quote id for the paramaters
    const id = req.params.id;

    //try catch block to catch and handle any errors
    try {

        //find the quote with the given id and populate the likes array
        const quote = await Quote.findById(id).populate('likes');

        //if quote exists, i.e. quote is not null
        if(quote){

            //wrapping all the likes into required format of json objects
            const likes = quote.likes.map((like) => response.wrapUser(like, req.user));

            //respond with all the likes with success status
            res.status(200).json(likes);
        }
        else{ //if the quote is null
            
            //create a new error
            const error = new Error(`quote with id ${id} doesn't exist`);
            error.status = 404;

            //pass it to the next method (error handler)
            return next(error);
        }

    } catch (error) { //catching any errors
        
        //passing to the next method (error handler)
        return next(error);
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{ //post method to create a like resource in a quote (liking a quote)

    //retrieving quote id from paramaters
    const id = req.params.id;

    //try catch block to catch and handle any possible errors
    try {

        //find the quote with given id and populate author
        const quote = await Quote.findById(id).populate('author');

        //if quote is not null
        if(quote){

            //calling the like function with requesting user id
            const likedQuote = await quote.like(req.user._id);

            //responding with updated quote in the form of json object with required formatting
            res.status(200).json(response.wrapQuote(likedQuote, req.user));
        }
        else{ //if the quote is null

            //create a new error
            const error = new Error(`quote with id ${id} doesn't exist`);
            error.status = 404;

            //passing it to the next method (error handler)
            return next(error);
        }
    } catch (error) { //catch any possible errors

        //pass it to the next method (error handlers)
        return next(error);

    }

})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{ //update the like resource, not supported action

    //create a new error
    const error = new Error(`PUT method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass it to the next method (error handler)
    return next(error);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{ //deleting like resource from a quote, unlike a quote

    //retrieving quote id from the parameters
    const id = req.params.id;

    //try catch block to handle any errors
    try {

        // find quote with given id and populate author
        const quote = await Quote.findById(id).populate('author');

        // if quote is not null
        if(quote){

            // calling unlike function on the fetched quote
            const unLikedQuote = await quote.unlike(req.user._id);

            //return updated quote in the form of json object with required formatting
            res.status(200).json(response.wrapQuote(unLikedQuote, req.user));
        }
        else{ //if the quote is null


            //create a new error
            const error = new Error(`quote with id ${id} doesn't exist`);
            error.status = 404;

            //pass error to next function (error handler)
            return next(error);
        }
    } catch (error) { //catch any possible errors

        //pass error to next function (error handler)
        return next(error);

    }
})


/*creating a route for like resource of a comment on a quote*/
router.route('/like/quote/:quoteId/comment/:commentId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200)) //options method to send the route resources and capabilities, for cors
.get(cors.cors, authenticate.verifyUser, async (req, res, next) => { //get method to fetch all the likes of a comment with given id on a quote with given id

    //retrieving quote id and comment id from parameters
    const quoteId = req.params.quoteId;
    const commentId = req.params.commentId;

    //try catch block to catch and handle any possible errors
    try {

        //find quote with given id and populate like of the comments
        const quote = await Quote.findById(quoteId).populate('comments.likes');

        //if the quote is not null
        if(quote){

            //find the required comment from the comments array on the quote object
            const comment = quote.comments.find((comment) => comment._id.toString() === commentId);

            //if comment is not null
            if(comment){

                //storing likes on the comment into like variable
                const likes = comment.likes;

                //returning likes on the comment with given id on quote with given quote with success status
                return res.status(200).json(likes);
            }
            else{ //if comment is null
                
                //creat a new error
                const error = new Error(`quote with id ${quoteId} doesn't exist`);
                error.status = 404;

                //pass it to the next method (error handler)
                return next(error);

            }
        }
        else{ //if quote is null
            
            //create a new error
            const error = new Error(`quote with id ${commentId} doesn't exist`);
            error.status = 404;

            //pass it to the next method (error handler)
            return next(error);
        }

    } catch (error) { //catch any possible errors
        
        //pass it to the next method (error handler)
        return next(error);
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{ //creating a like resource on the comment with given id, liking a comment

    //retrieving quote id and comment id from the parameters
    const quoteId = req.params.quoteId;
    const commentId = req.params.commentId;

    //try cathc block to catch and handles any possible errors
    try {

        //find quote with given id and populate comments authors
        const quote = await Quote.findById(quoteId).populate('comments.author');

        //if quote is not null
        if(quote){

            //find required comment from the comments on the quote
            const comment = quote.comments.find((comment) => comment._id.toString() === commentId)

            //if the comment is not null
            if(comment){

                //calling like the function on the comment object
                await comment.like(req.user, quote);

                //finding the liked comment from the comments array on the quotes object
                const likedComment = quote.comments.find((comment) => comment._id.toString() === commentId);

                //returning the liked comment with the required formatting as a json object
                return res.status(200).json(response.wrapComment(likedComment, req.user));
            }
            else{ //if the comment is null
                
                //create an error
                const error = new Error(`comment with id ${commentId} doesn't exist`);
                error.status = 404;

                //passing the error to the next method (error handler)
                return next(error);
                
            }
        }
        else{ //if the quote is null

            //create an error
            const error = new Error(`quote with id ${quoteId} doesn't exist`);
            error.status = 404;

            //passing the error to the next method (error handler)
            return next(error);
        }
    } catch (error) { //catch any possible error

        //passing the error to the next method (error handler)
        return next(error);

    }

})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{ //updating the like resource on a commnent, not supported

    //create an error
    const error = new Error(`PUT method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //passing the error to the next method (error handler)
    return next(error);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{ //deleting the like resource from the comment, unlike comment

    //retrieving quote id and comment id from parameters
    const quoteId = req.params.quoteId;
    const commentId = req.params.commentId;

    //try catch block to catch and handle any possible errors
    try {

        //find quote with given id
        const quote = await Quote.findById(quoteId);

        //if quote is not null
        if(quote){

            //find the comment with given id from comments array
            const comment = quote.comments.find((comment) => comment._id.toString() === commentId)

            //if comment is not null
            if(comment){

                //calling the unlike function on the comment object
                await comment.unlike(req.user, quote);

                //finding the updated comment on the quote object
                const unLikedComment = quote.comments.find((comment) => comment._id.toString() === commentId);

                //returning the updated comment with success status
                return res.status(200).json(response.wrapComment(unLikedComment, req.user));
            }
            else{ //if comment is null
                
                //create a new error
                const error = new Error(`comment with id ${commentId} doesn't exist`);
                error.status = 404;

                //pass the error to the next method (error handler)
                return next(error);
                
            }
        }
        else{ //if quote is null

            //create a new error
            const error = new Error(`quote with id ${quoteId} doesn't exist`);
            error.status = 404;

            //pass the error to the next method (error handler)
            return next(error);
        }
    } catch (error) { //catch any possible errors

        //pass the error to the nest method (error handler)
        return next(error);

    }
})

/*route for save feature of the quotes*/
router.route('/save/quotes')
.options(cors.corsWithOptions, (req, res)=>res.sendStatus(200)) //options method to send the route resources and capabilities, for cors
.get(cors.cors, authenticate.verifyUser, async (req, res, next)=>{ //get method to fetch all the saved quotes of the current user

    //retrieving current authenticated user, user object is attatched to req object by passport's verifyUser
    const user = req.user;

    //try catch block to catch and handle any possible errors
    try {

        //populating saved quotes on the user object and storing them in 'saved' variable
        const saved = await (user.populate('saved')).saved;

        //returning saved quotes with success status
        return res.status(200).json(saved);

    } catch (error) { //catch any error

        //passing the error to the next method (error handler)
        return next(error);
    }

})
.post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{ //post method to create the saved quote resource on the user object, save quotes function
    
    //retrieving current authenticated user from req obj, user is attatched to req object by passports verifyUser function
    const user = req.user;

    //retrieving the quoteId from the form data sent from the client
    const quoteId = req.body.quoteId;

    //try catch block to catch and handle any possible errors
    try {
        
        //calling the saveQuote method on the user object with the quoteId to be saved
        await user.saveQuote(quoteId);

        //finding the saved quote from the db and populating the author
        const savedQuote = await Quote.findById(quoteId).populate('author');

        //responding with the updated quote information with success status
        return res.status(200).json(response.wrapQuote(savedQuote, req.user));

    } catch (error) { //catch any error
        
        //pass the error to the next method (error handler)
        return next(error);
    }
})
.put(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{ //updating the saved resource, not supported

    //creating a new error
    const error = new Error(`PUT method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //passing the error to the next method (error handler)
    return next(error);

})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next)=>{ //deleting the saved resource on the user object, unsave the quote

    //retrieving the authenticate user from the req object, user object is attatched to req object by passports verifyUser method
    const user = req.user;

    //try catch block to catch and handle any possible errors
    try {
        
        //emptying the saved array on the user object
        user.saved = [];

        //saving the updated user
        const unsaved = await user.save();

        //responding with the updated user with success status
        return res.status(200).json(unsaved);

    } catch (error) {
        
        return next(error);
    }
});


/* route for saving the quote with single resource*/
router.route('/save/quotes/:quoteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200)) //options method to send the route resources and capabilities, for cors
.get(cors.cors, authenticate.verifyUser, async (req, res, next)=>{ //get method to fetch the single saved resource, not supported

    //create an error
    const error = new Error(`GET method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass the error to the next method (error handler)
    return next(error);

})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{//post method, unsupported

    //create error
    const error = new Error(`POST method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass the error to the next method (error handler)
    return next(error);

})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{//put method, unsupported

    //create error
    const error = new Error(`PUT method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass the error to the nest method (error handler)
    return next(error);

})
.delete(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{//delete method to delete the saved resource with given id, unsave quote


    //retrieving user from the req object
    const user = req.user;

    //retrieving quote id from parameters
    const quoteId = req.params.quoteId;

    //try catch block to catch and handle any possible errors
    try {
       
        //calling unsave quote method on user object with quote id
        await user.unsaveQuote(quoteId);

        //finding the updated quote
        const unsavedQuote = await Quote.findById(quoteId);

        //resonding with the update quote
        return res.status(200).json(response.wrapQuote(unsavedQuote, req.user));

    } catch (error) {//catch any error
        
        //pass the error to the next method (error handler)
        return next(error);
    }
})

/*route to fetch saved quotes of a user based on the given id*/
router.route('/saved/by/:userId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) }) //options method to send the route resources and capabilities, for cors
.get(cors.cors, authenticate.verifyUser, async (req, res, next) => { //get method to fetch the saved quotes of a given user id

    //try catch block to catch and handle any possible errors
    try{

        //find user by id and populate saved field
        const user = await (User.findById(req.params.userId)).populate('saved');

        //populate authors of saved quotes
        await user.populate('saved.author').execPopulate();

        //wrap all the quotes according to the formatting standard
        const saved = user.saved.map( (quote) => response.wrapQuote(quote, req.user) );

        //respong with the saved quotes with success status
        res.status(200).json(saved);
    }
    catch(error){//catch any error

        //pass the error to the next method (error handler)
        return next(error);
    }
})

//export the router
module.exports = router;