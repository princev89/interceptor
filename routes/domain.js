const router = require('express').Router();
const Domain = require('../model/Domain');

//register domain
router.post('/', async (req, res) => {

  const clientId = req.client._id;
  const domainUrl = req.body.domain;

  try {
    const domain = new Domain({
      domain: domainUrl,
      client: clientId,
    });
    const result = await domain.save();
    return res.send(result);
  }
  catch (e) {
    console.log("error ", e);
    return res.status(400).send(e);
  }

})

///List all registered domain of client
router.get('/list', async (req, res) => {
  const clientId = req.client._id;
  const domains = await Domain.find({ client: clientId });
  return res.json({
    'status' : 0,
    'data' : domains
  });
})

module.exports = router;