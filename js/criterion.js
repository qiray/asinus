
let common = require("./common.js");

class Criterion {
    constructor(name, weight, inverted = false) {
        this.id = common.generate(80);
        this.name = typeof(name) === 'string' ? name : '';
        this.weight = parseFloat(weight) || 0;
        this.is_inverted = typeof(inverted) === 'boolean' ? inverted : false;
    }

    getName() {
        return this.name;
    }
    getWeight() {
        return this.weight;
    }
    isInverted() {
        return this.inverted;
    }

    setName(name) {
        if (typeof(name) === 'string')
            this.name = name;
    }
    setWeight(weight) {
        this.weight = parseFloat(weight) || 0;
    }
    invert(inverted) {
        if (typeof(inverted) === 'boolean')
            this.inverted = inverted;
    }
    toggleInverted() {
        this.inverted = !inverted;
    }
}

module.exports.Criterion = Criterion;
