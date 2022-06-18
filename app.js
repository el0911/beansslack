require('dotenv').config();

const { App, LogLevel } = require('@slack/bolt');
const { registerListeners } = require('./listeners');
const orgAuth = require('./database/auth/store_user_org_install');
const workspaceAuth = require('./database/auth/store_user_workspace_install');
const db = require('./database/db');
const dbQuery = require('./database/find_user');
const customRoutes = require('./utils/custom_routes');

let app = false;
/**
 * @description  send text
 * @param {*} userId
 */
const sendText = (userId, token, text) => {
  /// send an intro message
  app.client.chat.postMessage({
    // The token you used to initialize your app
    token,
    channel: userId,
    text,
  });
};

app = new App({
  logLevel: LogLevel.DEBUG,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: 'horea-is-a-human',
  socketMode: true,

  appToken: process.env.SLACK_APP_TOKEN,
  customRoutes: customRoutes.customRoutes,
  installerOptions: {
    stateVerification: false,
  },
  installationStore: {
    storeInstallation: async (installation) => {
      console.log(`installation: ${installation}`);
      console.log(installation);
      if (
        installation.isEnterpriseInstall
        && installation.enterprise !== undefined
      ) {
        sendText(installation.user.id, installation.user.token, 'Welcome to BeansIo, to login type your mail here');
        return orgAuth.saveUserOrgInstall(installation);
      }
      if (installation.team !== undefined) {
        sendText(installation.user.id, installation.user.token, 'Welcome to BeansIo, to login type your mail here');

        return workspaceAuth.saveUserWorkspaceInstall(installation);
      }
      // Todo handle duplicates
      throw new Error('Failed saving installation data to installationStore');
    },
    fetchInstallation: async (installQuery) => {
      console.log(`installQuery: ${installQuery}`);
      console.log(installQuery);
      if (
        installQuery.isEnterpriseInstall
        && installQuery.enterpriseId !== undefined
      ) {
        return dbQuery.findUser(installQuery.enterpriseId);
      }
      if (installQuery.teamId !== undefined) {
        return dbQuery.findUser(installQuery.teamId);
      }
      throw new Error('Failed fetching installation');
    },
    deleteInstallation: async (installQuery) => {
      // change the lines below so they delete from your database
      if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
        // org wide app installation deletion
        return dbQuery.deleteUser({
          'enterprise.id': installQuery.enterpriseId,
        });
      }
      if (installQuery.teamId !== undefined) {
        // single team app installation deletion
        return dbQuery.deleteUser({
          'team.id': installQuery.teamId,
        });
      }
      throw new Error('Failed to delete installation');
    },
  },
});

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say, ...rest }) => {
  console.log(rest);
  // say() sends a message to the channel where the event was triggered
  await say(`Hey there <@${message.user}>!`);
});

/** Register Listeners */
registerListeners(app);

/** Start Bolt App */
(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    console.log('⚡️ Bolt app is running! ⚡️');
    db.connect();
    console.log('DB is connected.');
  } catch (error) {
    console.error('Unable to start App', error);
  }
})();
