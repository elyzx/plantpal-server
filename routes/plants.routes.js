const router = require('express').Router();
const mongoose = require('mongoose');
const PlantModel = require('../models/Plant.model')
const ReminderModel = require('../models/Reminder.model')

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


// GET /plants -- show list of all plants for that user
//will handle all GET requests to http:localhost:5005/api/plants
router.get('/plants', isLoggedIn, (req, res, next) => {
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
        })
})


// GET /plants/:plantId -- show plant details page
// will handle all GET requests to http:localhost:5005/api/plants/:plantId
router.get('/plants/:plantId', isLoggedIn, (req, res) =>{
    PlantModel.findById(req.params.plantId)
        .then((plant) => {
            res.status(200).json(plant)
        })
        .catch((err) => {
            res.status(500).json({
                 error: 'Something went wrong',
                 message: err
            })
       })    
})



// PATCH /plants/:id/(edit) -- edit plant form
//will handle all PATCH requests to http:localhost:5005/api/plants/:id
router.patch('/plants/:id', isLoggedIn, (req, res) => {
    let id = req.params.id
    const {name, description, photo, waterFreq, fertiliseFreq, isAlive } = req.body
    PlantModel.findByIdAndUpdate(id, {$set: {name:name, description:description, photo: photo, waterFreq: waterFreq, fertiliseFreq: fertiliseFreq, isAlive: isAlive }}, {new: true})
        .then((response) => {
            // compare the waterfreq before we update the plant, with the waterfrequency in the request
            // if they are different:
            //  check if an incomplete remainder exists and update the next-watering day accoringly,
            //  don't set ti to the past. Set it to today if it would be in the past.
            // Done

            res.status(200).json(response)   
        })
        .catch((err) => {
            res.status(500).json({
                 error: 'Something went wrong',
                 message: err
            })
        })     
})


// DELETE /plants/:id/(edit) -- delete plant from db
// will handle all DELETE requests to http:localhost:5005/api/plants/:id
router.delete('/plants/:id', isLoggedIn, (req, res) => {
    PlantModel.findByIdAndDelete(req.params.id)
          .then((response) => {
               res.status(200).json(response)
          })
          .catch((err) => {
               res.status(500).json({
                    error: 'Something went wrong',
                    message: err
               })
          })  
})

// will handle all POST requests to http:localhost:5005/api/plants/create
router.post('/plants/create', isLoggedIn, (req, res, next) => {  
    let userId = req.session.loggedInUser._id
    console.log('POST /plants/create', userId)

    const {name, description, photo, waterFreq, fertiliseFreq} = req.body;

    const userObjId = mongoose.Types.ObjectId(userId)

    PlantModel.create({name: name, description: description, photo: photo, waterFreq: waterFreq, fertiliseFreq: fertiliseFreq, user: userObjId})
          .then((response) => {
            if (waterFreq) {
                const plantObjId = mongoose.Types.ObjectId(response._id)
                const today = new Date();
                let nextWatering = new Date();
                // waterFrequency is in days
                nextWatering.setDate(nextWatering.getDate() + parseInt(waterFreq))
                
                ReminderModel.create(
                    {
                        wateredAt: today,
                        nextWatering: nextWatering,
                        plant: plantObjId,
                        user: userObjId,
                    })
                .then((reminderResponse) => {
                    console.log("remainder created: ", reminderResponse)
                    res.status(200).json(response)
                })
                .catch((err) => {
                    console.log("Attention, created plant with waterFreq but adding the remainder failed")
                    res.status(200).json(response)
                })
            } else {
                res.status(200).json(response)
            }
          })
          .catch((err) => {
               res.status(500).json({
                    error: 'Something went wrong',
                    message: err
               })
          })  
})

module.exports = router;