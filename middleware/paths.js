const { app } = require('electron')

const documentPath = app.getPath('documents');
const settingsPath = `${documentPath}\\gamelauncher`;

exports.documentPath = documentPath;
exports.settingsPath = settingsPath;