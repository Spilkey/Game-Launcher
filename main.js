require('babel-register')({
	presets: ['env']
  });
  
import { app, BrowserWindow } from 'electron';
import { ipcMain } from 'electron';
import { shell } from 'electron';
import { dialog } from 'electron';

import fs from 'fs';
import ini from 'ini';

import { pathsModel } from './models/PathsModel';
import  { gamesModel } from './models/GamesModel';

import Game from './models/Game';


import { settingsPath, desktopPath } from './middleware/paths';

import { resolve } from 'path';
import { rejects } from 'assert';

import { getFileProperties, WmicDataObject } from 'get-file-properties';

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

ipcMain.handle('games-page', (event, args) => {

	// Loop through all the files in the temp directory
	fs.promises.readdir(desktopPath).then((files, err) => {
		if (err) {
			console.error("Could not list the directory.", err);
		} else {
			files.forEach(function (file, index) {
				if (file.endsWith('.url')) {
					const fileMetaData = getFileProperties(desktopPath + "\\" + file);
					fileMetaData.then((metaData) => {
						// console.log(metaData);
						// console.log(metaData.EightDotThreeFileName);
						let fileIni = ini.parse(fs.readFileSync(metaData.EightDotThreeFileName, 'utf-8'));
						let url = fileIni['InternetShortcut']['URL'];
						let name = metaData.FileName;
						let icon = fileIni['InternetShortcut']['IconFile'];

						console.log(fileIni);
						console.log(url);
						console.log(name);
						console.log(icon);

						let game = new Game(name, url, icon);

						// gamesModel.insertGame(game);
					});
					// pathsModel.insertPath();
				}
			});
		}
	});
});



