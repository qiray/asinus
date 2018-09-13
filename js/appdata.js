
let Criterion = require("./criterion.js");
let Variant = require("./variant.js");

class AppData {

    constructor(name = "", description = "") {
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
        for (let i in this.variants)
            this.variants[i].addCriterion(criterion.id);
    }
    deleteCriterion(id) {
        delete this.criteria[id];
        for (let i in this.variants)
            this.variants[i].deleteCriterion(id);
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
                    this.variants[id].deleteCriterion(i);
            for (let i in this.criteria) //add new criteria
                if (!(this.criteria[i] in this.variants[id].criteria))
                    this.variants[id].addCriterion(i);
        }
        if (typeof(variantData) === 'object') {
            for (let i in variantData)
                this.variants[id].setCriterionValue(i, parseFloat(variantData[i]));
        }
    }
    setVariantName(id, name) {
        if (id in this.variants && typeof(name) == 'string')
            this.variants[id].name = name;
    }

    getVariantsCount() {
        return Object.keys(this.variants).length;
    }
    getVariantsIDs() {
        return Object.keys(this.variants);
    }

    calcMarks() {
        let result = {};
        for (let i in this.variants) {
            result[i] = {};
            for (let j in this.criteria) {
                result[i][j] = this.variants[i].getValue(j);
            }
        }
        for (let i in this.criteria) {
            let max = Number.NEGATIVE_INFINITY, min = Number.POSITIVE_INFINITY;
            for (let j in this.variants) {
                let value = this.variants[j].getValue(i);
                if (value > max)
                    max = value;
                if (value < min)
                    min = value;
            }
            max = max > 0 ? max : 1;
            let isInverted = this.criteria[i].isInverted();
            let weight = this.criteria[i].getWeight();
            for (let j in this.variants) {
                if (isInverted) {
                    //if current value is 0 then let it be the max else compute as usual:
                    result[j][i] = weight*(result[j][i] == 0 ? 1 : min/result[j][i]);
                } else {
                    result[j][i] = weight*result[j][i]/max;
                }
                if (!Number.isFinite(result[j][i])) //Or maybe throw an exception?
                    result[j][i] = 0;
            }
        }
        return result;
    }

    buildFromJSON(data) {
        if (data) {
            for(let i in this.criteria)
                delete this.criteria[i];
            for(let i in this.variants)
                delete this.variants[i];
            this.name = data.name;
            this.description = data.description;
            let criterion = new Criterion.Criterion("", 0);
            for(let i in data.criteria) {
                criterion = Object.assign(new Criterion.Criterion(), data.criteria[i]);
                this.addCriterion(criterion);
            }
            let variant = new Variant.Variant("", {});
            for(let i in data.variants) {
                variant = Object.assign(new Variant.Variant(), data.variants[i]);
                this.addVariant(variant);
            }
            return;
        }
        for(let i in this.criteria) {
            Object.setPrototypeOf(this.criteria[i], Criterion.Criterion);
        }
        for(let i in this.variants) {
            Object.setPrototypeOf(this.variants[i], Variant.Variant);
        }
    }
    clear() {
        this.name = "";
        this.description = "";
        this.criteria = {};
        this.variants = {};
    }
}

let appData = new AppData(); //application data

module.exports = appData;
