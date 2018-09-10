
let common = require("./common.js");

const template = [
    {
        label: 'File',
        submenu: [
            {label: "New", click() {console.log("New file");}, accelerator: 'CmdOrCtrl+N'},
            {label: "Open", click() {common.loadFileDialog();}},
            {label: "Save"},
            {label: "Save as", click() {common.saveFileDialog();}},
            {type: 'separator'},
            {role: 'quit'}
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {role: 'undo'},
            {role: 'redo'},
            {type: 'separator'},
            {role: 'cut'},
            {role: 'copy'},
            {role: 'paste'},
            {type: 'separator'},
            {label: "Settings"},
        ]
    },
    {
        role: 'window',
        submenu: [
            {role: 'minimize'},
            {role: 'close'}
         ]
    },
    {
        role: 'help',
        submenu: [
            {label: "Help"},
            {label: "About", click() {
                const {dialog} = require('electron');
                dialog.showMessageBox({
                    title: "About",
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

function getAboutInfo() {
    let package = require('../package.json');
    return package.name + " " + package.version + "\n" +
        "Made with Node.js " + process.versions.node + ", Chrome " + 
        process.versions.chrome + ", Electron " + process.versions.electron + ".";
}

module.exports.template = template; //export template for usage in other modules
