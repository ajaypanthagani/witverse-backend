const express  = require('express');
const router = express.Router();
const cors = require('./cors');
const authenticate = require('../authenticate');

const response = require('../response');

const User = require('../models/users');


router.route('/follow/:id')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {

    const error = new Error(`GET method is not supported on ${req.originalUrl}`);
    error.status = 400;
    next(error);

})
.post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => {

    const id = req.params.id;

    try {

        const followee = await User.findById(id);

        const user = req.user;

        if(followee){

            await followee.addFollower(user._id);

            await user.follow(followee._id);

            res.status(200).json({success : true, message : 'followed succesfully'});
        }
        else{

            const error = new Error(`user with id ${req.params.id} doesn't exist`);
            error.status = 404;
            next(error);
        }

    } 
    catch (error) {
        
        next(error);

    }
    
})
.put(cors.cors, authenticate.verifyUser, (req, res, next) => {

    const error = new Error(`PUT method is not supported on ${req.originalUrl}`);
    error.status = 400;
    next(error);

})
.delete(cors.cors, authenticate.verifyUser, (req, res, next) => {

    const error = new Error(`DELETE method is not supported on ${req.originalUrl}`);
    error.status = 400;
    next(error);

})


router.route('/unfollow/:id')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {

    const error = new Error(`GET method is not supported on ${req.originalUrl}`);
    error.status = 400;
    next(error);

})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

    const error = new Error(`POST method is not supported on ${req.originalUrl}`);
    error.status = 400;
    next(error);

})
.put(cors.cors, authenticate.verifyUser, (req, res, next) => {

    const error = new Error(`PUT method is not supported on ${req.originalUrl}`);
    error.status = 400;
    next(error);

})
.delete(cors.cors, authenticate.verifyUser, async (req, res, next) => {

    const id = req.params.id;

    try {
        
        const followee = await User.findById(id);

        const user = req.user;

        if(followee){

            await followee.removeFollower(user._id);

            await user.unfollow(followee._id);

            res.status(200).json({success : true, message : 'unfollowed succesfully'});
        }
        else{

            const error = new Error(`user with ${id} doesn't exist`);
            error.status = 404;
            next(error);
        }


    } catch (error) {
        
        next(error);

    }
})

router.route('/followers/:id')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200) )
.get(cors.cors, authenticate.verifyUser, async (req, res, next)=>{

    const id = req.params.id;

    try {

        const user = await User.findById(id).populate('followers');

        const followers = user.followers.map((user) => response.wrapUser(user, req.user));

        res.status(200).json(followers);

    } catch (error) {
        
        next(error);

    }

});

router.route('/following/:id')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200) )
.get(cors.cors, authenticate.verifyUser, async (req, res, next)=>{

    const id = req.params.id;

    try {

        const user = await User.findById(id).populate('following');

        const following = user.following.map((user) => response.wrapUser(user, req.user));

        res.status(200).json(following);

    } catch (error) {
        
        next(error);

    }

});

module.exports = router;