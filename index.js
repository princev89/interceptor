const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const app = express();
const axios = require('axios');
const { MongoClient, ObjectId } = require("mongodb");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const domainRoute = require('./routes/domain')
const authenticateJWT = require('./middleware/middleware')

dotenv.config();



// for parsing application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// for parsing multipart/form-data
app.use(upload.any());



const PORT = 3000 || process.env.PORT;







function insertLog(collectionName, log) {
    const collection = db.collection(collectionName);
    collection.insertOne(log);
}


let db;




// localhost:3000/checkdomain?route=api/login
app.all('/:domain', async function (req, res) {
    const params = req.params;
    const queryParam = req.query;
    const files = req.files;
    const method = req.method
    const body = req.body;


    // const url = map.get(params.domain);
    let url;
    const collection = db.collection('org');
    await collection.findOne({ "_id": new ObjectId(params.domain) }).then((response) => {
        console.log("response", response);
        url = response.domain;
    });

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
    const collectionName = `${params.domain}`;

    let apiResponse;

    if (method == 'POST') {
        axios.post(fetchUrl, body, { headers })
            .then(response => {
                res.send(response.data)
                logData['responseData'] = response.data;
                insertLog(collectionName, logData)
            })
            .catch(error => {
                res.send(error)
            });
    }
    else {
        axios.get(fetchUrl, { headers })
            .then(response => {
                res.send(response.data)
                logData['responseData'] = response.data;
                insertLog(collectionName, logData)
            })
            .catch(error => {
                res.send(error)
            });
    }

}
);


// app.post('/client/domain', (req, res) => {
//     console.log("register domain");
//     const body = req.body;
//     const domain = req.body.domain;
//     console.log("domain ", domain);

//     try {
//         const collection = db.collection('org');


//         collection.insertOne({
//             domain: domain
//         }).then((response) => {
//             res.send(response);
//         });
//     }

//     catch (e) {
//         console.log("error ", e);
//     }

// })


app.use('/api/domain',authenticateJWT, domainRoute)

app.use('/api/client', authRoute)



app.listen(PORT, async () => {
    console.log(`server started at ${PORT}`);
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
    console.log("Db connected");

});