const { emailLoginAction, loginTokenAction } = require('./sample-action');

module.exports.register = (app) => {
  app.action('email_login_action', emailLoginAction);
  app.action('login_token_action', loginTokenAction);
};
