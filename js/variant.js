
let common = require("./common.js");

class Variant {
    constructor(name, criteria) {
        this.id = common.generate(80);
        this.name = name;
        this.criteria = criteria;
    }

    getName() {
        return this.name;
    }
    setName(name) {
        if (typeof(name) === 'string')
            this.name = name;
    }
    deleteCriterion(name) {
        delete this.criteria[name];
    }
}

module.exports.Variant = Variant;
