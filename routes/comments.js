const express = require('express');
const router = express.Router();
const cors = require('./cors');
const authenticate = require('../authenticate');
const response = require('../response');

const Quote = require('../models/quotes');


router.route('/:quoteId')
.options(cors.corsWithOptions, (req, res)=> res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, async (req, res, next)=>{

    const quoteId = req.params.quoteId;

    try {
        
        const quote = await (Quote.findById(quoteId).populate('comments.author'));

        if(quote){

            const comments = quote.comments;

            const wrappedComments = comments.map((comment) => response.wrapComment(comment, req.user));

            return res.status(200).json(wrappedComments);
        }
        else{

            const error = new Error(`quote with id : ${quoteId} doesn't exist`);
            error.status = 404;
            return next(error);

        }
    } catch (error) {
        
        return next(error);
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{

    const quoteId = req.params.quoteId;

    try {
        
        const quote = await Quote.findById(quoteId);

        if(quote){

            const commentData = req.body;

            if(commentData.text){

                commentData.author = req.user._id;

                quote.comments.push(commentData);

                const updatedQuote = await quote.save();

                res.status(200).json(updatedQuote);
            }
        }
        else{

            const error = new Error(`quote with id : ${quoteId} doesn't exist`);
            error.status = 404;
            return next(error);

        }
    } catch (error) {
        
        return next(error);
    }
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{

    const error = new Error(`PUT method is not supported on ${req.originalUrl}`);

    error.status = 400;

    next(error);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next)=>{
    
    const quoteId = req.params.quoteId;

    try {
        
        const quote = await Quote.findById(quoteId);

        if(quote){

            quote.comments = [];

            const updatedQuote = await quote.save();

            res.status(200).json(updatedQuote);

        }
        else{

            const error = new Error(`quote with id : ${quoteId} doesn't exist`);
            error.status = 404;
            return next(error);

        }
    } catch (error) {
        
        return next(error);
    }
})

router.route('/:quoteId/:commentId')
.options(cors.cors, (req, res) => res.sendStatus(200))
.get(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{

    const quoteId = req.params.quoteId;
    const commentId = req.params.commentId;

    try {
        
        const quote = await Quote.findById(quoteId).populate('comments.author');

        if(quote){

            const comment = quote.comments.find((comment) => comment._id.toString() === commentId);

            if(comment){

                const wrappedComment = response.wrapComment(comment, req.user);

                return res.status(200).json(wrappedComment);

            }
            else{
                
                const error = new Error(`comment with id : ${commentId} doesn't exist`);
                error.status = 404;
                return next(error);

            }
        }
        else{

            const error = new Error(`quote with id : ${quoteId} doesn't exist`);
            error.status = 404;
            return next(error);

        }
    } catch (error) {
        
        return next(error);

    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {


    const error = new Error(`POST method is not supported on ${req.originalUrl}`);

    error.status = 400;

    next(error);

})
.put(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{

    const quoteId = req.params.quoteId;
    const commentId = req.params.commentId;

    try {
        
        const quote = await Quote.findById(quoteId).populate('comments.author');

        if(quote){

            const comment = quote.comments.find((comment) => comment._id.toString() === commentId);

            if(comment){

                if(req.user._id === comment.author){

                    quote.comments.id(commentId).text = req.body.text ? req.body.text : quote.comments.id(commentId).text;

                    await quote.save();
    
                    const wrappedComment = response.wrapComment(quote.comments.id(commentId), req.user);
    
                    return res.status(200).json(wrappedComment);
                }
                else{
                    
                    const error = new Error(`you are not authorized to do that`);
                    error.status = 403;
                    return next(error);
                }

            }
            else{
                
                const error = new Error(`comment with id : ${commentId} doesn't exist`);
                error.status = 404;
                return next(error);

            }
        }
        else{

            const error = new Error(`quote with id : ${quoteId} doesn't exist`);
            error.status = 404;
            return next(error);

        }
    } catch (error) {
        
        return next(error);

    }
})
.delete(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{

    const quoteId = req.params.quoteId;
    const commentId = req.params.commentId;

    try {
        
        const quote = await Quote.findById(quoteId).populate('comments.author');

        if(quote){

            const comment = quote.comments.find((comment) => comment._id.toString() === commentId);

            if(comment){

                if( req.user._id === comment.author ){

                    quote.comments = quote.comments.filter( (comment) => comment._id.toString() !== commentId);

                    await quote.save();
    
                    res.status(200).json({success : true, message : 'comment deleted successfully'});

                }
                else{

                    const error = new Error(`you are not authorized to do that`);
                    error.status = 403;
                    return next(error);
                    
                }
                
            }
            else{
                
                const error = new Error(`comment with id : ${commentId} doesn't exist`);
                error.status = 404;
                return next(error);

            }
        }
        else{

            const error = new Error(`quote with id : ${quoteId} doesn't exist`);
            error.status = 404;
            return next(error);

        }
    } catch (error) {
        
        return next(error);

    }
})

module.exports = router;