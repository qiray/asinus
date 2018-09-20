
let common = require("./common.js");


function getTemplate() {
    const locale = new (require("./locale.js"))();
    const template = [
        {
            label: locale.translate('mainmenu', 'file'),
            submenu: [
                {label: locale.translate('mainmenu', 'new'), 
                    click() {common.clearData();}, accelerator: 'CmdOrCtrl+N'},
                {label: locale.translate('mainmenu', 'open'), 
                    click() {common.loadFileDialog();}, accelerator: 'CmdOrCtrl+O'},
                {label: locale.translate('mainmenu', 'save'),  
                    click() {common.saveDataFile();}, accelerator: 'CmdOrCtrl+S'},
                {label: locale.translate('mainmenu', 'saveas'), 
                    click() {common.saveFileDialog();}, accelerator: 'CmdOrCtrl+shift+S'},
                {type: 'separator'},
                {role: 'quit', label: locale.translate('mainmenu', 'quit')}
            ]
        },
        {
            label: locale.translate('mainmenu', 'edit'),
            submenu: [
                {role: 'undo', label: locale.translate('mainmenu', 'undo')},
                {role: 'redo', label: locale.translate('mainmenu', 'redo')},
                {type: 'separator'},
                {role: 'cut', label: locale.translate('mainmenu', 'cut')},
                {role: 'copy', label: locale.translate('mainmenu', 'copy')},
                {role: 'paste', label: locale.translate('mainmenu', 'paste')},
                {type: 'separator'},
                {label: locale.translate('mainmenu', 'settings'), 
                    click() {common.showSettingsWindow();}, accelerator: 'CmdOrCtrl+,'},
            ]
        },
        {
            role: 'window',
            label: locale.translate('mainmenu', 'window'),
            submenu: [
                {role: 'minimize', label: locale.translate('mainmenu', 'minimize')},
                {role: 'close', label: locale.translate('mainmenu', 'close')}
             ]
        },
        {
            role: 'help',
            label: locale.translate('mainmenu', 'help'), //TODO: add help
            submenu: [
                {label: locale.translate('mainmenu', 'help')},
                {label: locale.translate('mainmenu', 'about'), click() {
                    //TODO: style this info
                    const dialog = require('electron').remote.dialog;
                    dialog.showMessageBox({
                        title: locale.translate('mainmenu', 'about'),
                        buttons: ["OK"],
                        message: getAboutInfo()
                    });
                }}
          ]
        }
    ];
      
    if (process.platform === 'darwin') {
        const app = require('electron').remote.app;
        template.unshift({
            label: app.getName(),
            submenu: [
                {role: 'about'},
                {type: 'separator'},
                {role: 'services', submenu: []},
                {type: 'separator'},
                {role: 'hide'},
                {role: 'hideothers'},
                {role: 'unhide'},
                {type: 'separator'},
                {role: 'quit'}
            ]
        });
    }
    return template;
}

function getAboutInfo() {
    let package = require('../package.json');
    return package.name + " " + package.version + "\n" +
        "Runs with Node.js " + process.versions.node + ", Chrome " + 
        process.versions.chrome + ", Electron " + process.versions.electron + ".\n" +
        "App icon made by <a href=\"http://www.freepik.com\" title=\"Freepik\">Freepik</a> from <a href=\"https://www.flaticon.com/\" title=\"Flaticon\">www.flaticon.com</a> is licensed by <a href=\"http://creativecommons.org/licenses/by/3.0/\" title=\"Creative Commons BY 3.0\" target=\"_blank\">CC 3.0 BY</a></div>";
}

module.exports.getTemplate = getTemplate; //export template for usage in other modules
