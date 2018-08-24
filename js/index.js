
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
    console.log(index);
    console.log(obj);
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
    table.innerHTML += row_template;
    // document.getElementById('deleteCriterionButton' + index).onclick = function() {
    //     console.log(index);
    //     weightTabledeleteRow(index);
    // };
}

document.getElementById('editWeights').onclick = function() {
    showWeightsTable();
};

document.getElementById('weightsPlusButton').onclick = function() {
    weightTableAddRow();
};

function a() {
    console.log(11);
}
