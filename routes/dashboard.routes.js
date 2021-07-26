const router = require('express').Router();
const PlantModel = require('../models/Plant.model')

const isLoggedIn = (req, res, next) => {  
    if (req.session.loggedInUser) {
        //calls whatever is to be executed after the isLoggedIn function is over
        next()
    }
    else {
        res.status(401).json({
            message: 'Unauthorised user',
            code: 401,
        })
    };
  };

// GET /dashboard -- show dashboard 
// will handle all GET requests to http:localhost:5005/api/dashboard
  router.get('/dashboard', isLoggedIn, (req, res, next) => {
    console.log(req.cookie)
    PlantModel.find()
        .then((plants) => {
            res.status(200).json(plants)
        })
        .catch((err) => {
            res.status(500).json({
                error: 'Something went wrong',
                message: err
           })
        });
});

module.exports = router;