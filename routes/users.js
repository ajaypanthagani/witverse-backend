/*importing all the required modules*/

const express = require('express');
const router = express.Router();
const cors = require('./cors');
const authenticate = require('../authenticate');
const passport = require('passport');
const User = require('../models/users');
const response = require('../response');
const genPass = require('generate-password');
const nodemailer = require("nodemailer");
const config = require('../config');
const mailConfig = require('../mail-config');




/*CRUD routes*/

/*route that handles all the requests for the 'user/' resource*/
router.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next)=>{
  
  //route returns all the users
  User.find({})
  .then(
    (users) => {

      //wrapping all the db responses to match the formatting required
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

  //this route creates an instance of a new user in the database, register function
  const userData = req.body;
  
  if(userData.username && userData.firstname && userData.lastname && userData.email){

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

                  //importing mail transporter from mailConfig
                  let transporter = mailConfig.transporter;

                  // send mail with defined transport object
                  transporter.sendMail(
                  mailConfig.mailEnvelope('WELCOME', 'New Password | Welcome to Witverse', {toEmail : user.email, randPass : randPass}),
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

  //this route deletes all the user resources, authorized only for user with admin privelege
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

/*route that handles all the requests for the 'user/id' resource, single user*/
router.route('/:id')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next)=>{

  // route returns requested user based on ID supplied
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

  // route updates the user with provided ID
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

  // route deletes the user with provided ID
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

/*route that provides random set of users used for friend suggestions*/
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
