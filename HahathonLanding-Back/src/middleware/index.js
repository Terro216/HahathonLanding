module.exports = {
  requests: {
    create: (req, res, next) => {
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
      }

      if (error) {
        res.send({ message: error}).sendStatus(400);
      } else {
        req.payload = {
          cName: req.body.captainName,
          cEmail: req.body.captainEmail,
          cTg: req.body.captainTg,
          cAge: req.body.captainAge,
          m2: req.body.member2,
          m3: req.body.member3,
          m4: req.body.member4
        }

        next();
      }
    }
  }
}
