const form = document.querySelector('form');
const categories = form.querySelectorAll('.category');
const filterText = form.querySelector('input#_filter');

function filter() {
  var re = new RegExp(filterText.value.toUpperCase());
  categories.forEach((category) => {
    console.log(
      re,
      category,
      category.querySelector('label').textContent,
      re.test(category.querySelector('label').textContent.toUpperCase())
    );
    if (re.test(category.querySelector('label').textContent.toUpperCase())) {
      category.querySelector('label').style.visibility = 'initial';
      category.querySelector('label').style.position = 'initial';
      category.querySelector('input').style.visibility = 'initial';
      category.querySelector('input').style.position = 'initial';
    } else {
      category.querySelector('label').style.visibility = 'hidden';
      category.querySelector('label').style.position = 'absolute';
      category.querySelector('input').style.visibility = 'hidden';
      category.querySelector('input').style.position = 'absolute';
    }
  });
}
