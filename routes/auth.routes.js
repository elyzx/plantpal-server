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
    UserModel.create({name, username, email, passwordHash: hash})
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
router.post('/signin', (req, res) => {
    const {username, password } = req.body;

    // -----SERVER SIDE VALIDATION ----------
    /*
    if ( !email || !password) {
        res.status(500).json({
            error: 'Please enter Username and password',
       })
      return;  
    }
    */
  
    // Find if the user exists in the database 
    UserModel.findOne({username})
      .then((userData) => {
           // check if passwords match
          bcrypt.compare(password, userData.passwordHash)
            .then((doesItMatch) => {
                //if it matches
                if (doesItMatch) {
                  // req.session is the special object that is available to you
                  userData.passwordHash = "***";
                  req.session.loggedInUser = userData;
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
            .catch(() => {
                res.status(500).json({
                    error: 'Email format not correct',
                })
              return; 
            });
      })
      // throw an error if the user does not exists 
      .catch((err) => {
        res.status(500).json({
            error: 'Email does not exist',
            message: err
        })
        return;  
      });
});

// Handles POST request to /logout -- logout and destroy the session
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.status(204).json({});
})

module.exports = router;