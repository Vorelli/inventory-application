const tbody = document.querySelector('table.shipmentItems tbody');
const rowToClone = tbody.querySelector('.rowToClone');
let shipment = document.currentScript.getAttribute('shipment');

function appendShipmentRow(numRows) {
  for (let i = 0; i < numRows; i++) {
    const clone = rowToClone.cloneNode(true);
    clone.style.display = 'table-row';
    return tbody.appendChild(clone);
  }
}

function deleteRow(src) {
  src.parentElement.parentElement.parentElement.removeChild(
    src.parentElement.parentElement
  );
}

if (shipment) {
  tbody.removeChild(tbody.querySelector('.rowToClone'));
  shipment = JSON.parse(shipment);
  for (let i = 0; i < shipment.items.length; i++) {
    const tableRow = appendShipmentRow(1);
    tableRow.querySelector('#a' + shipment.items[i]).selected = true;
    tableRow.querySelector('input').value = shipment.itemQuantities[i];
  }
}
