
var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generate(length) {
    //generate random sequence
    var result = '';
    for (var i = 0; i < length; i++) {
        result += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return result;
}

function saveFileDialog (data) {
    const {dialog} = require('electron');
    dialog.showSaveDialog(
        { 
            filters: [
                {name: 'json', extensions: ['json']}
            ]
        }, 
        function (fileName) {
            if (fileName === undefined)
                return;
            saveFile(fileName, data);
        }
    ); 
}

function saveFile (fileName, data) {
    let fs = require('fs');
    fs.writeFile(fileName, data, function (err) {
        console.log(err);
        console.log("Error saving file " + fileName);
    });
}

function loadFile (fileName) {
    //TODO: test
    let fs = require('fs');
    var data = fs.readFileSync(fileName);
    return data;
}

module.exports.generate = generate;
module.exports.saveFile = saveFile;
module.exports.loadFile = loadFile;
module.exports.saveFileDialog = saveFileDialog;
