
var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

let mainProcess = true;

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
    fs.writeFile(fileName, data, function (err) {
        if (err) {
            console.log(err);
            console.log("Error saving file " + fileName);
        }
    });
}

function loadFileDialog() {
    let {dialog} = require('electron');
    if (!mainProcess)
        dialog = require('electron').remote.dialog;
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
            data = JSON.parse(data);
            let appData = require("./appdata.js");
            Object.assign(appData, data);
            if (mainProcess)
                global.shared.appData = appData;
            else
                require('electron').remote.getGlobal('shared').appData = appData;
            //TODO: redraw tables
        }
    );
}

function loadFile (fileName) {
    let fs = require('fs');
    var data = fs.readFileSync(fileName, 'utf8');
    return data;
}

module.exports.generate = generate;
module.exports.saveFile = saveFile;
module.exports.loadFile = loadFile;
module.exports.loadFileDialog = loadFileDialog;
module.exports.saveFileDialog = saveFileDialog;
