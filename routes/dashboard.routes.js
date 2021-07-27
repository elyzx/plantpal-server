const router = require('express').Router();
const PlantModel = require('../models/Plant.model')
// const axios =  require('axios');

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
    PlantModel.find({user: userId})
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


// router.get('/dashboard/test'),isLoggedIn, (req, res, next) => {
//     axios.get(`http://api.weatherbit.io/v2.0/current?&postal_code=27601&country=US&key=40b97bfea4d145428c756bc5caf74cbb`)
//     .then( (response) => {
//         const weatherData = response.data[0]
//         console.log('weather response :', weatherData)
//     })
//     .catch((err) => {
//       console.log('weather error')
//        }) 
// };

module.exports = router;