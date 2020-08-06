const express = require('express');
const router = express.Router();
const cors = require('./cors');
const authenticate = require('../authenticate');

const Quote = require('../models/quotes');
const response = require('../response');



router.route('/')
.options(cors.corsWithOptions, (req, res)=> res.sendStatus(200) )
.get(cors.cors, authenticate.verifyUser, async (req, res, next)=>{

    try {

        let quotes = await Quote.find({});

        quotes = quotes.map( (quote) => response.wrapQuote(quote, req.user) );

        return res.status(200).json(quotes);
        
    } catch (error) {
        
        return next(error);
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{

    try {
        
        if(req.body.text){

            const quoteData = req.body;
            quoteData.author = req.user._id;

            const newQuote = new Quote(quoteData);

            const quote = await newQuote.save();

            return res.status(200).json(quote);
        }
        else{

            const error = new Error('quote text is missing');
            error.status = 400;
            
            return next(error);
        }

    } catch (error) {
        
        return next(error);

    }
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

    const error = new Error(`PUT method is not supported on ${req.originalUrl}`);
    error.status = 400;
    next(error);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next)=>{

    try {

        const op = await Quote.deleteMany({});
        return res.status(200).json(op);

    } catch (error) {
        
        return next(error);
    }


});


router.route('/:id')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, async (req, res, next)=>{

    const id = req.params.id;

    try {
        
        let quote = await Quote.findById(id);

        quote = response.wrapQuote(quote, req.user);

        res.status(200).json(quote);

    } catch (error) {
        
        return next(error);
    }
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{

    const error = new Error(`POST method is not supported on ${req.originalUrl}`);
    error.status = 400;
    next(error);
})
.put(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{

    const id = req.params.id;

    try {
        
        const quote = await quote.findById(id);

        if(quote.author === req.user._id){

            const quoteData = req.body;
            quote.text = quoteData.text ? quoteData.text : quote.text;
            quote.tags = quoteData.tags ? quoteData.tags : quote.tags;
            quote.emotion = quoteData.emotion ? quoteData.emotion : quote.emotion;

            let updatedQuote = await quote.save();

            updatedQuote = response.wrapQuote(updatedQuote, req.user);

            return res.status(200).json(updatedQuote);

        }
        else{

            const error = new Error('you are not authorized to do that');
            error.status = 403;
            return next(error);
        }
    } catch (error) {
        
        return next(error);
    }
})
.delete(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{

    const id = req.params.id;

    try {

        const quote = await Quote.findById(id);

        if(quote.author === req.user._id){

            let deletedQuote = Quote.findByIdAndDelete(id);
            deletedQuote = response.wrapQuote(deletedQuote);

            return res.status(200).json(deletedQuote);
        }
        else{

            const error = new Error('you are not authorized to do that');
            error.status = 403;
            return next(error);
        }
    } catch (error) {
        
        return next(error);
    }
});

module.exports = router;