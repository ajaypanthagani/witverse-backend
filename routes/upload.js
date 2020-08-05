const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const authenticate = require('../authenticate');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, 'public/images/profile');
    },
    
    filename: (req, file, cb)=>{
        cb(null, uuid.v4() + path.extname(file.originalname));
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();

uploadRouter.use(express.urlencoded({extended:true}));
uploadRouter.use(express.json());

const cors = require('./cors');
const { reset } = require('nodemon');

uploadRouter.route('/displayImage')
.options(cors.corsWithOptions, (req, res)=>{res.sendStatus(200)})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`GET operation not supported on ${req.originalUrl}` );
})
.post(cors.corsWithOptions, authenticate.verifyUser, upload.single('displayImage'), (req, res) => {

    const user = req.user;

    user.displayImage = path.join('/images/profile', req.file.filename);

    user.save()
    .then(

        (user) => {

            return res.status(200).json(user);
        }
    )
    .catch(

        (error) => {

            next(error);
        }
    )
})
.put(cors.corsWithOptions, authenticate.verifyUser,  upload.single('displayImage'), (req, res, next) => {
    
    const user = req.user;

    user.displayImage = path.join('/images/profile', req.file.filename);

    user.save()
    .then(

        (user) => {

            return res.status(200).json(user);
        }
    )
    .catch(

        (error) => {

            next(error);
        }
    )
    
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    

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

module.exports = uploadRouter;