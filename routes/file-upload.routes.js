const express = require('express');
const router  = express.Router();

// include CLOUDINARY:
const uploader = require('../middlewares/cloudinary.config.js');

router.post('/upload', uploader.single("imageUrl"), (req, res, next) => {
     console.log('file is: ', req.file)
    if (!req.file) {
      next(new Error('No file uploaded!'));
      return;
    }
    //You will get the image url in 'req.file.path'
    //store that in the DB  
    res.status(200).json({
        photo: req.file.path
    })
})

module.exports = router;