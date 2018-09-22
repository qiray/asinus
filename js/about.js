
let shell = require('electron').remote.shell;
let common = require("./common.js");
let locale = new (require("./locale.js"))();

function init() {
    let package = require('../package.json');
    document.title = locale.translate('mainmenu', 'about');
    document.getElementById('appName').innerHTML = locale.translate('asinus');
    document.getElementById('version').innerHTML = locale.translate('version') + 
        package.version;
    document.getElementById('aboutApp').innerHTML = locale.translate('about');
    document.getElementById('copyright').innerHTML = locale.translate('copyright');
    document.getElementById('license').innerHTML = locale.translate('license') + 
        "<a href=\"LICENSE\">" + locale.translate('freesoftware') + "</a>";
    document.getElementById('nodejs').innerHTML = locale.translate('nodejs') + 
        process.versions.node;
    document.getElementById('chrome').innerHTML = locale.translate('chrome') + 
        process.versions.chrome;
    document.getElementById('electron').innerHTML = locale.translate('electron') + 
    process.versions.electron;    
    document.getElementById('close').innerHTML = locale.translate('close');
    document.getElementById('iconMadeBy').innerHTML = locale.translate("iconMadeBy");
    document.getElementById('from').innerHTML = locale.translate("from");
    document.getElementById('iconLicensed').innerHTML = locale.translate("iconLicensed");

    document.getElementById('license').onclick = function() {
        common.showLicenseWindow();
        // shell.openItem("LICENSE");
    };
    document.getElementById('close').onclick = function() {
        window.close();
    };
    let aTags = document.getElementsByTagName("a");
    for (let i = 0; i < aTags.length; i++) {
        let url = aTags[i].href;
        aTags[i].onclick = function() {
            openExternal(url);
        };
        aTags[i].href = "#";
    }
}

function openExternal(link) {
    if (link.search("LICENSE") >= 0)
        return;
    shell.openExternal(link);
}

module.exports.init = init;