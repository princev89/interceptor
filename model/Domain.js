const mongoose = require('mongoose');

const domainScheme = new mongoose.Schema({

    domain: {
        type: String,
        required: true,
        max: 255,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
    }

}, { timestamps: true });

module.exports = mongoose.model('Domain', domainScheme);