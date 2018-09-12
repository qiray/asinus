
let Criterion = require("./criterion.js");
let Variant = require("./variant.js");
let locale = require("./locales/en.js");
let appData = require("./appdata.js"); //application data

//Create menu:
const menuJS = require('./menu.js');
const {Menu} = require('electron').remote;
const menu = Menu.buildFromTemplate(menuJS.template);
Menu.setApplicationMenu(menu);

function showTable(id) {
    let table = document.getElementById(id);
    if (table === undefined)
        return;
    table.style.display = 'block';
}

function hideTable(id) {
    let table = document.getElementById(id);
    if (table === undefined)
        return;
    table.style.display = 'none';
}

function weightTabledeleteRow(index) {
    //delete row and criterion with id = index
    let obj = document.getElementById("weightTableRow" + index);
    if (obj === undefined)
        return;
    obj.remove();
    appData.deleteCriterion(index);
}

function weightTableAddRow() {
    //add new row and criterion
    let table = document.getElementById('weightsDataBody');
    if (table === undefined)
        return;
    let criterion = new Criterion.Criterion('', 0);
    let index = criterion.id;
    appData.addCriterion(criterion);
    table.appendChild(newWeightTableRowElements(index));
    document.getElementById('deleteCriterionButton' + index).onclick = function() {
        weightTabledeleteRow(index);
    };
}

function tableNewColumn(type, columnClassName, params) {
    //create table cell elements
    let column = document.createElement('div');
    column.className = columnClassName;
    let obj = document.createElement(type);
    for (let prop in params) {
        obj[prop] = params[prop];
    }
    column.appendChild(obj);
    return column;
}

function newWeightTableRowElements(index, obj) {
    //create table row
    let container = document.createElement('div');
    container.className = "divTableRow";
    container.id = "weightTableRow" + index;
    container.appendChild(tableNewColumn('input', 'divTableCell', 
        {className : 'tableInput', type : 'text', id : 'criterionName' + index,
        value : obj ? obj.getName() : ''}));
    container.appendChild(tableNewColumn('input', 'divTableCell', 
        {className : 'tableInput', type : 'number', min : '0', step : '0.01', 
        id : 'criterionValue' + index, value : obj ? obj.getWeight() : '0'}));
    container.appendChild(tableNewColumn('input', 'divTableCellSmall', 
        {type : 'checkbox', id : 'criterionInverted' + index,
        checked : obj ? obj.isInverted() : false}));
    container.appendChild(tableNewColumn('button', 'divTableCellSmall', 
        {className : 'plusButton', id : 'deleteCriterionButton' + index, innerHTML : '-'}));
    return container;
}

function variantsTableHeader(marks = false) {
    let result = document.createElement('div');
    result.className = "divTableRow";
    result.appendChild(headerElement(locale.variantName));
    let ids = appData.getCriteriaIDs();
    for (let i in ids) {
        result.appendChild(headerElement(appData.getCriterion(ids[i]).name));
    }
    result.appendChild(headerElement(marks ? locale.total : locale.deleteHeader));
    return result;
}

function headerElement(name) {
    let result = document.createElement('div');
    result.className = 'divTableCell';
    result.innerHTML = name;
    return result;
}

function weightsTableHeader() {
    let result = document.createElement('div');
    result.className = "divTableRow";
    result.appendChild(headerElement(locale.weightName));
    result.appendChild(headerElement(locale.weight));
    result.appendChild(headerElement(locale.inverted));
    result.appendChild(headerElement(locale.deleteHeader));
    return result;
}

function weightsTableInit() {
    let title = document.getElementById('criteriaTitle');
    if (title)
        title.innerHTML = locale.criteria;
    let table = document.getElementById('weightsDataBody');
    if (table === undefined)
        return;
    clearTable(table);
    table.appendChild(weightsTableHeader());
    let ids = appData.getCriteriaIDs();
    for (let i in ids) {
        table.appendChild(newWeightTableRowElements(ids[i], appData.getCriterion(ids[i])));
        document.getElementById('deleteCriterionButton' + ids[i]).onclick = function() {
            weightTabledeleteRow(ids[i]);
        };
    }
}

function variantsTableInit() {
    let title = document.getElementById('variantsTitle');
    if (title)
        title.innerHTML = locale.variants;
    let table = document.getElementById('variantsDataBody');
    if (table === undefined)
        return;
    clearTable(table);
    table.appendChild(variantsTableHeader());
    let ids = appData.getVariantsIDs();
    for (let i in ids) {
        variantsTableAddRow(appData.getVariant(ids[i]));
    }
}

function variantsTableAddRow(variant = undefined) {
    //add new row and variant
    let table = document.getElementById('variantsDataBody');
    if (table === undefined)
        return;
    let ids = appData.getCriteriaIDs();
    let criteria = ids.reduce(function(result, item) {
        result[item] = 0;
        return result;
    }, {}); //convert array to object
    if (variant === undefined)
        variant = new Variant.Variant("", criteria);
    let index = variant.id;
    appData.addVariant(variant);
    let result = document.createElement('div');
    result.className = "divTableRow";
    result.id = "variantRow" + index;
    result.appendChild(tableNewColumn('input', 'divTableCell',
        {className : 'tableInput', type : 'text', 
        id : 'variantName' + index, value : variant.name}));
    for (let i in ids) {
        result.appendChild(tableNewColumn('input', 'divTableCell', 
            {className : 'tableInput', type : 'number', min : '0', 
            step : '0.01', id : "variant" + index + "criterion" + ids[i],
            value : variant.getValue(ids[i])}));
    }
    result.appendChild(tableNewColumn('button', 'divTableCellSmall', 
        {className : 'plusButton', id : 'deleteVariantButton' + index, innerHTML : '-'}));
    table.appendChild(result);
    document.getElementById('deleteVariantButton' + index).onclick = function() {
        variantsTableDeleteRow(index);
    };
}

