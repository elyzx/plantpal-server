const { Schema, model } = require('mongoose');
let mongoose = require('mongoose');
require('./User.model');

const plantSchema = new Schema ({
    name: String,
    description: String,
    photo: String,
    dateAdded: {
        type: Date,
        default: Date.now
    },
    lastWateredAt: {
        type: Date,
        default: Date.now
    },
    waterFreq: {
        type: Number,
        min: 1,
        max: 31,
    },
    fertiliseFreq: {
        type: Number,
        min: 1,
        max: 12,
    },
    isAlive: {
        type: Boolean,
        default: true,
    },
    user: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId
    },
});

const Plant = model('Plant', plantSchema);

module.exports = Plant;