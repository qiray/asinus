
let AppData = require("./appdata.js");
let Criterion = require("./criterion.js");

let appData = new AppData.AppData(); //application data

function showWeightsTable() {
    let weightsData = document.getElementById('weightsData');
    if (weightsData === undefined)
        return;
    weightsData.style.display = 'block';
}

function weightTabledeleteRow(index) {
    let obj = document.getElementById("weightTableRow" + index);
    if (obj === undefined)
        return;
    obj.remove();
    appData.deleteCriterion(index);
    console.log(appData);
}

function weightTableAddRow() {
    let table = document.getElementById('weightsDataBody');
    if (table === undefined)
        return;
    let index = appData.getCriteriaCount();
    appData.addCriterion();
    table.appendChild(newWeightTableRowElements(index));
    document.getElementById('deleteCriterionButton' + index).onclick = function() {
        weightTabledeleteRow(index);
    };
    console.log(appData);
}

function tableNewColumn(type, columnClassName, params) {
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
    let container = document.createElement('div');
    container.className = "divTableRow";
    container.id = "weightTableRow" + index;
    container.appendChild(tableNewColumn('input', 'divTableCell', 
        {className : 'tableInput', type : 'text', id : 'criterionName' + index}));
    container.appendChild(tableNewColumn('input', 'divTableCell', 
        {className : 'tableInput', type : 'number', min : '0', step : '0.01', id : 'criterionValue' + index}));
    container.appendChild(tableNewColumn('input', 'divTableCellSmall', 
        {type : 'checkbox', id : 'criterionInverted' + index}));
    container.appendChild(tableNewColumn('button', 'divTableCellSmall', 
        {className : 'plusButton', id : 'deleteCriterionButton' + index, innerHTML : '-'}));
    return container;
}

function saveAll() {
    saveCriteria();
}

function saveCriteria() {
    let count = appData.getCriteriaCount();
    try {
        for (let i = 0; i < count; i++) {
            appData.updateCriterion(i, new Criterion.Criterion(
                document.getElementById('criterionName' + i).value,
                document.getElementById('criterionValue' + i).value,
                document.getElementById('criterionInverted' + i).checked
            ));
        }
    } catch(e) {
        console.log('Error ' + e.name + ": " + e.message + "\n" + e.stack);
    }
    console.log(appData);
}

document.getElementById('editWeights').onclick = function() {
    showWeightsTable();
};

document.getElementById('editVariants').onclick = function() {
    saveAll();
};

document.getElementById('weightsPlusButton').onclick = function() {
    weightTableAddRow();
};

document.getElementById('showResult').onclick = function() {
    saveAll();
};
