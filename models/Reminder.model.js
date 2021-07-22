const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
require('./Plant.model');

let reminderSchema = new Schema ({
    name: String,
    date: Date,
    status: Boolean,
    plant: {
        ref: 'Plant',
        type:  mongoose.Schema.Types.ObjectId,
    },
});

let Reminders = model('Reminders', remindersSchema)

module.exports = Reminders;