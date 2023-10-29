const mongoose = require('mongoose');

const waitListScheme = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },

}, { timestamps: true });

module.exports = mongoose.model('WaitList', waitListScheme);