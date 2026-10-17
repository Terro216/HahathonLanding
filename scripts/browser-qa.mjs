import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { mkdirSync, writeFileSync } from 'node:fs'
const require = createRequire(import.meta.url)
const { chromium } = require(process.argv[4] || 'playwright')
const base = process.argv[2] || 'http://127.0.0.1:18123'
const output = process.argv[3] || '/tmp/creativehack-browser'
const baseline = process.argv.includes('--baseline')
mkdirSync(output, { recursive: true })
const errors = [], failed = [], requests = [], checks = [], layouts = []
const ok = (name, value) => { assert.ok(value, name); checks.push(name) }
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] })
try {
 const widths = (process.argv.find(x=>x.startsWith('--widths='))?.split('=')[1] || '1440,768,390,320').split(',').map(Number)
 for (const width of widths) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, isMobile: width < 556, hasTouch: width < 556 })
  // Reproducible initial positions, while testing real CSS animation over time.
  await context.addInitScript(() => { let s = 2022; Math.random = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646 })
  if (baseline) await context.route('https://**', route => route.abort())
  const page = await context.newPage()
  page.on('pageerror', e => errors.push(`${width}: ${e.message}`))
  page.on('console', m => { if (m.type() === 'error' && !baseline) errors.push(`${width}: ${m.text()}`) })
  page.on('request', r => requests.push({ width, method: r.method(), url: r.url(), resource: r.resourceType() }))
  page.on('requestfailed', r => { if (!baseline) failed.push({ width, url: r.url(), reason: r.failure()?.errorText }) })
  page.on('response', r => { if (r.status() >= 400 && !baseline) failed.push({ width, url: r.url(), status: r.status() }) })
  const response = await page.goto(base, { waitUntil: 'networkidle' })
  ok(`${width}: HTTP 200`, response.status() === 200)
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(350)
  await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'}))
  await page.waitForTimeout(350)
  const layout = await page.evaluate(() => ({ width: innerWidth, documentWidth: document.documentElement.scrollWidth, contentHeight: document.querySelector('body > div').scrollHeight, orbHeight: document.querySelector('.orbs').getBoundingClientRect().height,
   overflowing: [...document.querySelectorAll('h1,h2,h3,.button,.curriculum-block,.task,.question-card,#registration-section,footer')].filter(e => { const r=e.getBoundingClientRect(); return r.width && (r.right > innerWidth+1 || r.left < -1) }).map(e => ({tag:e.tagName,cls:e.className,text:e.textContent.slice(0,40),right:e.getBoundingClientRect().right,left:e.getBoundingClientRect().left})) }))
  layouts.push(layout)
  await page.screenshot({ path: `${output}/${width}-top.png` })
  await page.screenshot({ path: `${output}/${width}-full.png`, fullPage: true })
  if (baseline) { await context.close(); continue }
  ok(`${width}: responsive layout`, layout.documentWidth <= width + 1 && layout.overflowing.length === 0)
  ok(`${width}: original sections`, await page.locator('#tasks-section .task').count() === 2 && await page.locator('#prises-section .prise-block').count() === 3 && await page.locator('.question-card').count() === 7)
  const text = await page.locator('body').innerText()
  ok(`${width}: historical content`, ['18.10.2022 20:00','21.10.2022 09:00','21.10.2022 20:00','Двое из ларца','Reality Zero','Samsung Galaxy Buds Live'].every(s => text.includes(s)))
  ok(`${width}: archive and no success claim`, text.includes('Мероприятие завершено') && text.includes('не отправляет данные') && !text.includes('Регистрация прошла успешно'))
  ok(`${width}: all original images`, await page.locator('img').evaluateAll(imgs => imgs.every(i => i.complete && i.naturalWidth > 0)))
  ok(`${width}: local fonts loaded`, await page.evaluate(() => ['Furore','Inter'].every(f => [...document.fonts].filter(x=>x.family.replaceAll('"','')===f).every(x=>x.status==='loaded'))))
  ok(`${width}: 20 animated orbs`, await page.locator('.orbs > svg').count() === 20)
  const before = await page.locator('.orbs > svg').first().evaluate(e => getComputedStyle(e).transform)
  await page.waitForTimeout(450)
  const after = await page.locator('.orbs > svg').first().evaluate(e => getComputedStyle(e).transform)
  ok(`${width}: animation advances`, before !== after && before !== 'none')
  const durations = await page.locator('.orbs > svg').evaluateAll(xs => xs.slice(0,2).map(e=>getComputedStyle(e).animationDuration))
  ok(`${width}: original animation speeds`, JSON.stringify(durations) === JSON.stringify(width <= 800 ? ['18s','16s'] : ['50s','40s']))
  if (width === 1440) {
   const icon=page.locator('.title__icons .vk'); await icon.hover(); await page.waitForTimeout(250)
   ok('desktop: logo hover restores color', await icon.evaluate(e=>getComputedStyle(e).filter)==='grayscale(0)')
  }
  for (let i=0;i<7;i++) {
   const card = page.locator('.question-card').nth(i), label=card.locator('label')
   await label.click(); await page.waitForFunction(id => Number(getComputedStyle(document.getElementById(id)).opacity) >= 0.999, `answer-${i}`, {timeout:5000})
   ok(`${width}: FAQ ${i+1} opens`, await card.locator('input').isChecked() && await card.locator('p').evaluate(e=>getComputedStyle(e).opacity==='1' && e.getBoundingClientRect().height>0))
   await label.press('Enter'); await page.waitForTimeout(350)
   ok(`${width}: FAQ ${i+1} keyboard closes`, !await card.locator('input').isChecked())
  }
  if (width < 556) {
   await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'})); await page.waitForTimeout(450)
   const menu = page.locator('.hamburger')
   for (const id of ['tasks-section','prises-section','faq-section','registration-section']) {
    await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'})); await page.waitForTimeout(400)
    await menu.click(); ok(`${width}: menu opens`, await menu.getAttribute('aria-expanded')==='true')
    await page.locator(`.wrapper a[href="#${id}"]`).click(); await page.waitForTimeout(400)
    await page.waitForFunction(id => Math.abs(document.getElementById(id).getBoundingClientRect().top) < 100, id, { timeout: 5000 })
    ok(`${width}: ${id} mobile anchor`, new URL(page.url()).hash===`#${id}` && await menu.getAttribute('aria-expanded')==='false')
    ok(`${width}: ${id} in viewport`, await page.locator(`#${id}`).evaluate(e=>Math.abs(e.getBoundingClientRect().top)<100))
   }
   await page.evaluate(() => window.scrollTo({top:0,behavior:'instant'})); await page.waitForTimeout(450)
   await menu.click(); await page.keyboard.press('Escape')
   ok(`${width}: Escape closes menu`, await menu.getAttribute('aria-expanded')==='false')
  } else {
   for (const id of ['tasks-section','prises-section','faq-section','registration-section']) {
    await page.locator(`.header__navbar a[href="#${id}"]`).click(); await page.waitForTimeout(400)
    await page.waitForFunction(id => Math.abs(document.getElementById(id).getBoundingClientRect().top) < 100, id, { timeout: 5000 })
    ok(`${width}: ${id} desktop anchor`, new URL(page.url()).hash===`#${id}` && await page.locator(`#${id}`).evaluate(e=>Math.abs(e.getBoundingClientRect().top)<100))
   }
  }
  for (const id of ['task1','task2']) {
   await page.locator(`[data-case="${id}"]`).click(); await page.waitForTimeout(400)
   await page.waitForFunction(() => Math.abs(document.getElementById("registration-section").getBoundingClientRect().top) < 100, null, { timeout: 5000 })
   ok(`${width}: ${id} selection`, await page.locator(`#${id}`).isChecked() && new URL(page.url()).hash==='#registration-section')
  }
  ok(`${width}: form fields and button disabled`, await page.locator('#register input, #form-submit').evaluateAll(xs=>xs.length===14 && xs.every(x=>x.matches(':disabled'))))
  const initialRequests = requests.length
  await page.locator('#register').evaluate(f=> { f.requestSubmit(); f.dispatchEvent(new Event('submit',{cancelable:true,bubbles:true})); })
  await page.keyboard.press('Enter'); await page.waitForTimeout(400)
  ok(`${width}: submission creates no request`, requests.length===initialRequests)
  ok(`${width}: no recaptcha or mail handler`, await page.locator('[src*="recaptcha"],.g-recaptcha,[href^="mailto:"]').count()===0)
  const csp=response.headers()['content-security-policy'] || ''
  ok(`${width}: transport guard`, csp.includes("connect-src 'none'") && csp.includes("form-action 'none'") && csp.includes("frame-src 'none'"))
  await page.screenshot({ path: `${output}/${width}-registration.png` })
  // Background follows expanded content and a viewport resize without navigation.
  await page.locator('.question-card label').first().click(); await page.waitForTimeout(400)
  const heights=await page.evaluate(()=>[document.querySelector('body > div').scrollHeight,document.querySelector('.orbs').offsetHeight])
  ok(`${width}: background follows FAQ height`, heights[0]===heights[1])
  await page.setViewportSize({width:width===1440?1200:width+10,height:800}); await page.waitForTimeout(400)
  ok(`${width}: resize background`, await page.evaluate(()=>document.querySelector('body > div').scrollHeight===document.querySelector('.orbs').offsetHeight))
  ok(`${width}: canonical`, await page.locator('link[rel=canonical]').getAttribute('href')==='https://creativehack.ilyamedve.dev/')
  console.log(JSON.stringify({viewport:width,result:"passed",checks:checks.length}))
  await context.close()
 }
 if (!baseline) {
  ok('no browser errors', errors.length===0)
  ok('no network errors', failed.length===0)
  ok('only same-origin GET/HEAD resources', requests.every(r=>['GET','HEAD'].includes(r.method) && new URL(r.url).origin===new URL(base).origin))
 }
 console.log(JSON.stringify({result:'passed',checks:checks.length,base,baseline,layouts,errors,failed,requests:requests.length},null,2))
 writeFileSync(`${output}/result.json`,JSON.stringify({result:'passed',checks,layouts,errors,failed,requests},null,2)+'\n')
} catch(e) {
 writeFileSync(`${output}/result.json`, JSON.stringify({result:'failed',error:e.message,checks,layouts,errors,failed,requests},null,2)+'\n')
 console.error(JSON.stringify({error:e.message,layouts,errors,failed},null,2)); throw e
} finally { await browser.close() }
