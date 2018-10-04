
let common = require("./common.js");


function getTemplate() {
    const locale = new (require("./locale.js"))();
    const template = [
        {
            label: locale.translate('mainmenu', 'file'),
            submenu: [
                {label: locale.translate('mainmenu', 'new'), 
                    click() {common.clearDataRequest();}, accelerator: 'CmdOrCtrl+N'},
                {label: locale.translate('mainmenu', 'open'), 
                    click() {common.loadFileDialog();}, accelerator: 'CmdOrCtrl+O'},
                {label: locale.translate('mainmenu', 'save'),  
                    click() {common.saveDataFile();}, accelerator: 'CmdOrCtrl+S'},
                {label: locale.translate('mainmenu', 'saveas'), 
                    click() {common.saveFileDialog();}, accelerator: 'CmdOrCtrl+shift+S'},
                {type: 'separator'},
                {role: 'quit', label: locale.translate('mainmenu', 'quit'), 
                    accelerator: 'CmdOrCtrl+Q'}
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
                {label: locale.translate('mainmenu', 'clearall'),
                    click() {common.clearDataRequest();}},
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
            label: locale.translate('mainmenu', 'help'),
            submenu: [
                {label: locale.translate('mainmenu', 'help'), click() {
                    common.showHelp();
                }},
                {label: locale.translate('mainmenu', 'example'), click() {
                    common.showExampleMenu();
                }},
                {label: locale.translate('mainmenu', 'about'), click() {
                    common.showAboutInfo();
                }}
          ]
        }
    ];
      
    if (process.platform === 'darwin') {
        const app = require('electron').remote.app;
        let appName = app.getName();
        template.unshift({
            label: appName,
            submenu: [
                {label: locale.translate('mainmenu', 'about') + ' ' + appName, click() {
                    common.showAboutInfo();
                }},
                {type: 'separator'},
                {role: 'services', submenu: [], label: locale.translate('mainmenu', 'services')},
                {type: 'separator'},
                {role: 'hide', label: locale.translate('mainmenu', 'hide') + ' ' + appName},
                {role: 'hideothers', label: locale.translate('mainmenu', 'hideothers')},
                {role: 'unhide', label: locale.translate('mainmenu', 'unhide')},
                {type: 'separator'},
                {role: 'quit', label: locale.translate('mainmenu', 'quit')}
            ]
        });
    }
    return template;
}

module.exports.getTemplate = getTemplate; //export template for usage in other modules
