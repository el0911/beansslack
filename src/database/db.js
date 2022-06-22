const mongoose = require('mongoose');

const { Schema } = mongoose;

require('dotenv').config();

console.log(process.env.DB_PASSWORD);

const uri = `${process.env.DB_LINK}`;

const connect = async function () {
  // Connect to MongoDB
  mongoose.connect(
    uri,
    { useNewUrlParser: true, useUnifiedTopology: true },
  );
};

const usersSchema = mongoose.Schema(
  {
    team: { id: String, name: String },
    enterprise: { id: String, name: String },
    user: { token: String, scopes: [String], id: String },
    tokenType: String,
    isEnterpriseInstall: Boolean,
    appId: String,
    authVersion: String,
    token: String,
    bot: {
      scopes: [
        String,
      ],
      token: String,
      userId: String,
      id: String,
    },
  },

);

const User = mongoose.model('botusers', usersSchema);

const appUserSchema = mongoose.Schema(
  {
    // dont need much
    email: String,
    tempSlackToken: String,
    slackBot: { type: Schema.Types.ObjectId, ref: 'botusers' },

  },

);

const appUser = mongoose.model('users', appUserSchema);

module.exports = {
  User,
  appUser,
  connect,
};
