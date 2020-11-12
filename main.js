const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron');
const { shell } = require('electron');
const { dialog } = require('electron');
const fs = require('fs');
const { pathsModel } = require('./models/PathsModel')

const { settingsPath } = require('./middleware/paths')
if (!fs.existsSync(settingsPath)) fs.mkdir(settingsPath, () => { });


function createWindow() {
	const win = new BrowserWindow({
		width: 1920,
		height: 1080,
		webPreferences: {
			nodeIntegration: true
		}
	})

	win.loadFile('./views/index.html')
	win.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
});

ipcMain.handle('add-game', (event, args) => {
	var path = dialog.showOpenDialog({
		properties: ['openFile'],
		filters: [
			{ name: 'Custom File Type', extensions: ['exe'] },
		]
	});

	return path;
});

ipcMain.handle('add-path', (event, args) => {
	var path = dialog.showOpenDialog({
		properties: ['openDirectory']
	})
	path.then((path) => {
		if(path.filePaths.length > 0){
			try {
				pathsModel.insertPath(path.filePaths[0]);
			} catch (e) {
				console.error(e);
			}
		}
	});

	return path;
});

ipcMain.handle('games-page', (event, args) => {
	var paths = pathsModel.getPaths();
	paths.then((data) => {
		console.log(data);
	});
	return paths;
});



