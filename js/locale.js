
let common = require("./common.js");

class locale {

    constructor() {
        const path = require("path");
        const electron = require('electron');
        const fs = require('fs');
        this.loadedLanguage = '';
        this.app = electron.app ? electron.app : electron.remote.app;
        let settings = common.loadSettings();
        this.locale = settings.locale;
        let localePath = path.join(__dirname, 'locales', this.locale + '.json');
        if (fs.existsSync(localePath)) {
            this.loadedLanguage = JSON.parse(
                fs.readFileSync(localePath, 'utf8')
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
            if (translation === undefined) {
                translation = phrase;
            }
            return translation;
        } catch (e) {
            return arguments[0] || "";
        }
    }

    getLocale() {
        return this.locale;
    }

}

module.exports = locale;
