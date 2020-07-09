const options = document.querySelectorAll('option');
const defaultOption = document.querySelector('option');
const selected = document.currentScript.getAttribute('select');
options.forEach((option) => {
  if (option.value === selected) {
    defaultOption.selected = false;
    option.selected = true;
  }
});
