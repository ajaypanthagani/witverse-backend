var express = require('express');
var router = express.Router();
var cors = require('./cors');
var User = require('../models/users');
const { response } = require('express');

/*CRUD routes*/

//grouped resource
router.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next)=>{
  
  User.find({})
  .then(
    (users) => {

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

          //creating new user
          const user = new User(userData);

          //saving new user
          user.save()
          .then(
      
            (user)=>{
      
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

    const error = new Error('Insufficient data');
    next(error);

  }
})
.put(cors.corsWithOptions, (req, res, next)=>{

  const error = new Error(`PUT method is not supported on ${req.originalUrl}`);
  error.status = 400;
  next(error);

})
.delete(cors.corsWithOptions, (req, res, next)=>{

  User.deleteMany({})
  .then(
    (response) => {

      res.status(200).json(response);

    }
  )
  .catch(

    (error) => {

      next(error);

    }
  )
})

//single resource
router.route('/:id')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next)=>{

  const id = req.params.id;

  User.findById(id)
  .then(

    (user) => {

      if(user){
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
.post(cors.corsWithOptions, (req, res, next)=>{

  const error = new Error(`POST method is not supported on ${req.originalUrl}`);
  error.status = 400;
  next(error);

})
.put(cors.corsWithOptions, (req, res, next)=>{

  const id = req.params.id;

  User.findById(id)
  .then(

    (user) => {

      if(user){

        const userData = req.body;

        user.firstname = userData.firstname ? userData.firstname : user.firstname;
        user.lastname = userData.lastname ? userData.lastname : user.lastname;
        user.password = userData.password ? userData.password : user.password;

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
})
.delete(cors.corsWithOptions, (req, res, next)=>{

  const id = req.params.id;

  User.findByIdAndDelete(id)
  .then(
    (response) => {

      res.status(200).json(response);

    }
  )
  .catch(
    (error) => {

      return next(error);

    }
  )
})

module.exports = router;
