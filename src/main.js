const getById = (id) => document.getElementById(id)
// Age input controls
const ageInput = [getById('memeber-1-age'), getById('memeber-2-age')]
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
getById('register').addEventListener(
	'invalid',
	(e) => {
		e.preventDefault()
		getById('error__reg').innerText = e.target.dataset.error || ''
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
			age1: getById('memeber-1-age').value,
			age2: getById('memeber-2-age').value,
			fio_1: getById('memeber-1').value,
			fio_2: getById('memeber-2').value,
			univercity_1: getById('memeber-1-institute').value,
			univercity_2: getById('memeber-2-institute').value,
			tg_1: getById('memeber-1-telegram').value,
			tg_2: getById('memeber-2-telegram').value,
			team_name: getById('team-name').value,
			email_1: getById('memeber-1-email').value,
			email_2: getById('memeber-2-email').value,
			case_number: document.querySelector('#register input[name="track"]:checked').value,
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

		document.documentElement.style.setProperty('--wrapper-height', String(height) + 'px')
	})
}

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
setTimeout(setCssHeight, 100)
