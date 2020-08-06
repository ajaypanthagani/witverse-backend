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

    const error = new Error(`POST method is not supported on ${req.originalUrl}`);
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

module.exports = router;