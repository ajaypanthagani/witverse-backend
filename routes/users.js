var express = require('express');
var router = express.Router();
var cors = require('./cors');
var authenticate = require('../authenticate');
var passport = require('passport');
var User = require('../models/users');
var response = require('../response');


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
.post(cors.corsWithOptions,  authenticate.verifyUser, (req,res,next)=>{

  const userData = req.body;
  
  if(userData.username && userData.password && userData.firstname && userData.lastname){

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

          //registering user
          User.register( new User(
            {
              username : userData.username, 
              firstname : userData.firstname, 
              lastname : userData.lastname
            }
          ),
           
            userData.password, (error, user) => {

            if(error){

              return next(error);

            }
            else{

              user.save((error, user)=>{
                
                if(error){

                  return next(error);

                }
                else{

                  passport.authenticate('local')(req, res, () => {

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, status: 'Registered successfully'});

                  });
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
        
        
                    return res.status(200).json(user);
        
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

module.exports = router;
