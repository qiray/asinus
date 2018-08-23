
function showWeightsTable() {
    let weightsData = document.getElementById('weightsData');
    console.log(weightsData);
    if (weightsData === undefined)
        return;
    weightsData.style.display = 'block';
}

function weightTableAddRow() {
    //TODO: add logic
    let table = document.getElementById('weightsDataBody');
    if (table === undefined)
        return;
    let row_template = `<div class="divTableRow">
        <div class="divTableCell"><input type="text" class="tableInput"></div>
        <div class="divTableCell"><input type="number" min="0" class="tableInput"></div>
        <div class="divTableCellSmall"><input type="checkbox"></div>
        <div class="divTableCellSmall"><button class="plusButton">-</button></div>
    </div>`;
    table.innerHTML += row_template;
}

document.getElementById('editWeights').onclick = function() {
    showWeightsTable();
};

document.getElementById('weightsPlusButton').onclick = function() {
    weightTableAddRow();
};
