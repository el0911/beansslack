const { loginCallBack } = require('./commandController');

module.exports.register = (app) => {
  app.command('/login', loginCallBack);
};
