const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
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

    ReminderModel.find(
        {
            complete: false,
            user: mongoose.Types.ObjectId(userId),
        })
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

router.post('/reminders/:reminderId', (req, res) => {
    // the plant has been watered
    // Set the current incomplete reminder for this plant to complete
    // update the wateredAt date to today
    // create a new incomplete reminder from today + plant's waterFrequency
})


module.exports = router;