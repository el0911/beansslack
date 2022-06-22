const model = require('./db');

const findUser = async (userSearch) => {
  try {
    const user = await model.User.findOne(userSearch);
    // return first user we find
    return user;
  } catch (error) {
    console.error(error);
  }
  return false;
};
/**
 * @descriptio finds the app user
 * @param {*} email
 * @returns
 */
const findAppUser = async (search, extra = {}) => {
  try {
    const user = model.appUser.findOne(search);
    if (extra.populate) {
      // a populate option was passed
      for (let i = 0; i < extra.populate.length; i += 1) {
        const element = extra.populate[i];
        user.populate(element);
      }
    }
    // return first user we find
    return await user;
  } catch (error) {
    console.error(error);
  }
  return false;
};

/**
 * @descriptio update the app user details
 * @param {*} email
 * @returns
 */
const updateAppUser = async (search, update) => {
  try {
    const user = await model.appUser.findOneAndUpdate(search, update);
    // return first user we find
    return user;
  } catch (error) {
    console.error(error);
  }
  return false;
};

const deleteUser = async (object) => {
  try {
    await model.User.deleteOne(object);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  findUser,
  deleteUser,
  findAppUser,
  updateAppUser,
};
