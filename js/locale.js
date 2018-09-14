const path = require("path");
const electron = require('electron');
const fs = require('fs');

class locale {
    constructor(locale) {
        this.loadedLanguage = '';
        this.app = electron.app ? electron.app : electron.remote.app;
        locale = locale ? locale : this.app.getLocale().substring(0,2);
        if(fs.existsSync(path.join(__dirname, locale + '.js'))) {
            this.loadedLanguage = JSON.parse(
                fs.readFileSync(path.join(__dirname, 'locales', locale + '.json'), 'utf8')
            );
        }
        else { //default language
            this.loadedLanguage = JSON.parse(
                fs.readFileSync(path.join(__dirname, 'locales', 'en.json'), 'utf8')
            );
        }
    }

    translate() {
        try {
            let phrase = arguments[0];
            let translation = this.loadedLanguage[phrase];
            for (let i = 1; i < arguments.length; i++) {
                translation = translation[arguments[i]];
            }
            if(translation === undefined) {
                translation = phrase;
            }
            return translation;
        } catch(e) {
            return arguments[0] || "";
        }
        
    }
}

module.exports = locale;
