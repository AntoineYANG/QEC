/*
 * @Author: Kanata You 
 * @Date: 2020-10-21 18:57:20 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-10-21 23:51:21
 */

const { app, BrowserWindow } = require('electron');


var win;


function createWindow() {
    win = new BrowserWindow({
        title: "Zone",
        width: 900,
        height: 640,
        minWidth: 900,
        minHeight: 640,
        frame: false,
        backgroundColor: "rgb(0,14,17)",
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadFile('index.html');
    win.webContents.openDevTools();
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});


app.whenReady().then(createWindow);
