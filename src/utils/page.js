const expect = require('chai').expect
const puppeteer = require('puppeteer')
const { getCodes, getBrand } = require('./brand.js')

const type = async (page, selector, value) => {
  await waitForElement(page, selector)

  await page.type(selector, value, { delay: 20 })
}

const click = async (page, selector) => {
  await waitForElement(page, selector)

  await page.click(selector)
}

const clickAndWaitForResponse = async (page, selector) => {
  await waitForElement(page, selector)

  await click(page, selector)

  await page.waitForNetworkIdle()

  await page.waitForTimeout(1500)
}

const waitForElement = async (page, selector) => {
  let element = null
  let counter = 10
  while (!element && counter !== 0) {
    await page.waitForTimeout(1000)
    try {
      element = await page.waitForSelector(selector, { visible: true, timeout: 500 })
    } catch (e) {
      counter--
    }
  }

  return element
}

const bringPageToFront = async (page) => {
  await page.bringToFront()
  await page.content()
}

const assertElementIsDefined = async (page, selector) => {
  await page.waitForSelector(selector, { visible: true })

  const element = await page.$eval(selector, (item) => {
    return item.innerHTML
  })
  console.log({ element })
  // eslint-disable-next-line jest/valid-expect
  expect(element).not.to.equal(undefined)
}

const assertElementIsNotDefined = async (page, selector) => {
  const element = await page.waitForSelector(selector, { visible: true, timeout: 2000 }).catch(() => {
    return undefined
  })

  // eslint-disable-next-line jest/valid-expect
  expect(element).to.equal(undefined)
}

const assertXpathElementIsDefined = async (page, xpath) => {
  await page.waitForXPath(xpath, { visible: true })
}

const assertShadowDomElementIsDefined = async (page, selector) => {
  const item = await selectShadowElement(page, selector)
  expect(item).not.to.equal(undefined)
}

const assertElementIsEnabled = async (page, selector) => {
  const element = await page.$eval(selector, (ele) => {
    ele.scrollIntoView(true)
    return ele.disabled
  })

  expect(element).equal(false)
}

const assertElementIsDisabled = async (page, selector) => {
  const element = await page.$eval(selector, (ele) => {
    return ele.disabled
  })

  expect(element).equal(true)
}

const clearInputField = async (page, selector) => {
  const inputValue = await page.$eval(selector, (el) => el.value)

  await page.focus(selector)
  for (let i = 0; i < inputValue.length; i++) {
    await page.keyboard.press('Backspace')
  }
}

const openBrowserAndPage = async (headless, viewport, args = [], url = URL) => {
  const browser = await puppeteer.launch({
    args: ['--start-fullscreen'].concat(args),
    headless: headless,
    defaultViewport: null
  })


  const page = await browser.newPage()

  if (viewport) {
    await page.setViewport(viewport)
  }

  page.setDefaultNavigationTimeout(60000)

  await page.goto(url)

  await page.waitForNetworkIdle({ timeout: 5000 })

  return [page, browser]
}

const openBrowser = async (headless, args = []) => {
  return await puppeteer.launch({
    args: ['--start-maximized'].concat(args),
    headless: headless,
    defaultViewport: null
  })
}

const openPage = async (browser, viewport, url = URL) => {
  const page = await browser.newPage()
  if (viewport) {
    await page.setViewport(viewport)
  }
  page.setDefaultNavigationTimeout(60000)

  await page.goto(url)

  await page.waitForNetworkIdle({ timeout: 5000 })
  return page
}

// Open browser and create page for each brand
const openBrowserAndPages = async () => {
  const codes = await getCodes()

  const browser = await openBrowser(false, [
    '--disable-web-security',
    '--disable-features=IsolateOrigins',
    '--disable-site-isolation-trials'
  ])

  const pages = {}
  for (const brandKey of Object.keys(codes)) {
    const page = await openPage(
      browser,
      { width: 1920, height: 1080 },
      `${getBrand(brandKey).url}?otc=${codes[brandKey]}`
    )
    pages[brandKey] = page
  }

  return [browser, pages]
}

const closeBrowser = async (browser, shouldClose) => {
  if (shouldClose) {
    await browser.close()
  }
}

const selectShadowElementHandler = (containerSelector, elementSelector) => {
  try {
    // get the container
    const container = document.querySelector(containerSelector)

    // Here's the important part, select the shadow by the parentnode of the
    // actual shadow root and search within the shadowroot which is like another DOM!,
    return container.shadowRoot.querySelector(elementSelector)
  } catch (err) {
    return null
  }
}

const selectShadowElement = async (page, selector, shadowDomSelector = defaultShadowDomSelector) => {
  return page.evaluateHandle(selectShadowElementHandler, shadowDomSelector, selector)
}

const waitForShadowElement = async (page, selector, shadowDomSelector = defaultShadowDomSelector) => {
  await page.waitForTimeout(3000)
  return page.waitForFunction((containerSelector, elementSelector) => {
    const container = document.querySelector(containerSelector)
    console.log({ v: container.shadowRoot.querySelector(elementSelector) })
    return !!container.shadowRoot.querySelector(elementSelector)
  }, { polling: 'raf' }, shadowDomSelector, selector)
}

const closeTab = async (tab, shouldClose) => {
  if (shouldClose) {
    await tab.close()
  }
}

module.exports = {
  assertElementIsDefined,
  assertElementIsNotDefined,
  assertElementIsDisabled,
  assertElementIsEnabled,
  assertShadowDomElementIsDefined,
  waitForElement,
  type,
  click,
  clickAndWaitForResponse,
  bringPageToFront,
  openBrowserAndPage,
  openBrowser,
  openPage,
  openBrowserAndPages,
  closeBrowser,
  clearInputField,
  assertXpathElementIsDefined,
  selectShadowElement,
  selectShadowElementHandler,
  closeTab,
  waitForShadowElement
}
