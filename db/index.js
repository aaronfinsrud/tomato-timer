const mongoose = require('mongoose');

const developmentDBURI = 'mongodb://localhost/pomodoroClock';

mongoose.connect(
  encodeURI(developmentDBURI)
);

const userSettingsSchema = mongoose.Schema({
  sessionID: String,
  breakLength: Number,
  sessionLength: Number,
  rewardType: String,
});

const userSettings = mongoose.model('UserSettings', userSettingsSchema);

const updateOrAddSettings = (sessionID, settings) => userSettings.findOneAndUpdate(
  { sessionID },
  settings,
  { upsert: true },
);

const retrieveSettings = (sessionID) => userSettings.findOne({ sessionID }).exec();

module.exports = { updateOrAddSettings, retrieveSettings };
