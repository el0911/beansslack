/* eslint-disable no-underscore-dangle */
const { updateAppUser, findAppUser, findUser } = require('../../database/find_user');
const { generateToken, decodeToken } = require('../../utils/customFunc');
const { sendAnEmail } = require('../../utils/sendEmails');

const emailLoginAction = async ({ ack, body, say }) => {
  try {
    await ack();
    // get email
    const { value: email } = body.state.values.login_process.login_process_email_enter;

    // check for user
    // send mail
    const user = await findAppUser({ email });

    if (user) {
      const tempSlackToken = generateToken(user._id);
      sendAnEmail(email, 'sendingToken', { token: tempSlackToken, subject: 'Slack Login Token' });

      // if user exist send email
      await say(`Hey there <@${body.message.user}>!, sent a mail to  <@${email}> that contains ur login token`);

      // ask for token
      await say(
        {
          blocks: [
            {
              type: 'divider',
            },
            {
              type: 'input',
              element: {
                type: 'plain_text_input',
                action_id: 'login_process_token_enter',

              },
              block_id: 'login_process',
              label: {
                type: 'plain_text',
                text: 'A token was sent to your mail',
                emoji: true,
              },
            },
            {
              type: 'actions',
              block_id: 'login_process_token',
              elements: [
                {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: 'Login',
                    emoji: true,
                  },
                  value: 'email_login',
                  action_id: 'login_token_action',
                },
              ],
            },
          ],
        },
      );
    } else {
      // let users know email is wrong
      await say('Wrong email try the /login command again');
    }

    console.log({ user });
    // send mail
  } catch (error) {
    console.error(error);
  }
};

const loginTokenAction = async (payload) => {
  const { ack, body, say } = payload;
  try {
    await ack();

    const { value: token } = body.state.values.login_process.login_process_token_enter;
    const { id: slackBotUser } = body.user;
    const { user_id: userId, ...rest } = decodeToken(token);
    // update the user with slack objects
    const search = {
      'user.id': slackBotUser,
    };
    if (!body.is_enterprise_install) {
      // team instal
      search['team.id'] = body.team.id;
    } else {
      search['enterprise.id'] = body.enterprise.id;
    }
    const slack = await findUser(search);

    if (!slack) {
      throw new Error('No slack app');
    }

    const user = await updateAppUser({ _id: userId }, { slackBot: slack._id });

    if (!user) {
      await say('Wrong token  😔');
      return;
    }

    await say('Congrats , your all set up');

    // correct token save user access detail
  } catch (error) {
    await say('Invalid token 😔');
  }
};

module.exports = { emailLoginAction, loginTokenAction };
