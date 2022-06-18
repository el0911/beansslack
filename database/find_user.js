const model = require('./db');

const findUser = async (id) => {
  try {
    const user = await model.User.findOne({ 'team.id': id });
    // return first user we find
    console.log({ user });
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
};
