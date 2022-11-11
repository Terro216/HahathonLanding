const Router = require('express').Router;

const requestsApi = require('./requests');

module.exports = () => {
  const api = new Router();

  requestsApi(api);

  return api;
}
