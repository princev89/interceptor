const mongoose = require('mongoose');

const requestLoggerScheme = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
    },
    domain_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Domain',
    },
    data: {
        type: Object,
    },
}, { timestamps: true });

module.exports = mongoose.model('RequestLogger', requestLoggerScheme);