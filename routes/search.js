const express = require('express');
const router = express.Router();
const cors = require('./cors');
const authenticate = require('../authenticate');
const response = require('../response');

const Quote = require('../models/quotes');
const User = require('../models/users');


router.route('/quotes')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, async (req, res, next) => {


    try {

        const searchFor = req.query.searchFor || '';

        let results = await Quote.find({$text : { $search : searchFor }});

        results = results.map( (result) => response.wrapQuote(result, req.user) );
    
        res.status(200).json(results);

    } catch (error) {
        
        return next(error);
    }


});

router.route('/users')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, async (req, res, next) => {

    try {

        const searchFor = req.query.searchFor || '';

        // let results = await User.find({$text : { $search : searchFor }});

        let results = await User.find({ $or : [{ username : { $regex : searchFor } }, { firstname : { $regex : searchFor } }, { lastname : { $regex : searchFor } }] });

        results = results.map( (result) => response.wrapUser(result, req.user) );
    
        res.status(200).json(results);
        
    } catch (error) {
        
        return next(error);
    }

});


module.exports = router;