const Router = require('express').Router;

const sheetsService = require('../sevices/sheetsService');
const validators = require('../middleware').requests;

const router = new Router();

router.post('/create', validators.create, async (req, res) => {
  try {
    await sheetsService.addTeam(req.payload);
  } catch (e) {
    console.log(e);
  }

  res.sendStatus(200).send();
});


router.get('/confirm', async (req, res) => {
  try {
    await sheetsService.confirm(req.query.raw);
  } catch (e) {
    console.log(e);
  }

  res.sendStatus(200).send();
});

module.exports = (api) => {
  api.use('/requests', router);

  console.log('+ + Requests API');
}
