
class Variant {
    constructor(name, criteria) {
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
