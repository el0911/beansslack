// const fsPromises = require('fs').promises;
const formData = require('form-data');
// const path = require('path');
const Mail = require('mailgun.js');
const { templatIntoLayouteMail } = require('../notificationText');

// gotten emails send
// const filepath = path.join(__dirname, '../notificationText/images/banner.png');

const mailgun = new Mail(formData);

const MAILINSTANCE = mailgun.client({ username: 'Bsnaija', key: process.env.MAIL_API_KEY || 'key-68596f4495384e353965c584ad1d6fec' });

const sendAnEmail = async (emailAddress, mailTemplate, messageData) => {
  // const firstFile = {
  //   filename: 'banner.png',
  //   data: await fsPromises.readFile(filepath),
  // };

  MAILINSTANCE.messages.create('beansIO.app', {
    from: `${'El@beansIO.app'}`,
    to: [emailAddress],
    subject: messageData.subject,
    html: templatIntoLayouteMail(mailTemplate, messageData),
    // inline: [firstFile],
  }).then((msg) => {
    console.log(msg);
  }) // logs response data
    .catch((err) => {
      console.log(err);
    }); // logs any error
};

module.exports = {
  sendAnEmail,
};

// sendEmailList()
