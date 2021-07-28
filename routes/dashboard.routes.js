const router = require('express').Router();
const PlantModel = require('../models/Plant.model')
const axios =  require('axios');

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


router.get('/dashboard/test',isLoggedIn, (req, res, next) => {
    let { country, postal } = req.session.loggedInUser
    
    axios.get(`http://api.weatherbit.io/v2.0/current?&postal_code=${postal}&country=${country}&key=${process.env.API_WEATHER}`)
    .then( (response) => {
        const weatherData = response.data
        console.log('weather response :', weatherData)
        res.json(weatherData)
    })
    .catch((err) => {
      console.log('weather error')
       }) 
});

module.exports = router;