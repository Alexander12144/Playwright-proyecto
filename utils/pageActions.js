const { expect } = require('@playwright/test');

async function clickAndExpectVisible(clickLocator, visibleLocator, timeout = 10000) {
    await Promise.all([
        clickLocator.click(),
        expect(visibleLocator).toBeVisible({ timeout })
    ]);
}

async function expectVisible(locator, timeout = 10000) {
    await expect(locator).toBeVisible({ timeout });
}

async function waitForPageReady(page, timeout = 15000) {
    await Promise.all([
        page.waitForLoadState('load', { timeout }),
        page.waitForLoadState('networkidle', { timeout })
    ]);
}

module.exports = {
    clickAndExpectVisible,
    expectVisible,
    waitForPageReady
};