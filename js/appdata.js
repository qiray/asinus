
let Criterion = require("./criterion.js");

class AppData {

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
        if (arguments.length === 0) {
            this.criteria.push(new Criterion.Criterion(toString(this.criteria.length), 0));
            return;
        }
        if (criterion instanceof Criterion.Criterion)
            this.criteria.push(criterion);
    }
    deleteCriterion(index) {
        if (typeof(index) === 'number' && index > -1) {
            this.criteria.splice(Math.floor(index), 1);
            //TODO: change variants
        }
    }
    getCriteriaCount() {
        return this.criteria.length;
    }
    //TODO: add functions for control variants
}

module.exports.AppData = AppData;
