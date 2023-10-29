const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Client = require('../model/Client');
const WaitList = require('../model/WaitList');


router.post('/waitlist', async (req, res) => {
    const emailExists = await WaitList.findOne({ email: req.body.email });
    if (emailExists) return res.json({
        'message' : '👋 Hello! It seems your email is already registered with us.'
    });


    try {
        const waitList = new WaitList({
            email: req.body.email,
        });
        const savedWaitList = await waitList.save();
        res.send(savedWaitList);
    }
    catch (err) {
        res.send(err);
    }

})



router.post('/register', async (req, res) => {
    const emailExists = await Client.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send('Email already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const client = new Client({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedClient = await client.save();
        res.send(savedClient);
    }
    catch (err) {
        res.status(400).send(err);
    }

});



router.post('/login', async (req, res) => {
    const client = await Client.findOne({ email: req.body.email });
    if (!client) return res.status(400).send('Email or password is incorrect');

    const validPassword = await bcrypt.compare(req.body.password, client.password);
    if (!validPassword) return res.status(400).send('Email or password is incorrect');

    const token = jwt.sign({ _id: client._id }, process.env.TOKEN_SECRET);
    // res.header('auth-token', token).send(token);
    return res.send(token);
})


module.exports = router;