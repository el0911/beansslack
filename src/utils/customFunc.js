const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const token = jwt.sign(
    // eslint-disable-next-line no-underscore-dangle
    { user_id: user._id },
    process.env.TOKEN_KEY,
    {
      expiresIn: 60000,
    },
  );

  return token;
};

const decodeToken = (token) => {
  try {
    return jwt.verify(token, process.env.TOKEN_KEY);
  } catch (err) {
    throw new Error('Cant verify token');
  }
};

module.exports = {
  generateToken,
  decodeToken,
};
