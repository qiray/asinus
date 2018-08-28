
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
    updateCriterion(id, criterionData) {
        if (typeof(criterionData) === 'object') {
            this.criteria[id].setName(criterionData.name);
            this.criteria[id].setWeight(criterionData.weight);
            this.criteria[id].invert(criterionData.inverted);
        }
    }
    getCriterion(id) {
        if (id in this.criteria)
            return this.criteria[id];
        return new Criterion.Criterion('', 0); //Maybe return nil or undefined?
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
