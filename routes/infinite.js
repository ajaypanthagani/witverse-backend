const express = require('express')
const router =  express.Router();
const mongoose = require('mongoose');

const authenticate = require('../authenticate');
const cors = require('./cors');
const response = require('../response');

//models
const Quote = require('../models/quotes');
const User = require('../models/users');

router.route('/quotes/:limit')
.options(cors.corsWithOptions, ( req, res)=> res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, async (req, res, next)=>{

    const limit = parseInt(req.params.limit);

    try {

        console.log(typeof req.user._id);

        const authorIds = req.user.following.concat(req.user._id);

        console.log(authorIds);

        let quotes = await Quote.find({ 'author' : { $in : authorIds } }).sort({'_id' : -1}).populate('author').limit(limit);

        quotes = quotes.map( (quote) => response.wrapQuote(quote, req.user) );

        return res.status(200).json(quotes);

    } catch (error) {
        
        return next(error);
    }
});

router.route('/quotes/:startingId/:limit')
.options(cors.corsWithOptions, ( req, res)=> res.sendStatus(200))
.get(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{

    console.log(req.params.limit);
    console.log(req.params.startingId);

    //typecasting string to mongoose object id
    const startingId = mongoose.Types.ObjectId(req.params.startingId);

    const limit = parseInt(req.params.limit);

    try {

        const authorIds = req.user.following.concat(req.user._id);
        
        let quotes = await Quote.find({ '_id' : {$lt : startingId}, 'author' : { $in : authorIds }}).sort({'_id' : -1}).populate('author').limit(limit);

        quotes = quotes.map( (quote) => response.wrapQuote(quote, req.user) );

        return res.status(200).json(quotes);

    } catch (error) {
        
        return next(error);
    }
});

router.route('/users/:limit')
.options(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{

    const limit = parseInt(req.params.limit);

    try {
        
        let users = await User.find().limit(limit);

        users = users.map( (user) => response.wrapUser(user, req.user) );

        return res.status(200).json(users);

    } catch (error) {
        
        return next(error);
    }
});

router.route('/users/:startingId/:limit')
.options(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{

    //typecasting string to mongoose object id
    const startingId = mongoose.Types.ObjectId(req.params.startingId);

    const limit = parseInt(req.params.limit);

    try {
        
        let users = await User.find({_id : {$gt : startingId}}).limit(limit);

        users = users.map( (user) => response.wrapUser(user, req.user) );

        return res.status(200).json(users);

    } catch (error) {
        
        return next(error);
    }
});


module.exports = router;