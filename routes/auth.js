const express = require('express');
const router = express.Router();
const cors = require('./cors');
const passport = require('passport');
const authenticate = require('../authenticate');
const { response } = require('express');


router.route('/login')
.options(cors.corsWithOptions, (req, res)=>{ res.sendStatus(200) })
.get(cors.cors, passport.authenticate('local'), (req, res, next)=>{

    const error = new Error(`GET method is not supported on ${req.originalUrl}`);
    error.status = 400;
    next(error);

})
.post(cors.corsWithOptions, passport.authenticate('local'), (req, res, next) => {

    const token = authenticate.getToken({_id : req.user._id});

    res.status(200).json({message : 'login successful', token : token});

})
.put(cors.corsWithOptions, passport.authenticate('local'), (req, res, next) => {

    const error = new Error(`POST method is not supported on ${req.originalUrl}`);
    error.status = 400;
    next(error);

})
.delete(cors.corsWithOptions, passport.authenticate('local'), (req, res, next)=>{

    const error = new Error(`POST method is not supported on ${req.originalUrl}`);
    error.status = 400;
    next(error);

})

router.route('/reset-password')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
.get(cors.cors, authenticate.verifyUser, (req, res, next)=>{

    const error = new Error(`GET method is not supported on ${req.originalUrl}`);
    error.status = 400;
    next(error);

})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

    const passwords = req.body;

    if(passwords.oldPassword && passwords.newPassword){

        const user = req.user;

        user.changePassword(passwords.oldPassword, passwords.newPassword)
        .then(

            (response) => {

                return res.status(200).json(response);
            }
        )
        .catch(

            (error) => {

                return next(error);
            }
        )
    }
    else{

        const error = new Error('old password and new password are required');
        error.status = 400;
        return next(error);
    }
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

    const error = new Error(`POST method is not supported on ${req.originalUrl}`);
    error.status = 400;
    next(error);

})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{

    const error = new Error(`POST method is not supported on ${req.originalUrl}`);
    error.status = 400;
    next(error);

})


module.exports = router;