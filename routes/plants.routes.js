const router = require('express').Router();

const PlantModel = require('../models/User.model')


// GET /plants -- show list of all plants for that user
//will handle all GET requests to http:localhost:5005/api/plants
router.get('/plants', (req, res) => {
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
router.get('/plants/:plantId', (req, res) =>{
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
router.patch('/plants/:id', (req, res) => {
    let id = req.params.id
    const {name, description, photo, waterFreq, fertiliseFreq, isAlive } = req.body
    PlantModel.findByIdAndUpdate(id, {$set: {name:name, description:description, photo: photo, waterFreq: waterFreq, fertiliseFreq: fertiliseFreq, isAlive: isAlive }}, {new: true})
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


// DELETE /plants/:id/(edit) -- delete plant from db
// will handle all DELETE requests to http:localhost:5005/api/plants/:id
router.delete('/plants/:id', (req, res) => {
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
router.post('/plants/create', (req, res) => {  
    const {name, description, photo, waterFreq, fertiliseFreq} = req.body;
    console.log(req.body)
    PlantModel.create({name: name, description: description, photo: photo, waterFreq: waterFreq, fertiliseFreq: fertiliseFreq})
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

module.exports = router;