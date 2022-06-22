const { appHomeOpenedCallback } = require('./app-home-opened');

module.exports.register = (app) => {
  app.event('channel_deleted', appHomeOpenedCallback);
};
