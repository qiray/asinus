
let appData = require("./appdata.js");

let ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let settingsFileName = "settings.json";

let mainProcess = true;
let settingsWindow = null;

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

function saveFileDialog () {
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
            let index = require("./index.js");
            index.saveAll();
            let data = {};
            if (mainProcess)
                data = global.shared.appData; //get appData from global scope
            else
                data = require('electron').remote.getGlobal('shared').appData;
            saveFile(fileName, JSON.stringify(data));
        }
    ); 
}

function saveFile (fileName, data) {
    let fs = require('fs');
    fs.writeFileSync(fileName, data, function (err) {
        if (err) {
            console.log(err);
            console.log("Error saving file " + fileName);
        }
    });
}

function loadFileDialog() {
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
            let data = loadFile(fileNames[0]);
            appData.buildFromJSON(JSON.parse(data));
            let index = require("./index.js");
            index.redrawAll();
            // require('electron').remote.getGlobal('shared').appData = data;
        }
    );
}

function loadFile (fileName) {
    let fs = require('fs');
    var data = fs.readFileSync(fileName, 'utf8');
    return data;
}

function clearData() {
    appData.clear();
    let index = require("./index.js");
    index.redrawAll();
}

function showSettingsWindow() {
    let BrowserWindow = require('electron').remote.BrowserWindow;
    if (settingsWindow) {
        return;
    }
    settingsWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        parent: require('electron').remote.getGlobal('shared').win, //get main window from global
        modal: true,
        icon: "assets/donkey.png"
    });
    settingsWindow.loadFile('assets/settings.html');
    // settingsWindow.webContents.openDevTools();
    settingsWindow.setMenu(null);
    settingsWindow.on('closed', () => {
        settingsWindow = null; //delete window
    });
}

function saveSettings(locale) {
    saveFile(settingsFileName, JSON.stringify({
        "locale" : locale
    }));
}

function loadSettings() {
    try {
        return JSON.parse(loadFile(settingsFileName));
    } catch (e) {
        console.log('Error ' + e.name + ": " + e.message + "\n" + e.stack);
        return { //default settings
            "locale" : "en"
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

module.exports.generate = generate;
module.exports.clearData = clearData;
module.exports.saveFile = saveFile;
module.exports.loadFile = loadFile;
module.exports.loadFileDialog = loadFileDialog;
module.exports.saveFileDialog = saveFileDialog;
module.exports.showSettingsWindow = showSettingsWindow;
module.exports.saveSettings = saveSettings;
module.exports.loadSettings = loadSettings;
module.exports.showTable = showTable;
module.exports.hideTable = hideTable;
