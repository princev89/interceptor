const router = require('express').Router();
const Domain = require('../model/Domain');


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


module.exports = router;