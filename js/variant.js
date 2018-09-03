
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
    deleteCriterion(id) {
        delete this.criteria[id];
    }
    addCriterion(id) {
        this.criteria[id] = 0;
    }
    setCriterionValue(id, value) {
        this.criteria[id] = value;
    }
}

module.exports.Variant = Variant;
