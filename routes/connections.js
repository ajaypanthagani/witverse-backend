/*
    this file contains routes to handle user connections such as followers
*/

/*importing all required modules*/
const express  = require('express');
const cors = require('./cors');
const authenticate = require('../authenticate');
const response = require('../response');

/*importing required models*/
const User = require('../models/users');

/*creating an express router instance*/
const router = express.Router();

/*creating route for follow action*/
router.route('/follow/:id')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) }) //options method to send the route resources and capabilities, for cors
.get(cors.cors, authenticate.verifyUser, (req, res, next) => { //get method, unsupported

    //create error
    const error = new Error(`GET method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass error to next method (error handler)
    return next(error);

})
.post(cors.corsWithOptions, authenticate.verifyUser, async (req, res, next) => { //post method to follow a user

    //retrieving id of user to be followed
    const id = req.params.id;

    //try catch block to catch and handle any possible errors
    try {

        //find user to be followed with given id
        const followee = await User.findById(id);

        //retrieving current authenticate user
        const user = req.user;

        //if followee is not null
        if(followee){

            //calling addFollower funtion on followee object with  current authenticate user
            await followee.addFollower(user._id);

            //calling follow function on current authenticate user object with followee id
            await user.follow(followee._id);

            //responding with success status
            res.status(200).json({success : true, message : 'followed succesfully'});
        }
        else{ //if followee is null

            //create error
            const error = new Error(`user with id ${req.params.id} doesn't exist`);
            error.status = 404;

            //pass error to next method (error handler)
            return next(error);
        }

    } 
    catch (error) { //catch any error
        
        //pass error to next method (error handler)
        return next(error);

    }
    
})
.put(cors.cors, authenticate.verifyUser, (req, res, next) => { //puth method, not supported


    //create error
    const error = new Error(`PUT method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass error to next method (error handler)
    return next(error);

})
.delete(cors.cors, authenticate.verifyUser, (req, res, next) => { //delete method, not supported

    //create error
    const error = new Error(`DELETE method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass error to next method (error handler)
    return next(error);

})

/*creating route for unfollow action*/
router.route('/unfollow/:id')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) }) //options method to send the route resources and capabilities, for cors
.get(cors.cors, authenticate.verifyUser, (req, res, next) => { //get method, not supported

    //create error
    const error = new Error(`GET method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass error to next method (error handler)
    return next(error);

})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //post method, not supported

    //create error
    const error = new Error(`POST method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass error to next method (error handler)
    return next(error);

})
.put(cors.cors, authenticate.verifyUser, (req, res, next) => { //put method, not supported

    //create error
    const error = new Error(`PUT method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass error to next method (error handler)
    return next(error);

})
.delete(cors.cors, authenticate.verifyUser, async (req, res, next) => { //delete method to unfollow user

    //retrieving id of user to be unfollowed from request parameters
    const id = req.params.id;

    //try catch block to catch and handle any possible errors
    try {
        
        //finding user to be unfollowed
        const followee = await User.findById(id);

        //retrieving current authenticated user
        const user = req.user;

        //if followee is not null
        if(followee){

            //calling removeFollower function on followee object
            await followee.removeFollower(user._id);

            //calling unfollow function on current authenticated user object
            await user.unfollow(followee._id);

            //responding with success status
            res.status(200).json({success : true, message : 'unfollowed succesfully'});
        }
        else{ //if followee is null


            //create error
            const error = new Error(`user with ${id} doesn't exist`);
            error.status = 404;

            //pass error to next method (error handler)
            return next(error);
        }


    } catch (error) { //catch any errors
        
        //pass error to next method (error handler)
        return next(error);

    }
})

/* creating route for followers resource of specific user*/
router.route('/followers/:id')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200) ) //options method to send the route resources and capabilities, for cors
.get(cors.cors, authenticate.verifyUser, async (req, res, next)=>{ //get method to get all the followers of a user

    //retrieve user id from request parameters
    const id = req.params.id;

    //try catch block to catch and handle any possible errors
    try {

        //find user by id and populate followers
        const user = await User.findById(id).populate('followers');

        //if user is not null
        if(user){

            //wrap followers in json object with required formatting
            const followers = user.followers.map((user) => response.wrapUser(user, req.user));

            //responding with followers with success status
            res.status(200).json(followers);
        }
        else{ //if user is null

            //create an error
            const error = new Error(`user with id ${user._id} doesn't exist`);
            error.status = 400;

            //pass the error to nexth method (error handler)
            return next(error);
        }


    } catch (error) { //catch any error
        
        //pass error to the next method (error handler)
        return next(error);

    }

})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //post method, not supported

    //create error
    const error = new Error(`POST method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass error to next method (error handler)
    return next(error);

})
.put(cors.cors, authenticate.verifyUser, (req, res, next) => { //put method, not supported

    //create error
    const error = new Error(`PUT method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass error to next method (error handler)
    return next(error);

})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //delete method, not supported

    //create error
    const error = new Error(`DELETE method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass error to next method (error handler)
    return next(error);

});

/*creating route for following resource*/
router.route('/following/:id')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200) ) //options method to send the route resources and capabilities, for cors
.get(cors.cors, authenticate.verifyUser, async (req, res, next)=>{ //get method to fetch all the users a specific user is following

    //retrieve user id from request parameters
    const id = req.params.id;

    //try catch block to catch and handle any possible errors
    try {

        //find user by id and populate following
        const user = await User.findById(id).populate('following');

        //wrap the following users in a json object with required formatting
        const following = user.following.map((user) => response.wrapUser(user, req.user));

        //responding with users a user is following with success status
        res.status(200).json(following);

    } catch (error) { //catch any error
        
        //pass the error to next method (error handler)
        next(error);

    }

})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //post method, not supported

    //create error
    const error = new Error(`POST method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass error to next method (error handler)
    return next(error);

})
.put(cors.cors, authenticate.verifyUser, (req, res, next) => { //put method, not supported

    //create error
    const error = new Error(`PUT method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass error to next method (error handler)
    return next(error);

})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //delete method, not supported

    //create error
    const error = new Error(`DELETE method is not supported on ${req.originalUrl}`);
    error.status = 400;

    //pass error to next method (error handler)
    return next(error);

});

/*exporting router*/
module.exports = router;