const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
require('./Plant.model');

let reminderSchema = new Schema ({
    wateredAt: Date,
    nextWatering: {
        type: Date,
        required: true,
    },
    complete: {
        type: Boolean,
        default: false,
    },
    plant: {
        ref: 'Plant',
        type:  mongoose.Schema.Types.ObjectId,
    },
    user: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId
    },
});

let Reminders = model('Reminders', reminderSchema)

module.exports = Reminders;