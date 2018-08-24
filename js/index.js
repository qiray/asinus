
let AppData = require("./appdata.js");

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
}

function weightTableAddRow() {
    //TODO: add logic
    let table = document.getElementById('weightsDataBody');
    if (table === undefined)
        return;
    let index = appData.getCriteriaCount();
    let row_template = `
    <div class="divTableRow" id ="weightTableRow` + index + `">
        <div class="divTableCell"><input type="text" class="tableInput"></div>
        <div class="divTableCell"><input type="number" min="0" class="tableInput"></div>
        <div class="divTableCellSmall"><input type="checkbox"></div>
        <div class="divTableCellSmall"><button class="plusButton" id="deleteCriterionButton` + index + `">-</button></div>
    </div>`; //TODO: replace with addElement
    appData.addCriterion();
    table.appendChild(newWeightTableRowElements(index));
    document.getElementById('deleteCriterionButton' + index).onclick = function() {
        weightTabledeleteRow(index);
    };
}

function tableNewColumn(type, columnClassName, objClassName, params) { //TODO: test
    var column = document.createElement('div');
    column.className = columnClassName;
    var obj = document.createElement('type');
    obj.className = objClassName;
    for (let prop in params) {
        obj[prop] = params[prop];
    }
    column.appendChild(obj);
    return column;
}

function newWeightTableRowElements(index) { //TODO: test
    var container = document.createElement('div');
    container.className = "divTableRow";
    container.id = "weightTableRow" + weightTableRow;

    var column1 = document.createElement('div');
    column1.className = "divTableCell";
    var input1 = document.createElement('input');
    input1.className = "tableInput";
    input1.type = "text";
    column1.appendChild(input1);
    container.appendChild(column1);

    var column2 = document.createElement('div');
    column1.className = "divTableCell";
    var input2 = document.createElement('input');
    input2.className = "tableInput";
    input2.type = "number";
    input2.min = "0";
    column2.appendChild(input2);
    container.appendChild(column2);

    return container;
}

document.getElementById('editWeights').onclick = function() {
    showWeightsTable();
};

document.getElementById('weightsPlusButton').onclick = function() {
    weightTableAddRow();
};
