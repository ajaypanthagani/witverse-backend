const express = require('express');
const router = express.Router();
const cors = require('./cors');
const authenticate = require('../authenticate');
const response = require('../response');

const User = require('../models/users');
const Quote = require('../models/quotes');


router.route('/like/quote/:id')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, async (req, res, next) => {

    const id = req.params.id;

    try {
        const quote = await Quote.findById(id).populate('likes');

        if(quote){

            const likes = quote.likes.map((like) => response.wrapUser(like, req.user));

            res.status(200).json(likes);
        }
        else{
            
            const error = new Error(`quote with id ${id} doesn't exist`);
            error.status = 404;
            return next(error);
        }

    } catch (error) {
        
        return next(error);
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{

    const id = req.params.id;

    try {
        const quote = await Quote.findById(id).populate('author');
        if(quote){

            const likedQuote = await quote.like(req.user._id);

            res.status(200).json(response.wrapQuote(likedQuote, req.user));
        }
        else{

            const error = new Error(`quote with id ${id} doesn't exist`);
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
    return next(error);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{

    const id = req.params.id;

    try {
        const quote = await Quote.findById(id).populate('author');
        if(quote){

            const unLikedQuote = await quote.unlike(req.user._id);

            res.status(200).json(response.wrapQuote(unLikedQuote, req.user));
        }
        else{

            const error = new Error(`quote with id ${id} doesn't exist`);
            error.status = 404;
            return next(error);
        }
    } catch (error) {

        return next(error);

    }
})

router.route('/like/quote/:quoteId/comment/:commentId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, async (req, res, next) => {

    const quoteId = req.params.quoteId;
    const commentId = req.params.commentId;

    try {
        const quote = await Quote.findById(quoteId).populate('comments.likes');

        if(quote){

            const comment = quote.comments.find((comment) => comment._id.toString() === commentId)

            if(comment){

                const likes = comment.likes;

                return res.status(200).json(likes);
            }
            else{
                
                const error = new Error(`quote with id ${quoteId} doesn't exist`);
                error.status = 404;
                return next(error);

            }
        }
        else{
            
            const error = new Error(`quote with id ${commentId} doesn't exist`);
            error.status = 404;
            return next(error);
        }

    } catch (error) {
        
        return next(error);
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{

    const quoteId = req.params.quoteId;
    const commentId = req.params.commentId;

    try {
        const quote = await Quote.findById(quoteId).populate('comments.author');
        if(quote){

            const comment = quote.comments.find((comment) => comment._id.toString() === commentId)

            if(comment){

                await comment.like(req.user, quote);

                const likedComment = quote.comments.find((comment) => comment._id.toString() === commentId);

                return res.status(200).json(response.wrapComment(likedComment, req.user));
            }
            else{
                
                const error = new Error(`comment with id ${commentId} doesn't exist`);
                error.status = 404;
                return next(error);
                
            }
        }
        else{

            const error = new Error(`quote with id ${quoteId} doesn't exist`);
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
    return next(error);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{

    const quoteId = req.params.quoteId;
    const commentId = req.params.commentId;

    try {
        const quote = await Quote.findById(quoteId);
        if(quote){

            const comment = quote.comments.find((comment) => comment._id.toString() === commentId)

            if(comment){

                await comment.unlike(req.user, quote);

                const unLikedComment = quote.comments.find((comment) => comment._id.toString() === commentId);

                return res.status(200).json(response.wrapComment(unLikedComment, req.user));
            }
            else{
                
                const error = new Error(`quote with id ${quoteId} doesn't exist`);
                error.status = 404;
                return next(error);
                
            }
        }
        else{

            const error = new Error(`quote with id ${commentId} doesn't exist`);
            error.status = 404;
            return next(error);
        }
    } catch (error) {

        return next(error);

    }
})


router.route('/save/quotes')
.options(cors.corsWithOptions, (req, res)=>res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, async (req, res, next)=>{

    const user = req.user;

    try {

        const saved = await (user.populate('saved')).saved;
        return res.status(200).json(saved);

    } catch (error) {
        return next(error);
    }

})
.post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{
    
    const user = req.user;
    const quoteId = req.body.quoteId;

    try {
        
        await user.saveQuote(quoteId);

        const savedQuote = await Quote.findById(quoteId).populate('author');

        return res.status(200).json(response.wrapQuote(savedQuote, req.user));

    } catch (error) {
        
        return next(error);
    }
})
.put(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{

    const error = new Error(`PUT method is not supported on ${req.originalUrl}`);
    error.status = 400;
    return next(error);

})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next)=>{

    const user = req.user;

    try {
        
        user.saved = [];
        const unsaved = await user.save();
        return res.status(200).json(unsaved);

    } catch (error) {
        
        return next(error);
    }
});

router.route('/save/quotes/:quoteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, async (req, res, next)=>{

    const error = new Error(`GET method is not supported on ${req.originalUrl}`);
    error.status = 400;
    return next(error);

})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{

    const error = new Error(`POST method is not supported on ${req.originalUrl}`);
    error.status = 400;
    return next(error);

})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{

    const error = new Error(`PUT method is not supported on ${req.originalUrl}`);
    error.status = 400;
    return next(error);

})
.delete(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{

    const user = req.user;
    const quoteId = req.params.quoteId;

    try {
        
        await user.unsaveQuote(quoteId);

        const unsavedQuote = await Quote.findById(quoteId);



        return res.status(200).json(response.wrapQuote(unsavedQuote, req.user));

    } catch (error) {
        
        return next(error);
    }
})


router.route('/saved/by/:userId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.cors, authenticate.verifyUser, async (req, res, next) => {

    try{

        const user = await (User.findById(req.params.userId)).populate('saved');

        await user.populate('saved.author').execPopulate();

        const saved = user.saved.map( (quote) => response.wrapQuote(quote, req.user) );

        res.status(200).json(saved);
    }
    catch(error){

        next(error);
    }
})
module.exports = router;