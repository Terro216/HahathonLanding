const morgan = require('morgan');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const apiPrefix = require('../config').apiPrefix;
const api = require('../api');

module.exports = async (app) => {
  app.use(morgan('common'));

  // Cache-control
  app.use((req, res, next) => {
    if (req.url.indexOf('/api') === -1) {
      res.set('Cache-control', 'public, max-age=300');
    }

    next();
  });

  app.use(express.static(__basedir + '/static'));
  console.log('  Looking for static files at: ' + __basedir + '/static');

  app.get(apiPrefix, ((req, res) => {
    res.send({ status: 'Working' }).status(200);
  }));

  app.enable('trust proxy');
  app.use(cors());

  app.use(bodyParser.json());
  app.use(apiPrefix, api());  // Adds routing

  app.use((req, res, next) => {
    res.redirect('/');
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500);
    res.json({
      success: false,
      message: err.message
    });
  });

  console.log('+ Express loaded');
}
