const express = require('express');
const router = express.Router();
const cors = require('./cors');

const Quote = require('../models/quotes');

router.route('/quotes')
.options(cors.corsWithOptions, (req, res)=>res.sendStatus(200))
.get(cors.cors, async (req, res, next)=>{

    try {
        
        const quotes = await Quote.find({}).populate('author').limit(10);
        
        return res.status(200).json(quotes);

    } catch (error) {
        
        return next(error);
    }
})
.post(cors.corsWithOptions, (req, res, next)=>{

    const error = new Error(`POST method is not supported on ${req.originalUrl}`);

    error.status = 400;

    return next(error);
})
.put(cors.corsWithOptions, (req, res, next)=>{
    
    const error = new Error(`POST method is not supported on ${req.originalUrl}`);

    error.status = 400;

    return next(error);
})
.delete(cors.corsWithOptions, (req, res, next)=>{

    const error = new Error(`POST method is not supported on ${req.originalUrl}`);

    error.status = 400;

    return next(error);
});


module.exports = router;