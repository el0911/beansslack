const { Templates } = require('./templates');

const fillTmplatteUpWithData = (mailTemplate, data) => {
  let template = Templates[mailTemplate];
  if (!template) {
    throw new Error('Issues creating mail template');
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

  /// add the data
  const list = Object.keys(data);
  list.forEach((text) => {
    template = template.replace(new RegExp(escapeRegExp(`////*/${text}/*///`), 'g'), data[`${text}`]); /// / replace seamed beest for this part
  });

  return template;
};

/**
 * @description this function takes the template beng passed and
 * appensds it to the layout template while attaching dynamic variables passed into the function
 * @param mailTemplate layout file name
 * @param data data passed
 * @returns
 */
const templatIntoLayouteMail = (
  mailTemplate,
  data,
) => {
  try {
    const emailTemplate = fillTmplatteUpWithData(mailTemplate, data);

    const layoutTemplate = fillTmplatteUpWithData('layout', {});

    const template = layoutTemplate.replace('////*/emailTemplate/*///', emailTemplate); /// / replace seamed beest for this part

    return template;
  } catch (error) {
    console.log(error);
    throw new Error('Issues creating mail template');
  }
};

module.exports = {
  fillTmplatteUpWithData,
  templatIntoLayouteMail,
};
