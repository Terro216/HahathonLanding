// CreativeHack 2022 archive: registration is closed. No network or storage API.
const form = document.getElementById('register')
form.addEventListener('submit', (event) => event.preventDefault())

// Keep the original case-selection affordance as a visual archive interaction.
document.querySelectorAll('[data-case]').forEach((link) => {
	link.addEventListener('click', () => {
		document.getElementById(link.dataset.case).checked = true
	})
})

const menu = document.querySelector('.wrapper')
const hamburger = document.querySelector('.hamburger')
const mobileHeader = document.querySelector('.header__navbar-mobile')
const setMenu = (opened) => {
	hamburger.dataset.opened = String(opened)
	hamburger.setAttribute('aria-expanded', String(opened))
	hamburger.setAttribute('aria-label', opened ? 'Закрыть меню' : 'Открыть меню')
	menu.style.display = opened ? 'flex' : 'none'
}
hamburger.addEventListener('click', () => setMenu(hamburger.dataset.opened !== 'true'))
document.querySelectorAll('.hamburger-link').forEach((link) => {
	link.addEventListener('click', () => setMenu(false))
})
document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') setMenu(false)
})
document.querySelector('.header__navbar-mobile > .logo').addEventListener('click', () => {
	setMenu(false)
	window.scrollTo(0, 0)
})

let prevScrollPos = window.scrollY
window.addEventListener('scroll', () => {
	const currentScrollPos = window.scrollY
	mobileHeader.style.top = prevScrollPos > currentScrollPos || currentScrollPos <= 0 ||
		hamburger.dataset.opened === 'true' ? '0' : '-60px'
	prevScrollPos = currentScrollPos
}, { passive: true })

// Retain the original CSS FAQ transitions, adding keyboard operation.
document.querySelectorAll('.question-card').forEach((card) => {
	const input = card.querySelector('input')
	const label = card.querySelector('label')
	label.addEventListener('keydown', (event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault()
			input.click()
		}
	})
	input.addEventListener('change', () => label.setAttribute('aria-expanded', String(input.checked)))
})

// Same twenty floating SVG orbs, speeds, blur and grayscale as in 2022.
// Re-measure after fonts, FAQ expansion and resize instead of freezing height.
const content = document.querySelector('body > div')
const orbs = [...document.querySelectorAll('.orbs > svg')].map((orb, i) => ({
	orb, side: i % 2 === 0 ? 'left' : 'right', x: Math.random(), y: Math.random(), i,
}))
const setCssHeight = () => {
	const height = content.scrollHeight
	const width = content.scrollWidth
	document.documentElement.style.setProperty('--wrapper-height', `${height}px`)
	orbs.forEach(({ orb, side, x, y, i }) => {
		orb.style.top = `${y * height}px`
		orb.style[side] = `${x * width / (i % 2 === 0 ? 2 : 1)}px`
		orb.style.width = '1350px'
	})
}
new ResizeObserver(setCssHeight).observe(content)
document.fonts.ready.then(setCssHeight)
window.addEventListener('resize', () => {
	if (window.innerWidth > 555) setMenu(false)
	setCssHeight()
})
setCssHeight()
