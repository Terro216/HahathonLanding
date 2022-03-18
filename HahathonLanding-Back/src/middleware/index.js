const fetch = require('node-fetch');

const reCaptchaSecret = require('../config').reCaptchaSecret;

module.exports = {
  requests: {
    create: async (req, res, next) => {
      let error = '';

      if (!req.body.captainName) {
        error = 'No captain name';
      } else if (!req.body.captainEmail) {
        error = 'No captain email';
      } else if (!req.body.captainTg) {
        error = 'No captain telegram';
      } else if (!req.body.captainAge) {
        error = 'No captain age';
      } else if (!req.body.member2) {
        error = 'No other members';
      } else if (!req.body.track) {
        error = 'No track';
      } else if (!req.body.recaptcha) {
        error = 'Not approved';
      } else {
        try {
          const reCaptchaResp = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${reCaptchaSecret}&response=${req.body.recaptcha}`, {
            method: 'POST'
          });

          const body = await reCaptchaResp.json()
          console.log('ReCaptchaScore: ' + body.score);
          if (!body.success || body.score < 0.5) {
            error = 'Not approved';
          }
        } catch (e) {
          console.log(e);
          error = e;
        }
      }

      if (error) {
        res.status(400);
        res.send({ message: error});
      } else {
        req.payload = {
          cName: req.body.captainName,
          cEmail: req.body.captainEmail,
          cTg: req.body.captainTg,
          cAge: req.body.captainAge,
          m2: req.body.member2,
          m3: req.body.member3,
          m4: req.body.member4,
          university: req.body.university,
          track: req.body.track
        }

        next();
      }
    }
  }
}
