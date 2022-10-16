import * as mireaDefault from './assets/logos/MIREA_default.svg'
import * as mireaHover from './assets/logos/MIREA_hover.svg'
import * as vkDefault from './assets/logos/VK_default.svg'
import * as vkHover from './assets/logos/VK_hover.svg'

const getById = (id) => document.getElementById(id)
mireaDefault, mireaHover, vkDefault, vkHover
// Age input controls
const ageInput = document.querySelectorAll('#memeber-age')
const minAge = 18
const maxAge = 25

ageInput.forEach((input) =>
	input.addEventListener('change', (e) => {
		const age = parseInt(e.target.value)
		if (age < minAge) {
			e.target.value = minAge
		} else if (age > maxAge) {
			e.target.value = maxAge
		}
	})
)
/*
getById('age-minus').addEventListener('click', (e) => {
	e.preventDefault()

	const age = parseInt(ageInput.value)

	if (!age || age <= minAge) {
		ageInput.value = minAge
	} else {
		ageInput.value = age - 1
	}
	return false
})

getById('age-plus').addEventListener('click', (e) => {
	e.preventDefault()

	const age = parseInt(ageInput.value)

	if (!age) {
		ageInput.value = minAge
	} else if (age >= maxAge) {
		ageInput.value = maxAge
	} else {
		ageInput.value = age + 1
	}

	return false
})
*/
getById('register')?.addEventListener(
	'invalid',
	(e) => {
		e.preventDefault()
		getById('error__reg').innerText = e.target.dataset.error
	},
	true
)

global.submitRegistration = (token) => {
	if (!getById('register').checkValidity()) {
		return false
	}

	getById('error__reg').innerText = ''
	fetch(location.origin + '/api/v1/requests/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			captainName: getById('captain-name').value,
			captainEmail: getById('captain-email').value,
			captainTg: getById('captain-tg').value,
			captainAge: getById('age').value,
			member2: getById('member-2').value,
			member3: getById('member-3').value,
			member4: getById('member-4').value,
			university: getById('university').value,
			track: document.querySelector('#register input[name="track"]:checked').value,
			recaptcha: token,
		}),
	})
		.then(() => {
			getById('register').reset()
			const N = document.querySelector('.notification div')

			N.classList.add('visible')
			setTimeout(() => {
				N.classList.remove('visible')
			}, 10000)
		})
		.catch(() => {
			console.log('ERROR')
		})

	return false
}

// Animated Orbs
//orbs positions
const orbs = document.querySelectorAll('#oneOrb')
orbs.forEach((orb, i) => {
	orb.style.top = Math.random() * document.body.scrollHeight
	if (i % 2 == 0) orb.style.left = (Math.random() * document.body.clientWidth) / 2
	else orb.style.right = Math.random() * document.body.clientWidth
	orb.style.width = '1350px'
})

const setCssHeight = () => {
	requestAnimationFrame(() => {
		const height = document.querySelector('body > div').scrollHeight

		const header = document.querySelector('header')
		const footer = getById('footer')
		const faq = getById('faq-section')
		const tasks = getById('tasks-section')
		const prises = getById('prises-section')
		const registration = getById('registration-section')

		const heights = [header, tasks, prises, faq, registration, footer].map((element) => {
			return ((element.getBoundingClientRect().top + window.scrollY) / height) * 100
		})

		document.documentElement.style.setProperty('--wrapper-height', String(height) + 'px')
		/*document.documentElement.style.setProperty(
			'--body-bg',
			`linear-gradient( to bottom,` +
				`#4a0089,` +
				`#1a0029 ${heights[1]}%,
      #660089 ${heights[2]}%,
      #030029 ${heights[3]}%,
      #004189 ${heights[4]}%,
      #030029 ${heights[5]}%,
      #36002b)`
		)*/
	})
}

// подмена икноки мирэа и вк на цветную в хэдере
document.querySelectorAll('#header-icon').forEach((icon) => {
	icon.addEventListener('mouseover', (e) => {
		console.log(e.target.src, e.target.classList.contains('mirea'))
		e.target.src = e.target.classList.contains('mirea') ? mireaHover : vkHover
	})
	icon.addEventListener('mouseleave', (e) => {
		e.target.src = e.target.classList.contains('mirea') ? mireaDefault : vkDefault
	})
})

// открытие/закрытие меню на мобильных
document.querySelector('.hamburger').addEventListener('click', (e) => {
	if (e.target.dataset.opened === 'true') {
		e.target.dataset.opened = 'false'
		document.querySelector('.wrapper').style.display = 'none'
	} else {
		e.target.dataset.opened = 'true'
		document.querySelector('.wrapper').style.display = 'flex'
	}
})

// Нажатие на ссылку на мобильном
document.querySelectorAll('#hamburger-link').forEach((link) =>
	link.addEventListener('click', () => {
		document.querySelector('.hamburger').click()
	})
)

// Нажатие на мобильный хэдер
document.querySelector('.header__navbar-mobile > .logo').addEventListener('click', () => {
	window.scrollTo(0, 0)
})

//скрытие мобильного хэдера при скролле вниз
let prevScrollPos = window.pageYOffset
window.addEventListener('scroll', function () {
	let currentScrollPos = window.pageYOffset
	if (prevScrollPos > currentScrollPos) {
		document.querySelector('.header__navbar-mobile').style.top = '0'
	} else {
		document.querySelector('.header__navbar-mobile').style.top = '-60px'
	}
	prevScrollPos = currentScrollPos
})

window.addEventListener('resize', () => setTimeout(setCssHeight, 100))
window.addEventListener('click', () => setTimeout(setCssHeight, 310)) // 310ms because animation lasts 300ms
setTimeout(setCssHeight, 100)
