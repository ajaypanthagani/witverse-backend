var express = require('express');
var router = express.Router();
var cors = require('./cors');
var authenticate = require('../authenticate');
var passport = require('passport');
var User = require('../models/users');
var response = require('../response');
var genPass = require('generate-password');
const nodemailer = require("nodemailer");


/*CRUD routes*/

//grouped resource
router.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next)=>{
  
  User.find({})
  .then(
    (users) => {

      users = users.map((user) => response.wrapUser(user, req.user));

      return res.status(200).json(users);

    }
  )
  .catch(
    (error) => {

      return next(error);

    }
  )
})
.post(cors.corsWithOptions, (req,res,next)=>{

  const userData = req.body;
  
  if(userData.username && userData.firstname && userData.lastname){

    //check for duplicate username
    User.findOne({'username' : userData.username})
    .then(

      (user) => {

        if(user){

          const error = new Error('Username already exists');
          error.status = 409;
          return next(error);
        }
        else{

          const randPass = genPass.generate({
            length : 5,
            numbers : true
          });

          //registering user
          User.register( new User(
            {
              username : userData.username, 
              firstname : userData.firstname, 
              lastname : userData.lastname,
              email : userData.email
            }
          ),
           
            randPass, (error, user) => {

            if(error){

              return next(error);

            }
            else{

              user.save((error, user)=>{
                
                if(error){

                  return next(error);

                }
                else{

                  let transporter = nodemailer.createTransport({
                    host: process.env.MAIL_HOST,
                    port: process.env.MAIL_PORT,
                    secure: false, // true for 465, false for other ports
                    auth: {
                      user: process.env.MAIL_USERNAME, // generated ethereal user
                      pass: process.env.MAIL_PASSWORD // generated ethereal password
                    },
                    tls: {
                      rejectUnauthorized: false
                    }
                  });

                  const mailBody = 
                  `<h1>Welcome to Witverse!</h1>
                  <h4>we are happy to have you here</h4>
                  <p>Your temporary password is <strong> ${randPass} </strong> </p>
                  <ul>
                    <li> <strong>step 1</strong> : Login with your temporary password</li>
                    <li> <strong>step 2</strong> : Change your password in profile section</li>
                    <li> <strong>step 3</strong> : Enjoy using Witverse</li>
                  </ul>
                  <small>All rights reserved Witverse 2020 - Developed by Ajay Panthagani</small>`

                  // send mail with defined transport object
                  transporter.sendMail(
                    {
                    from: '"witverse" <admin@ajaypanthagani.me>', // sender address
                    to: user.email, // list of receivers
                    subject: "Temporary password for Witverse account", // Subject line
                    text: randPass, // plain text body
                    html: mailBody, // html body
                  },
                  (error, info) => {

                    if(error){

                      return next(error);

                    }

                    
                    res.json({success: true, status: 'Registered successfully'});

                  } );


                }
              })
            }
          })

        }

      }

    )
    .catch(

      (error) => {

        return next(error);

      }
    )
  }
  else{

    const error = new Error('Insufficient data');
    next(error);

  }
})
.put(cors.corsWithOptions,  authenticate.verifyUser, (req, res, next)=>{

  const error = new Error(`PUT method is not supported on ${req.originalUrl}`);
  error.status = 400;
  next(error);

})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{

  User.deleteMany({})
  .then(
    (op) => {

      res.status(200).json(op);

    }
  )
  .catch(

    (error) => {

      next(error);

    }
  )
});

//single resource
router.route('/:id')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next)=>{

  const id = req.params.id;

  User.findById(id)
  .then(

    (user) => {

      if(user){

        user = response.wrapUser(user, req.user);

        res.status(200).json(user);

      }
      else{

        const error = new Error(`User with id : ${id} doesn't exist`);
        error.status = 404;
        return next(error);

      }
    }
  )
  .catch(

    (error) => {

      return next(error);

    }
  )
})
.post(cors.corsWithOptions,  authenticate.verifyUser, (req, res, next)=>{

  const error = new Error(`POST method is not supported on ${req.originalUrl}`);
  error.status = 400;
  next(error);

})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{

  const id = req.params.id;
  const userId = req.user._id.toString();

  if(id===userId){

    User.findById(id)
    .then(
  
      (user) => {
  
        if(user){
  
          const userData = req.body;
  
          user.firstname = userData.firstname ? userData.firstname : user.firstname;
          user.lastname = userData.lastname ? userData.lastname : user.lastname;
  
          User.findOne({'username' : userData.username, '_id' : {$ne : id}})
          .then(
            (existingUser) => {
  
              if(existingUser){
  
                const error = new Error('Username already exists');
                error.status = 409;
                return next(error);
  
              }
              else{
  
                user.username = userData.username ? userData.username : user.username;
                user.save()
                .then(
                  (user) => {
        
        
                    return res.status(200).json(response.wrapUser( user, req.user ));
        
                  }
                )
                .catch(
        
                  (error) => {
        
                    return next(error);
        
                  }
                )
              }
            }
          )
          .catch(
  
            (error) => {
  
              return next(error);
  
            }
          )
  
        }
        else{
  
          const error = new Error(`User with id : ${id} doesn't exist`);
          error.status = 404;
          return next(error);
          
        }
      }
    )
    .catch(
  
      (error) => {
  
        return next(error);
  
      }
    )
  }
  else{

    const error = new Error('Your are not authorized to perform this operation!');
    error.status = 403;
    return next(error);

  }

})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{

  const id = req.params.id;
  const userId = req.user._id.toString()

  if(id===userId){

    User.findByIdAndDelete(id)
    .then(
      (op) => {

        res.status(200).json(op);

      }
    )
    .catch(
      (error) => {

        return next(error);

      }
    );

  }
  else{

    const error = new Error('Your are not authorized to perform this operation!');
    error.status = 403;
    return next(error);

  }
  
});

router.route('/random/:size')
.options(cors.corsWithOptions, (req, res)=>res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, async (req, res, next)=>{

  const numOfUsers = parseInt(req.params.size);

  const followingUsers = req.user.following.concat(req.user._id);

  const suggestions = await User.aggregate([

    { $match: {'_id': { $nin: followingUsers } } },

    { $sample : {size : numOfUsers } }

  ]);

  return res.status(200).json(suggestions);
})

module.exports = router;
