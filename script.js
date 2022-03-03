// Age input controls
const ageInput = document.getElementById('age');
const minAge = 18;
const maxAge = 99;

ageInput.addEventListener('change', (e) => {
  const age = parseInt(e.target.value);
  if (age < minAge) {
    e.target.value = minAge;
  } else if (age > maxAge) {
    e.target.value = maxAge;
  }
});

document.getElementById('age-minus').addEventListener('click', (e) => {
  e.preventDefault();

  const age = parseInt(ageInput.value);

  if (!age || age <= minAge) {
    ageInput.value = minAge;
  } else {
    ageInput.value = age - 1;
  }

  return false;
});

document.getElementById('age-plus').addEventListener('click', (e) => {
  e.preventDefault();

  const age = parseInt(ageInput.value);

  if (!age) {
    ageInput.value = minAge;
  } else if (age >= maxAge) {
    ageInput.value = maxAge;
  } else {
    ageInput.value = age + 1;
  }

  return false;
});

function submitRegistration() {
  console.log('!!!');

  return false;
}
