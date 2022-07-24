const { WebClient } = require('@slack/web-api');
const { LogLevel } = require('@slack/bolt');
const { sendAnEmail } = require('./sendEmails');

/**
 * @description  send text
 * @param {*} userId
 */
const sendText = (channelId, token, object) => {
  /// send an intro message
  try {
    const client = new WebClient(token, {
      logLevel: LogLevel.DEBUG,
    });

    client.chat.postMessage({
      channel: channelId,
      ...object,
    }).then(() => {

    });
  } catch (error) {
    console.dir(error);
  }
};

/**
 * @description  sends error to the user
 * @param {*} userId
 */
const sendError = (channelId, token, email, data) => {
  try {
    // slack send
    sendText(channelId, token, {
      blocks: [

        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*<https://beansio.app/app/${data.appId}|${data.topic}>*`,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Project:*\n${data.project}`,
            },
            {
              type: 'mrkdwn',
              text: `*Plaform:*\n ${data.platform}`,
            },
            {
              type: 'mrkdwn',
              text: `*Time:*\n${data.createdAt} `,
            },
            {
              type: 'mrkdwn',
              text: `*User:*\n${data.user || 'No user '}.`,
            },
            {
              type: 'mrkdwn',
              text: `*File:*\n"${data.file}"`,
            },
          ],
        },
        {
          type: 'divider',
        },
      ],
    });

    const stack = (data.error || '').split(/\r?\n/).map((text, i) => (i !== 0 ? `<p>${i})  ${text}</p>` : ''));

    // email send
    sendAnEmail(email, 'sendinErrorNotification', { subject: 'We found a bug', errorTitle: data.name || 'Error', error: stack || ' <p> 1) at Error</p>', appName: data.appName || 'App' });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  sendText,
  sendError,
};
