const router = require('express').Router();
const UserModel = require('../models/User.model');

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

// GET /profile -- show the profile page
router.get('/profile/:id', isLoggedIn, (req, res, next) => {
    let userObj = req.session.loggedInUser;
    console.log('profile', req.session.loggedInUser)
    UserModel.findById(userObj._id)
        .then((profile) => {
            res.status(200).json(profile)
        })
        .catch((err) => {
            res.status(500).json({
                error: 'Something went wrong',
                message: err
            })
        });
});

// PATCH /profile -- edit the profile details and send to db
router.patch('/profile/:id', (req, res, next) => {
    let userObj = req.session.loggedInUser;
    let dynamicProfileId = req.params.id;
    const {name, username, email} = req.body;

    if (userObj._id != dynamicProfileId) {
        return next(`User ${userObj._id} tried to edit another user's profile :(`);
    };

    UserModel.findByIdAndUpdate(userObj._id, {name, username, email}, {new: true})
    .then((response) => {
        res.status(200).json(response)
    })
    .catch((err) => {
        res.status(500).json({
            error: 'Something went wrong',
            message: err
       })
    });
});

// DELETE /profile -- delete the profile
router.delete('/profile/:id', (req, res, next) => {
    let userObj = req.session.loggedInUser;
    let dynamicProfileId = req.params.id;

    if (userObj._id != dynamicProfileId) {
        return next(`User ${userObj._id} tried to delete another user's profile :(`);
    };
    
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
    });
});

module.exports = router;