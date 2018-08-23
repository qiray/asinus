
let Criterion = require("./criterion.js");

class Data {
    constructor(name, description = "") {
        this.name = name;
        this.description = description;
        this.criteria = [];
        this.variants = [];
    }

    getName() {
        return this.name;
    }
    setName(name) {
        if (typeof(name) === 'string')
            this.name = name;
    }
    getDescription() {
        return this.description;
    }
    setDescription(description) {
        if (typeof(description) === 'string')
            this.description = description;
    }
    addCriterion(criterion) {
        if (criterion instanceof Criterion.Criterion)
            this.criteria.push(criterion);
    }
    deleteCriterion(index) {
        if (typeof(index) === 'number' && index > -1) {
            this.criteria.splice(Math.floor(index), 1);
            //TODO: change variants
        }
    }
    //TODO: add functions for control variants
}

module.exports.Data = Data;
