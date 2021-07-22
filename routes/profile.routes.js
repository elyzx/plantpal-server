const express = require('express')
const router = express.Router()
const UserModel = require('../models/User.model');

// GET /profile -- show the profile page
router.get('/profile', (req, res) => {
    UserModel.find()
        .then((profile) => {
            res.status(200).json(profile)
        })
        .catch((err) => {
            res.status(500).json({
                error: 'Something went wrong',
                message: err
            })
        })
});

// PATCH /profile -- edit the profile details and send to db
router.patch('/profile', (req, res) => {
    let userObj = req.session.loggedInUser
    const {name, username, email} = req.body
    let dynamicProfileId = req.params.id

    if (userObj._id != dynamicProfileId) {
        return next(`User ${userObj._id} tried to edit another user's profile :(`)
    }

    UserModel.findByIdAndUpdate(userObj._id, {name, username, email}, {new: true})
    .then((response) => {
        res.status(200).json(response)
    })
    .catch((err) => {
        res.status(500).json({
            error: 'Something went wrong',
            message: err
       })
    })
});

// DELETE /profile -- delete the profile
router.delete('/profile', (req, res, next) => {
    let userObj = req.session.loggedInUser
    let dynamicProfileId = req.params.id

    if (userObj._id != dynamicProfileId) {
        return next(`User ${userObj._id} tried to delete another user's profile :(`)
    }
    
    UserModel.findByIdAndDelete(userObj._id)
        .then(() => {
            req.session.destroy()
            res.status(200).json(response)
        })
        .catch(() => {
            res.status(500).json({
                error: 'Something went wrong',
                message: err
        })
    })
});

module.exports = router;