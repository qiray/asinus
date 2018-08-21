
class Criterion {
    constructor(name, weight, inverted = false) {
        this.name = name;
        this.weight = weight;
        this.is_inverted = inverted;
    }

    getName() {
        return this.name;
    }
    getWeight() {
        return this.weight;
    }
    isInverted() {
        return this.inverted;
    }

    setName(name) {
        if (typeof(name) === 'string')
            this.name = name;
    }
    setWeight(weight) {
        if (typeof(weight) === 'number')
            this.name = weight;
    }
    invert(inverted) {
        if (typeof(inverted) === 'boolean')
            this.inverted = inverted;
    }
    toggleInverted() {
        this.inverted = !inverted;
    }
}

module.exports.Criterion = Criterion;
