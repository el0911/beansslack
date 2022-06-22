/** *
 * @description login controller
 */
const loginCallBack = async ({ ack, say, ...rest }) => {
  try {
    // await ack();

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
              action_id: 'login_process_email_enter',

            },
            block_id: 'login_process',
            label: {
              type: 'plain_text',
              text: `Hi <@${rest.body.user_name}>!, What's Your BeansIo Email`,
              emoji: true,
            },
          },
          {
            type: 'actions',
            block_id: 'login_process_email',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Confirm',
                  emoji: true,
                },
                value: 'email_login',
                action_id: 'email_login_action',
              },
            ],
          },
        ],
      },
    );
  } catch (error) {
    console.error(error);
  }
};

module.exports = { loginCallBack };
