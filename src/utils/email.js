const pageUtils = require('./page')

const openMailDev = async (browser) => {
  const emailPage = await browser.newPage()
  await emailPage.goto(mailDevURL)

  return emailPage
}

const clearEmails = async (emailPage) => {
  await emailPage.reload()
  await emailPage.content()
  await emailPage.click(
    'body > div > div.main-container > div.application-toolbar > ul:nth-child(1) > li:nth-child(2) > a'
  )
}

const openMailDevThenFocusBack = async (browser, page) => {
  const emailPage = await openMailDev(browser)
  await clearEmails(emailPage)

  await page.waitForNetworkIdle()
  await page.bringToFront()
  await page.content()
  await page.waitForTimeout(1000)

  return emailPage
}

const getElementFromEmail = async (subject, browser, selector, emailPage, fromEmail, nth = 1) => {
  await pageUtils.bringPageToFront(emailPage)

  await emailPage.reload()

  await emailPage.waitForTimeout(3000)

  // await emailPage.waitForNetworkIdle({ timeout: 5000 })

  await pageUtils.waitForElement(emailPage, 'body > div > div.sidebar > div.sidebar-scrollable-content > ul')

  const sideBar = await emailPage.$('body > div > div.sidebar > div.sidebar-scrollable-content > ul')

  const titles = await sideBar.$$('li > a')
  const promises = await titles.map(async (el) => {
    const title = await el.$eval('span.title.ng-binding', (el) => el.textContent.trim())
    const from = await el.$eval('span.subline-from.ng-binding', (el) => el.textContent.trim())

    if (title === subject.trim() && from === fromEmail) {
      return el
    }
  })

  const values = await Promise.all(promises)

  let emailIndex = 0
  const el = values.find((el) => {
    if (el != undefined) {
      emailIndex++
    }
    return el !== undefined && emailIndex === nth
  })
  el.click()
  const iframe = await pageUtils.waitForElement(emailPage, 'iframe')
  const frame = await iframe.contentFrame()
  await emailPage.waitForTimeout(1000)

  return await frame.$(selector)
}

const getEmail = async (subject, browser, selector, emailPage, fromEmail, nth = 1) => {
  const element = await getElementFromEmail(subject, browser, selector, emailPage, fromEmail, nth)

  return await element.evaluate((item) => item.innerHTML)
}
const loginFnF = async (browser, page, emailPage) => {
  const heading = await page.$eval('main h1', (el) => el.textContent)
  expect(heading).to.equal('Verify your income')

  await pageUtils.assertElementIsDefined(page, '#email')
  await pageUtils.type(page, '#email', email)

  await pageUtils.clickAndWaitForResponse(page, '[data-testid=btn-send-code]')

  const code = await emailUtils.getEmail('Verification Code', browser, '[data-testid=code]', emailPage, email)
  await page.bringToFront()

  await pageUtils.assertElementIsDefined(page, '#code')
  await pageUtils.type(page, '#code', code)

  await pageUtils.clickAndWaitForResponse(page, '[data-testid=btn-login]')

  return { emailPage }
}
module.exports = {
  openMailDev,
  clearEmails,
  getEmail,
  getElementFromEmail,
  openMailDevThenFocusBack,
  loginFnF

}
