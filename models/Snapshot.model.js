const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
require('./Plant.model');

let snapshotSchema = new Schema ({
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
});

let Snapshot = model('Snapshot', snapshotSchema);

module.exports = Snapshot;
