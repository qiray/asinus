
const {app, Menu, BrowserWindow} = require('electron');

//TODO: read https://github.com/crilleengvall/electron-tutorial-app

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow () {
    win = new BrowserWindow({width: 800, height: 600});
    global.shared = {appData : {}}; //create global object named 'shared'
  
    win.loadFile('index.html'); //load html app
    win.webContents.openDevTools();//enable devtools
  
    //when windows is closed
    win.on('closed', () => {
        win = null; //delete window
    });

    //window finished all load -> show name and version in title
    win.webContents.on('did-finish-load', () => {
        let package = require('./package.json');
        win.setTitle(package.name + " " + package.version);
    });
}

//Init is complete. Electron is ready to create windows.
app.on('ready', createWindow);
  
//When all windows are closed
app.on('window-all-closed', () => {
    // hack for macOS - quit app when all windows are closed
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
  
app.on('activate', () => {
    // hack for macOS
    if (win === null) {
        createWindow();
    }
});
