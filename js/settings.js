
let common = require("./common.js");
let locale = new (require("./locale.js"))();

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
    for(let i in languages) { //TODO: select current setting!
        let option = document.createElement("option");
        option.text = languages[i].name;
        option.value = languages[i].locale;
        select.add(option);
    }
    document.getElementById('editLanguage').onclick = function() {
        common.showTable('langData');
    };
    document.getElementById('save').onclick = function() {
        let select = document.getElementById('langSelect');
        console.log(select.options[select.selectedIndex]);
        common.saveSettings(select.options[select.selectedIndex].value);
    };
    document.getElementById('close').onclick = function() {
        window.close();
    };
}

module.exports.init = init;
