
let Criterion = require("./criterion.js");
let Variant = require("./variant.js");
let locale = require("./locales/en.js");
let appData = require("./appdata.js"); //application data

function showTable(id) {
    let table = document.getElementById(id);
    if (table === undefined)
        return;
    table.style.display = 'block';
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

function variantsTableHeader(marks = false) {
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
    if (marks) {
        headerElement.innerHTML = locale.total;
    } else {
        headerElement.innerHTML = locale.deleteHeader;
    }
    result.appendChild(headerElement);
    return result;
}

function variantsTableInit() {
    //add new row and variant
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
    for (let i in ids) {
        result.appendChild(tableNewColumn('div', 'divTableCell', 
            {id : "weight" + index + "criterion" + ids[i], innerHTML : data[ids[i]]}));
    }
    result.appendChild(tableNewColumn('div', 'divTableCell', 
        {id : "weightsSum" + index, innerHTML : ''}));
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
    showTable('marksData');
    showResult();
};

document.getElementById('weightsPlusButton').onclick = function() {
    weightTableAddRow();
};

document.getElementById('variantsPlusButton').onclick = function() {
    variantsTableAddRow();
};
