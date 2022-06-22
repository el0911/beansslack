const appHomeOpenedCallback = async ({ client, event }) => {
  // Ignore the `app_home_opened` event for anything but the Home tab

  console.dir({ event, client }, { depth: null });
};

module.exports = { appHomeOpenedCallback };
