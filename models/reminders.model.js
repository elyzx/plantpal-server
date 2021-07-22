const mongoose = require('mongoose');

let remindersSchema = new mongoose.Schema({
    name: String,
    date: Date,
    status: Boolean,
    plant: {
        ref: 'Plant',
        type:  mongoose.Schema.Types.ObjectId,
    },
})

let Reminders = mongoose.model('Reminders', remindersSchema)

module.exports = Reminders;