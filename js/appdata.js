
let Criterion = require("./criterion.js");

class AppData {

    constructor(name, description = "") {
        this.name = name;
        this.description = description;
        this.criteria = {};
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
            this.criteria[criterion.id] = criterion;
    }
    deleteCriterion(id) {
        delete this.criteria[id];
        //TODO: change variants
    }
    updateCriterion(id, criterion) {
        if (criterion instanceof Criterion.Criterion) {
            criterion.id = id;
            this.criteria[id] = criterion;
        }
    }
    getCriteriaCount() {
        return Object.keys(this.criteria).length;
    }
    getCriteriaIDs() {
        return Object.keys(this.criteria);
    }
    //TODO: add functions for control variants
}

module.exports.AppData = AppData;
