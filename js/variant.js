
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
        if (typeof(value) === 'number')
            this.criteria[id] = value > 0 ? value : 0;
    }
    getValue(id) {
        if (id in this.criteria)
            return this.criteria[id];
        return 0;
    }
}

module.exports.Variant = Variant;