function numberFormat(value) {
    let precision = 1000;
    return Math.round(value*precision)/precision;
}

function marksTableAddRow(variant, data) {
    //add new row and variant
    let table = document.getElementById('marksDataBody');
    if (table === undefined)
        return;
    let ids = appData.getCriteriaIDs();
    let criteria = ids.reduce(function(result, item) {
        result[item] = 0;
        return result;
    }, {}); //convert array to object
    let index = variant.id;
    let result = document.createElement('div');
    result.className = "divTableRow";
    result.id = "variantRow" + index;
    result.appendChild(tableNewColumn('div', 'divTableCell',
        {innerHTML : variant.name}));
    let sum = 0;
    for (let i in ids) {
        sum += data[ids[i]];
        result.appendChild(tableNewColumn('div', 'divTableCell', 
            {id : "weight" + index + "criterion" + ids[i], innerHTML : numberFormat(data[ids[i]])}));
    }
    result.appendChild(tableNewColumn('div', 'divTableCell', 
        {id : "weightsSum" + index, innerHTML : numberFormat(sum)}));
    table.appendChild(result);
}

function variantsTableDeleteRow(index) {
    //delete row and variant with id = index
    let obj = document.getElementById("variantRow" + index);
    if (obj === undefined)
        return;
    obj.remove();
    appData.deleteVariant(index);
}

function saveAll() {
    saveCriteria();
    saveVariants();
    saveName();
    require('electron').remote.getGlobal('shared').appData = appData; //send appData to main process
    console.log(appData);
}

function saveCriteria() {
    try {
        let ids = appData.getCriteriaIDs();
        for (let i in ids) {
            appData.updateCriterion(ids[i], {
                name : document.getElementById('criterionName' + ids[i]).value,
                weight : document.getElementById('criterionValue' + ids[i]).value,
                inverted : document.getElementById('criterionInverted' + ids[i]).checked
            });
        }
    } catch(e) {
        console.log('Error ' + e.name + ": " + e.message + "\n" + e.stack);
    }
}

function saveVariants() {
    try {
        let ids = appData.getVariantsIDs();
        for (let i in ids) {
            appData.setVariantName(ids[i], getVariantName(ids[i]));
            appData.updateVariant(ids[i], getVariantData(ids[i]));
        }
    } catch(e) {
        console.log('Error ' + e.name + ": " + e.message + "\n" + e.stack);
    }
}

function saveName() {
    let name = document.getElementById("nameInput").value;
    appData.setName(name);
    let desc = document.getElementById("descInput").value;
    appData.setDescription(desc);
}

function nameInit() {
    document.getElementById("nameInput").value = appData.getName();
    document.getElementById("descInput").value = appData.getDescription();
}

function getVariantName(id) {
    let obj = document.getElementById("variantName" + id);
    return obj.value;
}

function getVariantData(id) {
    //get variant data from html table
    let result = {};
    let ids = appData.getCriteriaIDs();
    for (let i in ids) {
        let obj = document.getElementById("variant" + id + "criterion" + ids[i]);
        result[ids[i]] = obj.value;
    }
    return result;
}

function showResult() {
    let title = document.getElementById('marksTitle');
    if (title)
        title.innerHTML = locale.marks;
    showTable('marksData');
    let table = document.getElementById('marksDataBody');
    if (table === undefined)
        return;
    let result = appData.calcMarks();
    showMarks(result);
}

function showMarks(data) {
    let table = document.getElementById('marksDataBody');
    clearTable(table);
    table.appendChild(variantsTableHeader(true));
    let ids = appData.getVariantsIDs();
    for (let i in ids) {
        let variant = appData.getVariant(ids[i]);
        marksTableAddRow(variant, data[ids[i]]);
    }
}

function clearTable(table) {
    while(table.firstChild) {
        table.removeChild(table.firstChild);
    }
}

function redrawAll() {
    nameInit();
    weightsTableInit();
    variantsTableInit();
    hideTable('weightsData');
    hideTable('variantsData');
    hideTable('marksData');
    showTable('nameData');
}

//Some texts:

document.getElementById('nameTitle').innerHTML = locale.menu.name;
document.getElementById('descTitle').innerHTML = locale.menu.desc;
document.getElementById('editName').innerHTML = locale.menu.name;
document.getElementById('editWeights').innerHTML = locale.menu.weights;
document.getElementById('editVariants').innerHTML = locale.menu.variants;
document.getElementById('showResult').innerHTML = locale.menu.result;

//Some event listeners:

document.getElementById('editName').onclick = function() {
    hideTable('variantsData');
    hideTable('marksData');
    hideTable('weightsData');
    showTable('nameData');
}

document.getElementById('editWeights').onclick = function() {
    hideTable('variantsData');
    hideTable('marksData');
    hideTable('nameData');
    showTable('weightsData');
    saveAll();
    weightsTableInit();
};

document.getElementById('editVariants').onclick = function() {
    hideTable('weightsData');
    hideTable('marksData');
    hideTable('nameData');
    showTable('variantsData');
    saveAll();
    variantsTableInit();
};

document.getElementById('showResult').onclick = function() {
    hideTable('weightsData');
    hideTable('variantsData');
    hideTable('nameData');
    saveAll();
    showResult();
};

document.getElementById('weightsPlusButton').onclick = function() {
    weightTableAddRow();
};

document.getElementById('variantsPlusButton').onclick = function() {
    variantsTableAddRow();
};

//Export:

module.exports.redrawAll = redrawAll;
module.exports.saveAll = saveAll;
