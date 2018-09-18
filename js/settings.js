
let common = require("./common.js");
let locale = new (require("./locale.js"))();

let saved = false;

function init() {
    document.title = locale.translate('menu', 'settings');
    document.getElementById('editLanguage').innerHTML = locale.translate('language');
    document.getElementById('save').innerHTML = locale.translate('save');
    document.getElementById('close').innerHTML = locale.translate('close');
    let select = document.getElementById('langSelect');
    while (select.options.length > 0) { //clear select
        select.remove(0);
    }
    let languages = locale.translate("languages");
    let currentLocale = locale.getLocale();
    for(let i in languages) {
        let option = document.createElement("option");
        option.text = languages[i].name;
        option.value = languages[i].locale;
        if (option.value === currentLocale) 
            option.selected = true;
        select.add(option);
    }
    document.getElementById('editLanguage').onclick = function() {
        common.showTable('langData');
    };
    document.getElementById('save').onclick = function() {
        let select = document.getElementById('langSelect');
        common.saveSettings(select.options[select.selectedIndex].value);
        saved = true;
    };
    document.getElementById('close').onclick = function() {
        if (saved) {
            const ipcRenderer = require('electron').ipcRenderer;
            ipcRenderer.send('save_message', "saved");
        }
        window.close();
    };
}

module.exports.init = init;
