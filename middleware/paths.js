import { app } from 'electron';

const documentPath = app.getPath('documents');
const desktopPath = app.getPath('desktop');
const settingsPath = `${documentPath}\\gamelauncher`;

export { documentPath, settingsPath, desktopPath };