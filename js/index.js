
let Criterion = require("./criterion.js");
let Variant = require("./variant.js");
let locale = new (require("./locale.js"))();
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
        {className : 'input tableInput', type : 'text', id : 'criterionName' + index,
        value : obj ? obj.getName() : ''}));
    container.appendChild(tableNewColumn('input', 'divTableCell', 
        {className : 'input tableInput', type : 'number', min : '0', step : '0.01', 
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
    result.appendChild(headerElement(locale.translate('variantName'), 
        marks ? 0 : null, "marksDataBody"));
    let ids = appData.getCriteriaIDs();
    for (let i in ids) {
        result.appendChild(headerElement(appData.getCriterion(ids[i]).name,
            marks ? Number(i) + 1 : null, "marksDataBody"));
    }
    result.appendChild(headerElement(marks ? locale.translate('total') : locale.translate('deleteHeader'),
        marks ? ids.length : null, "marksDataBody"));
    return result;
}

function headerElement(name, index, tableName) {
    let result = document.createElement('div');
    result.className = 'divTableCell';
    result.innerHTML = name;
    if (typeof(index) === 'number') //add sort functionality
        result.onclick = function() {sortTable(tableName, index);};
    return result;
}

function weightsTableHeader() {
    let result = document.createElement('div');
    result.className = "divTableRow";
    result.appendChild(headerElement(locale.translate('weightName')));
    result.appendChild(headerElement(locale.translate('weight')));
    result.appendChild(headerElement(locale.translate('inverted')));
    result.appendChild(headerElement(locale.translate('deleteHeader')));
    return result;
}

function weightsTableInit() {
    let title = document.getElementById('criteriaTitle');
    if (title)
        title.innerHTML = locale.translate('criteria');
    let table = document.getElementById('weightsDataBody');
    if (table === undefined)
        return;
    clearTable(table);
    table.appendChild(weightsTableHeader());
    let ids = appData.getCriteriaIDs();
    for (let i in ids) {
        table.appendChild(newWeightTableRowElements(ids[i], appData.getCriterion(ids[i])));
        let index = ids[i];
        document.getElementById('deleteCriterionButton' + index).onclick = (
            function(index) {return function() {
            weightTabledeleteRow(index);
        };})(index);
    }
}

function variantsTableInit() {
    let title = document.getElementById('variantsTitle');
    if (title)
        title.innerHTML = locale.translate('variants');
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
        {className : 'input tableInput', type : 'text', 
        id : 'variantName' + index, value : variant.name}));
    for (let i in ids) {
        result.appendChild(tableNewColumn('input', 'divTableCell', 
            {className : 'input tableInput', type : 'number', min : '0', 
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
        title.innerHTML = locale.translate('marks');
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

function sortTable(tableName, n) {
    //from https://www.w3schools.com/howto/howto_js_sort_table.asp
    let rows, i, x, y, shouldSwitch, switchcount = 0;
    let table = document.getElementById(tableName);
    let switching = true;
    //Set the sorting direction to ascending:
    let dir = "asc"; 
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.childNodes;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].childNodes[n];
            y = rows[i + 1].childNodes[n];
            /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
            if (dir == "asc") {
                if (x.firstChild.innerHTML.toLowerCase() > y.firstChild.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.firstChild.innerHTML.toLowerCase() < y.firstChild.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /*If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

//Some texts:

document.getElementById('nameTitle').innerHTML = locale.translate('menu', 'name');
document.getElementById('descTitle').innerHTML = locale.translate('menu', 'desc');
document.getElementById('editName').innerHTML = locale.translate('menu', 'desc');
document.getElementById('editWeights').innerHTML = locale.translate('menu', 'weights');
document.getElementById('editVariants').innerHTML = locale.translate('menu', 'variants');
document.getElementById('showResult').innerHTML = locale.translate('menu', 'result');

//Some event listeners:

document.getElementById('editName').onmousedown = function() {
    hideTable('variantsData');
    hideTable('marksData');
    hideTable('weightsData');
    showTable('nameData');
};

document.getElementById('editWeights').onmousedown = function() {
    hideTable('variantsData');
    hideTable('marksData');
    hideTable('nameData');
    showTable('weightsData');
    saveAll();
    weightsTableInit();
};

document.getElementById('editVariants').onmousedown = function() {
    hideTable('weightsData');
    hideTable('marksData');
    hideTable('nameData');
    showTable('variantsData');
    saveAll();
    variantsTableInit();
};

document.getElementById('showResult').onmousedown = function() {
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
