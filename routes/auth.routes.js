const express = require('express');
const router = express.Router();

const UserModel = require('../models/User.model')
const bcrypt = require('bcryptjs');


// Handles POST request to /signup
router.post('/signup', (req, res) => {
    const {name, username, email, password } = req.body;
 
    // -----SERVER SIDE VALIDATION ----------
    /* 
    if (!name || username || !email || !password) {
        res.status(500)
          .json({
            errorMessage: 'Please enter your name, username, email and password'
          });
        return;  
    }
    const myRegex = new RegExp(/^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/);
    if (!myRegex.test(email)) {
        res.status(500).json({
          errorMessage: 'Email format not correct'
        });
        return;  
    }
    const myPassRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/);
    if (!myPassRegex.test(password)) {
      res.status(500).json({
        errorMessage: 'Password needs to have 8 characters, a number and an Uppercase alphabet'
      });
      return;  
    }
    */

    // creating a salt 
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    UserModel.create({name, username, email, password: hash})
      .then((user) => {
        user.passwordHash = "***";
        res.status(200).json(user);
      })
      .catch((err) => {
        if (err.code === 11000) {
          res.status(500).json({
            errorMessage: 'username or email entered already exists!',
            message: err,
          });
        } 
        else {
          res.status(500).json({
            errorMessage: 'Something went wrong!',
            message: err,
          });
        }
      })
});


// Handles POST request to /auth/login
router.post('/login', (req, res, next) => {
    const {username, password} = req.body;

    // if ( !username || !password) {
    //     res.status(500).json({
    //         error: 'Please enter username and password',
    //    })
    //   return;  
    // }

    // Find if the user exists in the database 
    UserModel.findOne({username})
      .then((userData) => {
           // check if passwords match
          bcrypt.compare(password, userData.password)
            .then((doesItMatch) => {
                //if it matches
                if (doesItMatch) {
                  // req.session is the special object that is available to you
                  userData.password = "***";
                  req.session.loggedInUser = userData;
                  console.log("/login req.sesion.loggedInUser:", req.session.loggedInUser)
                  res.status(200).json(userData)
                }
                // if passwords do not match
                else {
                    res.status(500).json({
                        error: 'Passwords don\'t match',
                    })
                  return; 
                }
            })
            .catch((err) => {
              console.log(err)
                res.status(500).json({
                    error: 'Login details not correct',
                })
              return; 
            });
      })
      // throw an error if the user does not exists 
      .catch((err) => {
        res.status(500).json({
            error: 'Username does not exist',
            message: err
        })
        return;  
      });
});

// Handles POST request to /logout -- logout and destroy the session
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.status(204).json({});
});

module.exports = router;

// middleware to check if user is loggedin
const isLoggedIn = (req, res, next) => {  
  if (req.session.loggedInUser) {
      //calls whatever is to be executed after the isLoggedIn function is over
      console.log("is Logged in in auth; req.sesion.loggedInUser:", req.session.loggedInUser)
      next()
  }
  else {
      res.status(401).json({
          message: 'Unauthorised user',
          code: 401,
      })
  };
};

// THIS IS A PROTECTED ROUTE
// will handle all get requests to http:localhost:5005/api/user
router.get("/user", isLoggedIn, (req, res, next) => {
  console.log(req.cookie)
    
  res.status(200).json(req.session.loggedInUser);
});