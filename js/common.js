
let appData = require("./appdata.js");

let ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let settingsFileName = "settings.json";

let mainProcess = true;
let settingsWindow = null;
let aboutWindow = null;
let licenseWindow = null;
let helpWindow = null;

if (global.shared === undefined) {
    mainProcess = false; //renderer process
}

function generate(length) {
    //generate random sequence
    var result = '';
    for (var i = 0; i < length; i++) {
        result += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return result;
}

function saveFileDialog() {
    let {dialog} = require('electron');
    if (!mainProcess)
        dialog = require('electron').remote.dialog;
    dialog.showSaveDialog(
        { 
            filters: [
                {name: 'JSON', extensions: ['json']}
            ]
        }, 
        function (fileName) {
            if (fileName === undefined)
                return;
            saveData(fileName);
        }
    ); 
}

function saveDataFile() {
    let currentFile = getCurrentFile();
    if (currentFile === "") {
        saveFileDialog();
    } else {
        saveData(currentFile);
    }
}

function saveData(fileName) {
    let index = require("./index.js");
    index.saveAll();
    let data = {};
    if (mainProcess)
        data = global.shared.appData; //get appData from global scope
    else
        data = require('electron').remote.getGlobal('shared').appData;
    saveFile(fileName, JSON.stringify(data));
    setCurrentFile(fileName);
    setDataChangedValue(false);
}

function saveFile(fileName, data) {
    let fs = require('fs');
    fs.writeFileSync(fileName, data, function (err) {
        if (err) {
            console.log(err);
            console.log("Error saving file " + fileName);
        }
    });
}

function loadFileDialog() {
    if (getDataChangedValue()) {
        clearDataDialog(loadFileDialog);
        return;
    }
    const dialog = require('electron').remote.dialog;
    dialog.showOpenDialog(
        { 
            filters: [
                {name: 'JSON', extensions: ['json']}
            ]
        }, 
        function (fileNames) {
            if (fileNames === undefined)
                return;
            try {
                let data = loadFile(fileNames[0]);
                appData.buildFromJSON(JSON.parse(data));
                setCurrentFile(fileNames[0]);
                let index = require("./index.js");
                index.redrawAll();
                setDataChangedValue(false);
            } catch(e) {
                console.log('Error ' + e.name + ": " + e.message + "\n" + e.stack);
            }
        }
    );
}

function loadFile(fileName) {
    let fs = require('fs');
    var data = fs.readFileSync(fileName, 'utf8');
    return data;
}

function clearDataDialog(callback) {
    let {dialog} = require('electron');
    if (!mainProcess)
        dialog = require('electron').remote.dialog;
    const locale = new (require("./locale.js"))();
    dialog.showMessageBox({
        type: 'question',
        buttons: [locale.translate('popup', 'no'), locale.translate('popup', 'yes')],
        title: locale.translate('popup', 'confirm'),
        message: locale.translate('popup', 'unsaved_data_question')
    }, function (response) {
        if (response === 1) {
            if (callback) {
                setDataChangedValue(false);
                callback();
            } else {
                clearData();
            }
        }
    });
}

function clearDataRequest() {
    if (getDataChangedValue()) {
        clearDataDialog();
    } else {
        clearData();
    }
}

function clearData() {
    setDataChangedValue(false);
    appData.clear();
    setCurrentFile("");
    let index = require("./index.js");
    index.redrawAll();
}

function getCurrentFile() {
    return require('electron').remote.getGlobal('shared').currentFile;
}

function setCurrentFile(filename) {
    require('electron').remote.getGlobal('shared').currentFile = filename;
}

function showSettingsWindow() {
    let BrowserWindow = require('electron').remote.BrowserWindow;
    if (settingsWindow) {
        return;
    }
    settingsWindow = new BrowserWindow({
        width: 400,
        height: 300,
        minWidth: 400,
        minHeight: 300,
        maxWidth: 400,
        maxHeight: 300,
        parent: require('electron').remote.getGlobal('shared').win, //get main window from global
        icon: "assets/donkey.png"
    });
    settingsWindow.loadFile('assets/settings.html');
    // settingsWindow.webContents.openDevTools();
    settingsWindow.setMenu(null);
    settingsWindow.on('closed', () => {
        settingsWindow = null; //delete window
    });
}

function showLicenseWindow() {
    let BrowserWindow = require('electron').remote.BrowserWindow;
    if (licenseWindow) {
        return;
    }
    licenseWindow = new BrowserWindow({
        width: 650,
        height: 540,
        minWidth: 650,
        minHeight: 540,
        parent: require('electron').remote.getGlobal('shared').win,
        icon: "assets/donkey.png"
    });
    licenseWindow.loadFile('assets/license.html');
    // licenseWindow.webContents.openDevTools();
    licenseWindow.setMenu(null);
    licenseWindow.on('closed', () => {
        licenseWindow = null;
    });
}

function saveSettings(settings) {
    if (mainProcess)
        global.shared.settings = settings;
    else
        require('electron').remote.getGlobal('shared').settings = settings;
    saveFile(settingsFileName, JSON.stringify(settings));
}

function loadSettings() {
    try {
        return JSON.parse(loadFile(settingsFileName));
    } catch (e) {
        console.log('Error ' + e.name + ": " + e.message + "\n" + e.stack);
        return { //default settings
            "locale" : "en",
            "saveSize" : false
        };
    }
}

function showTable(id) {
    let table = document.getElementById(id);
    if (table === undefined)
        return;
    table.style.display = 'block';
}

function hideTable(id) {
    let table = document.getElementById(id);
    if (table === undefined)
        return;
    table.style.display = 'none';
}

function updateBounds(settings) {
    let bounds = mainProcess ? 
        global.shared.win.getBounds() :
        require('electron').remote.getGlobal('shared').win.getBounds();
    settings.x = bounds.x;
    settings.y = bounds.y;
    settings.height = bounds.height;
    settings.width = bounds.width;
}

function setDataChangedValue(value) {
    if (mainProcess)
        global.shared.dataChanged = value;
    else
        require('electron').remote.getGlobal('shared').dataChanged = value;
}

function getDataChangedValue() {
    if (mainProcess)
        return global.shared.dataChanged;
    else
        return require('electron').remote.getGlobal('shared').dataChanged;
}

function showAboutInfo() {
    let BrowserWindow = require('electron').remote.BrowserWindow;
    if (aboutWindow) {
        return;
    }
    aboutWindow = new BrowserWindow({
        width: 450,
        height: 300,
        minWidth: 450,
        minHeight: 300,
        maxWidth: 450,
        maxHeight: 300,
        parent: require('electron').remote.getGlobal('shared').win,
        icon: "assets/donkey.png"
    });
    aboutWindow.loadFile('assets/about.html');
    // aboutWindow.webContents.openDevTools();
    aboutWindow.setMenu(null);
    aboutWindow.on('closed', () => {
        aboutWindow = null; //delete window
    });
}

function showHelp() {
    let BrowserWindow = require('electron').remote.BrowserWindow;
    if (helpWindow) {
        return;
    }
    helpWindow = new BrowserWindow({
        width: 450,
        height: 300,
        minWidth: 450,
        minHeight: 300,
        parent: require('electron').remote.getGlobal('shared').win,
        icon: "assets/donkey.png"
    });
    helpWindow.loadFile('assets/help.html');
    // helpWindow.webContents.openDevTools();
    helpWindow.setMenu(null);
    helpWindow.on('closed', () => {
        helpWindow = null; //delete window
    });
}

module.exports.generate = generate;
module.exports.clearDataRequest = clearDataRequest;
module.exports.saveFile = saveFile;
module.exports.saveDataFile = saveDataFile;
module.exports.loadFile = loadFile;
module.exports.loadFileDialog = loadFileDialog;
module.exports.saveFileDialog = saveFileDialog;
module.exports.showSettingsWindow = showSettingsWindow;
module.exports.saveSettings = saveSettings;
module.exports.loadSettings = loadSettings;
module.exports.showTable = showTable;
module.exports.hideTable = hideTable;
module.exports.updateBounds = updateBounds;
module.exports.setDataChangedValue = setDataChangedValue;
module.exports.showAboutInfo = showAboutInfo;
module.exports.showLicenseWindow = showLicenseWindow;
module.exports.showHelp = showHelp;
