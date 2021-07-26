const router = require('express').Router();
const mongoose = require('mongoose');
const ReminderModel = require('../models/Reminder.model');

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

router.get('/reminders', isLoggedIn, (req, res) => {
    let userId = req.session.loggedInUser._id
    console.log(userId, 'hello')

    ReminderModel.find({user: userId})
    .populate('plant')
    .then((reminders) => {
        res.status(200).json(reminders)
    })
    .catch((err) => {
        res.status(500).json({
            error: 'Something went wrong',
            message: err
        })
    })
})

// the plant has been watered
// Set the current incomplete reminder for this plant to complete
// update the wateredAt date to today
// create a new incomplete reminder from today + plant's waterFrequency
router.patch('/reminders/:reminderId', isLoggedIn, (req, res, next) => {
    let userId = req.session.loggedInUser._id
    let reminderId = req.params.reminderId
    ReminderModel.findById(reminderId)
    .populate('plant')
    .then((reminder) => {
        console.log("reminder is: ", reminder)
        if (reminder) {
            if (reminder.user == userId) {
                let waterFreq = reminder.plant.waterFreq
                console.log('how often i need watering', waterFreq)
                let nextWatering = new Date()
                nextWatering.setDate(nextWatering.getDate() + waterFreq)
    
                ReminderModel.findByIdAndUpdate(reminderId, { complete: true, wateredAt: new Date() })
                .then(() => {
                    ReminderModel.create(
                        {
                            nextWatering: nextWatering,
                            plant: reminder.plant._id,
                            user: reminder.user._id,
                        })
                        .then(() => {
                            res.status(204).json({})
                        })
                        .catch((err) => {
                            res.status(500).json({
                                error: 'Something went wrong',
                                message: err
                            })
                        })
                })
                .catch((err) => {
                    console.log("error: ", err)
                    res.status(500).json({
                        error: 'Failed to update reminder',
                        message: err
                    })
                })
            }
            else {
                res.status(403).json({
                    error: 'Reminder not found',
                })
            }
          
        }
        else {
            res.status(404).json({
                error: 'Reminder not found',
            })
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