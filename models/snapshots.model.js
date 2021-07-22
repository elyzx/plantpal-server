const mongoose = require('mongoose');

let snapshotsSchema = new mongoose.Schema({
    date:  { 
        type : Date, 
        default: Date.now 
    },
    name: String,
    text: String,
    photo: String,
    plant: {
        ref: 'Plant',
        type:  mongoose.Schema.Types.ObjectId,
    },
})

let Snapshots = mongoose.model('Snapshots', snapshotsSchema)

module.exports = Snapshots;
