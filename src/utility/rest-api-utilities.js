const ClashBotRestClient = require('clash-bot-rest-client');
const logger = require('./logger');

const client = () => {
  const url = process.env.SERVICE_URL ? process.env.SERVICE_URL : 'http://localhost:8080/api/v2';
  logger.info(`Using url ('${url}') for Rest Client.`);
  return new ClashBotRestClient.ApiClient(url);
};

module.exports = {
  client
};