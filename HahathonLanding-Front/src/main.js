import './style.css';

const getById = (id) => document.getElementById(id);

// Age input controls
const ageInput = getById('age');
const minAge = 18;
const maxAge = 25;

ageInput.addEventListener('change', (e) => {
  const age = parseInt(e.target.value);
  if (age < minAge) {
    e.target.value = minAge;
  } else if (age > maxAge) {
    e.target.value = maxAge;
  }
});

getById('age-minus').addEventListener('click', (e) => {
  e.preventDefault();

  const age = parseInt(ageInput.value);

  if (!age || age <= minAge) {
    ageInput.value = minAge;
  } else {
    ageInput.value = age - 1;
  }
  return false;
});

getById('age-plus').addEventListener('click', (e) => {
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

getById('register').addEventListener('invalid', (e) => {
  e.preventDefault();
  getById('error__reg').innerText = e.target.dataset.error;
}, true);

global.submitRegistration = (token) => {
  if (!getById('register').checkValidity()) {
    return false;
  }

  getById('error__reg').innerText = '';
  fetch(location.origin + '/api/v1/requests/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      captainName: getById('captain-name').value,
      captainEmail: getById('captain-email').value,
      captainTg: getById('captain-tg').value,
      captainAge: getById('age').value,
      member2: getById('member-2').value,
      member3: getById('member-3').value,
      member4: getById('member-4').value,
      track: document.querySelector('#register input[name="track"]:checked').value,
      recaptcha: token
    })
  }).then(() => {
    getById('register').reset();
    const N = document.querySelector('.notification div');

    N.classList.add('visible');
    setTimeout(() => {
      N.classList.remove('visible');
    }, 10000);
  }).catch(() => {
    console.log('ERROR');
  });

  return false;
}

// Animated Orbs

const setCssHeight = () => {
  requestAnimationFrame(() => {
    const height = document.querySelector('body > div').scrollHeight;

    const header = document.querySelector('header');
    const footer = getById('footer');
    const faq = getById('faq-section');
    const tasks = getById('tasks-section');
    const prises = getById('prises-section');
    const registration = getById('registration-section');

    const heights = [header, tasks, prises, faq, registration, footer].map((element) => {
      return (element.getBoundingClientRect().top + window.scrollY) / height * 100;
    });

    document.documentElement.style.setProperty('--wrapper-height', String(height) + 'px');
    document.documentElement.style.setProperty('--body-bg', `linear-gradient( to bottom,` +
      `#4a0089,` +
      `#1a0029 ${heights[1]}%,
      #660089 ${heights[2]}%,
      #030029 ${heights[3]}%,
      #004189 ${heights[4]}%,
      #030029 ${heights[5]}%,
      #36002b)`);
  });
}

window.addEventListener('resize', () => setTimeout(setCssHeight, 100));
window.addEventListener('click', () => setTimeout(setCssHeight, 310)); // 310ms because animation lasts 300ms
setTimeout(setCssHeight, 100);
