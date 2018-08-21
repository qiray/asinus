
const template = [
    {
        label: 'File',
        submenu: [
            {label: "New", click() {console.log("New file");}, accelerator: 'CmdOrCtrl+N'},
            {label: "Save"},
            {label: "Save as"},
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
            {label: "About"}
      ]
    }
];
  
if (process.platform === 'darwin') {
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
  
module.exports.template = template; //export template for usage in other modules
