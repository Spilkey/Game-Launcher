const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron')
const { shell } = require('electron');
const { dialog } = require('electron')


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
	var path = dialog.showOpenDialog({properties: ['openFile'], filters: [
		{name: 'Custom File Type', extensions: ['exe']},
	]});
	return path;
});

