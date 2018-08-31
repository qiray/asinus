
let AppData = require("./appdata.js");
let Criterion = require("./criterion.js");
let Variant = require("./variant.js");
let locale = require("./locales/en.js");

let appData = new AppData(); //application data

function showTable(id) {
    let table = document.getElementById(id);
    if (table === undefined)
        return;
    table.style.display = 'block';
}

function weightTabledeleteRow(index) {
    //delete a row and criterion
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

function newWeightTableRowElements(index) {
    //create table row
    let container = document.createElement('div');
    container.className = "divTableRow";
    container.id = "weightTableRow" + index;
    container.appendChild(tableNewColumn('input', 'divTableCell', 
        {className : 'tableInput', type : 'text', id : 'criterionName' + index}));
    container.appendChild(tableNewColumn('input', 'divTableCell', 
        {className : 'tableInput', type : 'number', min : '0', step : '0.01', 
        id : 'criterionValue' + index}));
    container.appendChild(tableNewColumn('input', 'divTableCellSmall', 
        {type : 'checkbox', id : 'criterionInverted' + index}));
    container.appendChild(tableNewColumn('button', 'divTableCellSmall', 
        {className : 'plusButton', id : 'deleteCriterionButton' + index, innerHTML : '-'}));
    return container;
}

function variantsTableHeader() {
    let result = document.createElement('div');
    result.className = "divTableRow";
    let column1 = document.createElement('div');
    column1.className = "divTableCell";
    column1.innerHTML = locale.variantName;
    result.appendChild(column1);
    let ids = appData.getCriteriaIDs();
    for (let i in ids) {
        let headerElement = document.createElement('div');
        headerElement.className = 'divTableCell';
        headerElement.innerHTML = appData.getCriterion(ids[i]).name;
        result.appendChild(headerElement);
    }
    let headerElement = document.createElement('div');
    headerElement.className = 'divTableCell';
    headerElement.innerHTML = locale.deleteHeader;
    result.appendChild(headerElement);
    return result;
}

function variantsTableInit() {
    //add new row and variant
    let table = document.getElementById('variantsDataBody');
    if (table === undefined)
        return;
    while(table.firstChild) { //clear variants table
        table.removeChild(table.firstChild);
    }
    table.appendChild(variantsTableHeader());
    //TODO: recreate table
}

function variantsTableAddRow() {
    //add new row and variant
    let table = document.getElementById('variantsDataBody');
    if (table === undefined)
        return;
    let ids = appData.getCriteriaIDs();
    let criteria = ids.reduce(function(result, item) {
        result[item] = "";
        return result;
    }, {}); //convert array to object
    let variant = new Variant.Variant("", criteria);
    let index = variant.id;
    appData.addVariant(variant);
    let result = document.createElement('div');
    result.className = "divTableRow";
    result.id = "variantRow" + index;
    result.appendChild(tableNewColumn('input', 'divTableCell', 
        {className : 'tableInput', type : 'text', id : 'variantName' + index}));
    for (let i in ids) {
        result.appendChild(tableNewColumn('input', 'divTableCell', 
            {className : 'tableInput', type : 'number', min : '0', 
            step : '0.01', id : "variant" + index + "criterion" + ids[i]}));
    }
    result.appendChild(tableNewColumn('button', 'divTableCellSmall', 
        {className : 'plusButton', id : 'deleteVariantButton' + index, innerHTML : '-'}));
    table.appendChild(result);
    document.getElementById('deleteVariantButton' + index).onclick = function() {
        variantsTabledeleteRow(index);
    };
}

function variantsTabledeleteRow(index) {
    //TODO:
}

function saveAll() {
    saveCriteria();
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
    console.log(appData);
}

//Some event listeners:

document.getElementById('editWeights').onclick = function() {
    showTable('weightsData');
    saveAll();
};

document.getElementById('editVariants').onclick = function() {
    showTable('variantsData');
    saveAll();
    variantsTableInit();
};

document.getElementById('showResult').onclick = function() {
    saveAll();
};

document.getElementById('weightsPlusButton').onclick = function() {
    weightTableAddRow();
};

document.getElementById('variantsPlusButton').onclick = function() {
    variantsTableAddRow();
};
