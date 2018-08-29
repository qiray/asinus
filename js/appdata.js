
let Criterion = require("./criterion.js");
let Variant = require("./variant.js");

class AppData {

    constructor(name, description = "") {
        this.name = name;
        this.description = description;
        this.criteria = {};
        this.variants = {};
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
        //TODO: change variants
    }
    deleteCriterion(id) {
        delete this.criteria[id];
        //TODO: change variants
    }
    updateCriterion(id, criterionData) {
        if (id in this.criteria && typeof(criterionData) === 'object') {
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

    addVariant(variant) {
        if (variant instanceof Variant.Variant)
            this.variants[variant.id] = variant;
    }
    deleteVariant(id) {
        delete this.variants[id];
    }
    getVariant(id) {
        if (id in this.variants)
            return this.variants[id];
        return;
    }
    updateVariant(id, variantData) {
        if (arguments.length == 1) {//update using existing criterias and default values
            for (let i in this.variants[id].criteria) //delete not existing criteria
                if (!(this.variants[id].criteria[i] in this.criteria))
                    delete this.variants[id].criteria[i];
            for (let i in this.criteria) //add new criteria
                if (!(this.criteria[i] in this.variants[id].criteria))
                    this.variants[id].criteria[i] = 0;
        }
        if (typeof(variantData) === 'object') {
            //TODO: update variant with data
        }
    }

    getVariantsCount() {
        return Object.keys(this.variants).length;
    }
    getVariantsIDs() {
        return Object.keys(this.variants);
    }
}

module.exports = AppData;
