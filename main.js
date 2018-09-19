
const {app, Menu, BrowserWindow} = require('electron');

//TODO: read https://github.com/crilleengvall/electron-tutorial-app
//TODO: add save option, add popup on new/open to prevent losing data
//TODO: add copyright
//TODO: add tutorial and help
//TODO: save windows size with position

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow () {
    let common = require("./js/common.js");
    let settings = common.loadSettings();
    if (settings.saveCoords) {
        win = new BrowserWindow({
            width: settings.width,
            height: settings.height,
            minWidth: 800,
            minHeight: 600,
            x: settings.x,
            y: settings.y,
            icon: "assets/donkey.png"
        });
    } else {
        win = new BrowserWindow({
            width: 800,
            height: 600,
            minWidth: 800,
            minHeight: 600,
            icon: "assets/donkey.png"
        });
    }
    global.shared = {appData : {}, win : win, settings : settings}; //create global object named 'shared'
  
    win.loadFile('index.html'); //load html app
    // win.webContents.openDevTools();//enable devtools

    //when windows is closed
    win.on('closed', () => {
        // common.saveSettings(); //TODO: save settings
        win = null; //delete window
    });

    //window finished all load -> show name and version in title
    win.webContents.on('did-finish-load', () => {
        let package = require('./package.json');
        win.setTitle(package.name + " " + package.version);
        const ipc = require('electron').ipcMain;
        ipc.on('save_message', (event, message) => {
            win.webContents.send('messageFromMain', message);
        });
    });
}

//Init is complete. Electron is ready to create windows.
app.on('ready', createWindow);
  
//When all windows are closed
app.on('window-all-closed', () => {
    //quit app when all windows are closed
    app.quit();
});
  
app.on('activate', () => {
    // hack for macOS
    if (win === null) {
        createWindow();
    }
});
