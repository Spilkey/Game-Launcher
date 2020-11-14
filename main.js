require('babel-register')({
	presets: ['env']
  });
  
import { app, BrowserWindow } from 'electron';
import { ipcMain } from 'electron';
import { shell } from 'electron';
import { dialog } from 'electron';

import fs from 'fs';
import ini from 'ini';

import PathsModel from './models/PathsModel';
import  GamesModel  from './models/GamesModel';

import Game from './models/Game';

import { settingsPath, desktopPath } from './middleware/paths';

import { resolve } from 'path';
import { rejects } from 'assert';

import { getFileProperties, WmicDataObject } from 'get-file-properties';
import iconExtractor from 'icon-extractor'

if (!fs.existsSync(settingsPath)) fs.mkdir(settingsPath, () => { });
if (!fs.existsSync(settingsPath + '\\images')) fs.mkdir(settingsPath + '\\images', () => { });

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



ipcMain.handle('game-icon-select', (event, args) => {
	return new Promise((resolve, reject) => {
		dialog.showOpenDialog({
			properties: ['openFile'],
			extensions: [
				{ name: 'Custom File Type', extensions: ['png, ico, jpg, jpeg'] },
			]
		}).then((fileObject) => {
			if(fileObject.filePaths.length > 0){
				resolve(fileObject.filePaths[0]);
			}	
		});
	});
});

ipcMain.handle('game-file-select', (event, args) => {

	return new Promise((resolve, reject) => {
		dialog.showOpenDialog({
			properties: ['openFile'],
			extensions: [
				{ name: 'Custom File Type', extensions: ['exe'] },
			]
		}).then((data) => {
			if(data.filePaths.length > 0){
				let file =  data.filePaths[0];
				const fileMetaData = getFileProperties(file);
				fileMetaData.then((metaData) => {
					iconExtractor.emitter.on('icon', (data) => {
						let icon = data.Base64ImageData;
						let fileName = metaData.FileName;
						let iconPath = `${settingsPath}\\images\\${fileName}.png`
						fs.writeFile(iconPath, icon, 'base64', (err) => {
							console.log(err);
						});
						let returnData = {
							'gamePath': file,
							'iconPath': iconPath,
							'gameName': fileName
						}
						resolve(returnData);
					});
					iconExtractor.getIcon('game-image',file);
				});
			}
		});
	});
	
});

ipcMain.handle('add-game', (event, args) => {

});

ipcMain.handle('games-page', (event, args) => {
	return new Promise((resolve, reject) => {
		try{
			let gameModel = new GamesModel();
			fs.promises.readdir(desktopPath).then((files, err) => {
				if (err) {
					console.error("Could not list the directory.", err);
				} else {
					gameModel.getAllGameNames().then((data) => {
						let dataList = data.map(element => element.name);
						files.forEach(function (file, index) {
							if (file.endsWith('.url')) {
								const fileMetaData = getFileProperties(desktopPath + "\\" + file);
								fileMetaData.then((metaData) => {
									let fileIni = ini.parse(fs.readFileSync(metaData.EightDotThreeFileName, 'utf-8'));
									let url = fileIni['InternetShortcut']['URL'];
									let name = metaData.FileName;
									let icon = fileIni['InternetShortcut']['IconFile'];
										
									if(dataList.indexOf(name) == -1) {
										let game = new Game(name, url, icon);
										gameModel.insertGame(game);
									}
								});
							}
						});
					});
				}
			});
			gameModel.getAllGames().then((data, err) => {
				if(err){
					reject(err);
				}
				resolve(data);
			});
		}catch(e){
			reject(e);
		}
	});
});



