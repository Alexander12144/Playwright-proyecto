const { expect } = require('@playwright/test');

class BasePage {
    constructor(page) {
        this.page = page;
    }

    async goto(path, options = {}) {
        await this.page.goto(path, options);
        await this.waitForPageReady();
    }

    async click(locator, options = {}) {
        await locator.click(options);
    }

    async fill(locator, value, options = {}) {
        await locator.fill(value, options);
    }

    async waitForPageReady(timeout = 15000) {
        await Promise.all([
            this.page.waitForLoadState('load', { timeout }),
            this.page.waitForLoadState('networkidle', { timeout })
        ]);
    }

    async expectVisible(locator, timeout = 10000) {
        await expect(locator).toBeVisible({ timeout });
    }

    frameLocator(selector) {
        return this.page.frameLocator(selector);
    }
}

module.exports = { BasePage };