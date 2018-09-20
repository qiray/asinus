
const {app, dialog, BrowserWindow} = require('electron');

//TODO: read https://github.com/crilleengvall/electron-tutorial-app
//TODO: add popup on new/open to prevent losing data
//TODO: add copyright
//TODO: add tutorial and help

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow () {
    global.shared = {appData : {}, currentFile : "", dataChanged : false};
    let common = require("./js/common.js");
    let settings = common.loadSettings();
    let windowParams = {
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        icon: "assets/donkey.png"
    };
    if (settings.saveCoords) {
        windowParams.width = settings.width;
        windowParams.height = settings.height;
        windowParams.x = settings.x;
        windowParams.y = settings.y;
    }
    win = new BrowserWindow(windowParams);
    //create global object named 'shared':
    global.shared.win = win;
    global.shared.settings = settings;
  
    win.loadFile('index.html'); //load html app
    // win.webContents.openDevTools();//enable devtools

    const locale = new (require("./js/locale.js"))();

    //before windows is closed
    win.on('close', function(e) {
        if (global.shared.dataChanged) {
            e.preventDefault() // Prevents the window from closing 
            dialog.showMessageBox({
                type: 'question',
                buttons: [locale.translate('popup', 'no'), locale.translate('popup', 'yes')],
                title: locale.translate('popup', 'confirm'),
                message: locale.translate('popup', 'unsaved_data_question')
            }, function (response) {
                if (response === 1) { // Runs the following if 'Yes' is clicked
                    global.shared.dataChanged = false
                    win.close()
                }
            })
        }

        common.updateBounds(global.shared.settings);
        common.saveSettings(global.shared.settings);
    });
    //when windows is closed
    win.on('closed', function(e) {
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
