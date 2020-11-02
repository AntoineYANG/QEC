/*
 * @Author: Kanata You 
 * @Date: 2020-10-21 18:57:20 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2020-11-02 14:59:25
 */

const { app, BrowserWindow, ipcMain } = require('electron');


let mainWindow = null;


const createMainWindow = () => {
    if (mainWindow) {
        mainWindow.show();
        return;
    }

    mainWindow = new BrowserWindow({
        title: "Zone",
        width: 900,
        height: 640,
        minWidth: 900,
        minHeight: 640,
        frame: false,
        backgroundColor: "rgb(0,14,17)",
        webPreferences: {
            // devTools: false,
            nodeIntegration: true
        }
    });

    mainWindow.loadFile('index.html');
    mainWindow.webContents.openDevTools();

    ipcMain.on("synchronous-message", (event, arg) => {
        if (arg === "close") {
            mainWindow.close();
        }
        event.returnValue = arg;
    });
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


app.whenReady().then(createMainWindow);


module.exports.createMainWindow = createMainWindow;
