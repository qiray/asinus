
const {app, Menu, BrowserWindow} = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow () {
    // Создаёт окно браузера.
    win = new BrowserWindow({width: 800, height: 600});

    //Add menu:
    const menuJS = require('./js/menu.js');
    const menu = Menu.buildFromTemplate(menuJS.template);
    Menu.setApplicationMenu(menu);
  
    win.loadFile('index.html'); //load html app
  
    //when windows is closed
    win.on('closed', () => {
        win = null; //delete window
    });

    //window finished all load -> show name and version in title
    win.webContents.on('did-finish-load', () => {
        let name = require('./package.json').name;
        let version = require('./package.json').version;
        win.setTitle(name + " " + version);
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
