const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const domainRoute = require('./routes/domain')
const requestLoggerRoute = require('./routes/request_logger')
const clientLog = require('./routes/client_log')
const authenticateJWT = require('./middleware/middleware')

dotenv.config();


// for parsing application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// for parsing multipart/form-data
app.use(upload.any());

const PORT = 3000 || process.env.PORT;
app.use(express.static('public'));


(async () => {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
    console.log("DB connected");
    app.listen(PORT, async () => {
        console.log(`Server started at ${PORT}`);
    });
})();



// localhost:3000/6560c52b16b42187a3ef072e?route=api/settings?type=7
// localhost:3000/{domain_id}?route=api/settings?type=7
app.use('', requestLoggerRoute);


app.use('/api/log', authenticateJWT,  clientLog)

app.post('/client/domain', (req, res) => {
    console.log("register domain");
    const body = req.body;
    const domain = req.body.domain;
    console.log("domain ", domain);

    try {
        const collection = db.collection('org');


        collection.insertOne({
            domain: domain
        }).then((response) => {
            res.send(response);
        });
    }

    catch (e) {
        console.log("error ", e);
    }

})

app.use('/api/domain', authenticateJWT, domainRoute)

app.use('/api/client', authRoute)




