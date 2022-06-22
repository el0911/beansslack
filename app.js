require('dotenv').config();

const { App, LogLevel, ExpressReceiver } = require('@slack/bolt');
const bodyParser = require('body-parser');
const { registerListeners } = require('./src/listeners');
const orgAuth = require('./src/database/auth/store_user_org_install');
const workspaceAuth = require('./src/database/auth/store_user_workspace_install');
const db = require('./src/database/db');
const dbQuery = require('./src/database/find_user');
const customRoutes = require('./src/utils/custom_routes');
const { sendText } = require('./src/utils/slackFunc');
// const { decodeToken } = require('./src/utils/customFunc');
// WebClient instantiates a client that can call API methods
// When using Bolt, you can use either `app.client` or the `client` passed to listeners.

// ID of the channel you want to send the message to
// const receiver = new ExpressReceiver({
//   signingSecret: process.env.SLACK_SIGNING_SECRET,
// });
let app = false;
// receiver.router.use(bodyParser.urlencoded({ extended: true }));
// receiver.router.use(bodyParser.json());

// receiver.router.post('/slack/error/notify', async (req, res) => {
//   try {
//     const { auth } = req.body;
//     // VALIDATE AUTH
//     const { user_id } = decodeToken(auth);

//     ///
//     // FIND USER DETAILS AND VALIDATE
//     const user = await dbQuery.findAppUser({ _id: user_id }, {
//       populate: [
//         'slackBot',
//       ],
//     });

//     if (!user) {
//       throw new Error('NO USER');
//     }

//     ///
//     /// GET USER DETAILS AND SEND ERROR
//     const { slackBot } = user;
//     console.log({ slackBot });

//     sendError(slackBot.user.id, slackBot.token, user.email, req.body);
//     res.end(
//       'true',
//     );
//   } catch (error) {
//     console.log(error);
//     res.end('false');
//   }
// });

app = new App({
  logLevel: LogLevel.DEBUG,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: 'horea-is-a-human',
  socketMode: true,
  port: process.env.PORT || 3000,
  appToken: process.env.SLACK_APP_TOKEN,
  customRoutes: customRoutes.customRoutes,
  installerOptions: {
    stateVerification: false,
  },
  installationStore: {
    storeInstallation: async (installation) => {
      console.log(`installation: ${installation}`);
      console.log(installation);
      try {
        if (
          installation.isEnterpriseInstall
          && installation.enterprise !== undefined
        ) {
          sendText(installation.user.id, installation.bot.token || installation.user.token, { text: 'Welcome to BeansIo, to login type the /login command to set up' });
          return orgAuth.saveUserOrgInstall(installation);
        }
        if (installation.team !== undefined) {
          console.log('adding first text');
          sendText(installation.user.id, installation.bot.token || installation.user.token, { text: 'Welcome to BeansIo, to login type the /login command to set up' });

          return workspaceAuth.saveUserWorkspaceInstall(installation);
        }
      } catch (error) {
        console.log(error);
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
        return dbQuery.findUser({
          'enterprise.id': installQuery.enterpriseId,
        });
      }
      if (installQuery.teamId !== undefined) {
        return dbQuery.findUser({
          'team.id': installQuery.teamId,
        });
      }
      throw new Error('Failed fetching installation');
    },
    deleteInstallation: async (installQuery) => {
      console.log(`delete query: ${installQuery}`);

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

/** Register Listeners */
registerListeners(app);

/** Start Bolt App */
(async () => {
  try {
    console.log(process.env, process.env.PORT);
    await app.start();

    console.log('⚡️ Bolt app is running! ⚡️');
    db.connect();
    console.log('DB is connected.');
  } catch (error) {
    console.error('Unable to start App', error);
  }
})();
