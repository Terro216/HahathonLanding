const morgan = require('morgan');
const cors = require('cors');
const express = require('express');

const apiPrefix = require('../config').apiPrefix;

module.exports = async (app) => {
  app.use(morgan('common'));

  app.use(express.static(__basedir + '/static'));
  console.log('  Looking for static files at: ' + __basedir + '/static');

  app.get(apiPrefix, ((req, res) => {
    res.send({ status: 'Working' }).status(200);
  }));

  app.enable('trust proxy');
  app.use(cors());

  console.log('+ Express loaded');
}
