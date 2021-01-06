/*
*
    this file contains routes for uploading files

    file uploading is done using multer, a middleware to handle multipart/form-data
*
*/

/*importing required modules*/
const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const authenticate = require('../authenticate');
const multer = require('multer');
const response = require('../response');
const cors = require('./cors');


/*configuring diskStorage, a storage engine shipped with multer, for control over storage of the file*/
const storage = multer.diskStorage({

    //destination determines where the file will be stored
    destination: (req,file,cb)=>{

        cb(null, 'public/images/profile');

    },
    
    //filename determines the name of the file in the storage directory
    filename: (req, file, cb)=>{

        cb(null, uuid.v4() + path.extname(file.originalname));
    }
});

const imageFileFilter = (req, file, cb) => { //file filter controls which type of files are allowed to upload

    //if file doesn't have any of the allowed extension
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {

        //return an error
        return cb(new Error('You can upload only image files!'), false);
    }

    //else return a true verdict, allowed
    cb(null, true);

};

/*create a multer instanc for file uploads*/
const upload = multer({ storage: storage, fileFilter: imageFileFilter});

/*creating an express router instance*/
const uploadRouter = express.Router();


/*creating a route for display image upload*/
uploadRouter.route('/displayImage')
.options(cors.corsWithOptions, (req, res)=>{res.sendStatus(200)}) //options method to send the route resources and capabilities, for cors
.get(cors.cors, authenticate.verifyUser, (req, res, next) => { //get method, not supported
    
        //create error
        const error = new Error(`GET method is not supported on ${req.originalUrl}`);
        error.status = 400;
    
        //pass error to next method (error handler)
        return next(error);
})
.post(cors.corsWithOptions, authenticate.verifyUser, upload.single('displayImage'), (req, res) => { //post method to upload display image

    //retrieving user from request object
    const user = req.user;

    //creating absolute path of image
    const imageURL = path.join('/images/profile', req.file.filename);

    //formatting path to have forward slashes
    const correctURL = imageURL.replace(/\\/g, "/");

    //storing image url in user object
    user.displayImage = correctURL;

    //saving user
    user.save()
    .then(

        (user) => {

            return res.status(200).json(response.wrapUser(user, req.user));
        }
    )
    .catch(

        (error) => {

            next(error);
        }
    )
})
.put(cors.corsWithOptions, authenticate.verifyUser,  upload.single('displayImage'), (req, res, next) => { //put method to update the display image
    
    //retrieving user from request object
    const user = req.user;

    //creating absolute path of image
    const imageURL = path.join('/images/profile', req.file.filename);

    //formatting path to have forward slashes
    const correctURL = imageURL.replace(/\\/g, "/");

    //storing image url in user object
    user.displayImage = correctURL;

    //saving user
    user.save()
    .then(

        (user) => {

            return res.status(200).json(response.wrapUser(user, req.user));
        }
    )
    .catch(

        (error) => {

            next(error);
        }
    )
    
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { //delete method to delete the display image
    
    //reverting back to default display image

    const user = req.user;

    const prevDisplayImage = user.displayImage;

    user.displayImage = path.join('/images/profile', 'default.png');

    user.save()
    .then(

        (user) => {

            res.status(200).json(user);
        }
    )
    .catch(

        (error) => {

            next(error);

        }
    )
});

/*exporting upload router*/
module.exports = uploadRouter;