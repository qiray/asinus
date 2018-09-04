
var ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generate(length) {
    //generate random sequence
    var result = '';
    for (var i = 0; i < length; i++) {
        result += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return result;
}

function saveJSON(data) {
    let dialog = remote.require('dialog');
    let fs = require('fs');
    //TODO:
}

module.exports.generate = generate;
