const form = document.querySelector('form');
const categories = form.querySelectorAll('.category');
const filterText = form.querySelector('input#_filter');

function filter() {
  var re = new RegExp(filterText.value);
  categories.forEach((category) => {
    console.log(
      re,
      category.querySelector('label').textContent,
      re.test(category.querySelector('label').textContent)
    );
    if (!re.test(category.querySelector('label').textContent)) {
      category.querySelector('label').style.visibility = 'hidden';
      category.querySelector('label').style.position = 'absolute';
      category.querySelector('input').style.visibility = 'hidden';
      category.querySelector('input').style.position = 'absolute';
    } else {
      category.querySelector('label').style.visibility = 'inherit';
      category.querySelector('label').style.position = 'inherit';
      category.querySelector('input').style.visibility = 'inherit';
      category.querySelector('input').style.position = 'inherit';
    }
  });
}
