const router = require('express').Router();
const { ObjectId } = require("mongodb");
const Domain = require('../model/Domain')
const RequestLogger = require('../model/RequestLogger')
const axios = require('axios');



router.all('/:domain_id/:client_id', async (req, res) => {
    const params = req.params;
    const queryParam = req.query;
    const files = req.files;
    const method = req.method
    const body = req.body;


    // const url = map.get(params.domain);
    let url;
    await Domain.findOne({ "_id": new ObjectId(params.domain_id) }).then((response) => {
        console.log("response", response);
        url = response.domain;
    });
    console.log("url is ", url);


    const hostname = url.split('//')[1].replaceAll('/', '');

    const passHeader = { ...req.headers, 'host': hostname }




    const headers = {}
    for (let key in passHeader) {
        if (passHeader.hasOwnProperty(key)) {
            if (key == 'content-length') continue;
            const value = passHeader[key];
            console.log("key ", key, value)
            headers[key] = value;
        }
    }
    const logData = {};

    let fetchUrl = `${url}${queryParam.route}`;
    logData['requestUrl'] = fetchUrl;
    logData['requestMethod'] = method;
    logData['requestHeaders'] = headers;
    logData['requestBody'] = body;
    logData['requestTime'] = new Date().getTime();


    if (method == 'POST') {
        axios.post(fetchUrl, body, { headers })
            .then(async response => {
                try {
                    logData['response'] = response.data;
                    const log = new RequestLogger({
                        client: params.client_id,
                        domain_id: params.domain_id,
                        data: logData
                    });
                    await log.save();
                } catch (error) {
                    console.log("exception: ", error)
                }
                res.end(response.data)
            })
            .catch(error => {
                res.end(error)
            });
    }
    else {
        axios.get(fetchUrl, { headers })
            .then(async response => {
                try {
                    logData['response'] = response.data;
                    const log = new RequestLogger({
                        client: params.client_id,
                        domain_id: params.domain_id,
                        data: logData
                    });
                    await log.save();
                } catch (error) {
                    console.log("exception: ", error)
                }
                res.send(response.data)
            })
            .catch(error => {
                res.json({
                    'status': 1,
                    'msg': error
                })
            });

    }
});


module.exports = router;