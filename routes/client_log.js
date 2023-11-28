const router = require('express').Router();
const RequestLogger = require('../model/RequestLogger');
const { ObjectId } = require("mongodb");


router.get('/:domain_id', async (req, res) => {
    const params = req.params;
    const clientLogs = await RequestLogger.find({
        "client": new ObjectId(req.client._id),
        "domain_id": new ObjectId(params.domain_id),
    });
    res.send({
        'status' : 0,
        'data': clientLogs
    })

})

module.exports = router;