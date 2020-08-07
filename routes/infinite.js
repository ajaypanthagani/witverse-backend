const express = require('express')
const router =  express.Router();
const cors = require('./cors');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

//models
const Quote = require('../models/quotes');
const User = require('../models/users');

router.route('/quotes/:limit')
.options(cors.corsWithOptions, ( req, res)=> res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, async (req, res, next)=>{

    const limit = parseInt(req.params.limit);

    try {

        const quotes = await Quote.find({ 'author' : { $in : req.user.following } }).populate('author').limit(limit);

        return res.status(200).json(quotes);

    } catch (error) {
        
        return next(error);
    }
});

router.route('/quotes/:startingId/:limit')
.options(cors.corsWithOptions, ( req, res)=> res.sendStatus(200))
.get(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{

    //typecasting string to mongoose object id
    const startingId = mongoose.Types.ObjectId(req.params.startingId);

    const limit = parseInt(req.params.limit);

    try {
        
        const quotes = await Quote.find({ '_id' : {$gt : startingId}, 'author' : { $in : req.user.following } }).populate('author').limit(limit);

        return res.status(200).json(quotes);

    } catch (error) {
        
        return next(error);
    }
});

router.route('/users/:limit')
.options(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next)=>{

    const limit = parseInt(req.params.limit);

    try {
        
        const users = await User.find().limit(limit);

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
        
        const users = await User.find({_id : {$gt : startingId}}).limit(limit);

        return res.status(200).json(users);

    } catch (error) {
        
        return next(error);
    }
});


module.exports = router;