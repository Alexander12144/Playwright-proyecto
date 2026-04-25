const { expect } = require('@playwright/test');
const { TIMEOUTS } = require('./constants');

async function clickAndExpectVisible(clickLocator, visibleLocator, timeout = TIMEOUTS.LONG) {
    await Promise.all([
        clickLocator.click(),
        expect(visibleLocator).toBeVisible({ timeout })
    ]);
}

async function expectVisible(locator, timeout = TIMEOUTS.LONG) {
    await expect(locator).toBeVisible({ timeout });
}


async function expectHidden(locator, timeout = TIMEOUTS.LONG) {
    await expect(locator).toBeHidden({ timeout });
}

async function waitForPageReady(page, timeout = TIMEOUTS.PAGE_LOAD) {
    await page.waitForLoadState('load', { timeout });
}

async function waitForAllVisible(locator, timeout = TIMEOUTS.LONG) {
    const count = await locator.count();
    for (let i = 0; i < count; i++) {
        await expect(locator.nth(i)).toBeVisible({ timeout });
    }
}

async function fillMultiple(fieldsMap) {
    for (const [locator, value] of Object.entries(fieldsMap)) {
        await locator.fill(value);
    }
}

async function takeScreenshot(page, name = 'screenshot') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ path: `./screenshots/${name}-${timestamp}.png`, fullPage: true });
}


module.exports = {
    clickAndExpectVisible,
    expectVisible,
    expectHidden,
    waitForPageReady,
    waitForAllVisible,
    fillMultiple,
    takeScreenshot
};
