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
        const quote = await Quote.findById(id).populate('comments.likes');

        if(quote){

            const likes = quote.likes;

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
        const quote = await Quote.findById(id);
        if(quote){

            await quote.like(req.user._id);

            res.status(200).json({success : true, message : 'liked succesfully'});
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
        const quote = await Quote.findById(id);
        if(quote){

            await quote.unlike(req.user._id);

            res.status(200).json({success : true, message : 'unliked succesfully'});
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
        const quote = await Quote.findById(quoteId);
        if(quote){

            const comment = quote.comments.find((comment) => comment._id.toString() === commentId)

            if(comment){

                await comment.like(req.user, quote);

                return res.status(200).json({success : true, message : 'comment liked successfully'});
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

                return res.status(200).json({success: true, message : 'comment unliked successfully!'});
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
        
        const saved = await user.saveQuote(quoteId);

        return res.status(200).json({success : true, message: 'saved successfully'});

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
        await user.save();
        return res.status(200).json({success : true, message : 'deleted successfully'});

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

        return res.status(200).json({success : true, message : 'deleted successfully'});

    } catch (error) {
        
        return next(error);
    }
})

module.exports = router;