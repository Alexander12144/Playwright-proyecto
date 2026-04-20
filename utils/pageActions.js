const { expect } = require('@playwright/test');
const { TIMEOUTS } = require('./constants');

/**
 * Utilidades comunes para acciones en página
 * ⚠️ Solo funciones puras y reutilizables
 */

/**
 * Ejecutar click y esperar elemento visible
 */
async function clickAndExpectVisible(clickLocator, visibleLocator, timeout = TIMEOUTS.LONG) {
    await Promise.all([
        clickLocator.click(),
        expect(visibleLocator).toBeVisible({ timeout })
    ]);
}

/**
 * Validar que elemento es visible
 */
async function expectVisible(locator, timeout = TIMEOUTS.LONG) {
    await expect(locator).toBeVisible({ timeout });
}

/**
 * Validar que elemento está oculto
 */
async function expectHidden(locator, timeout = TIMEOUTS.LONG) {
    await expect(locator).toBeHidden({ timeout });
}

/**
 * Esperar a que página esté lista
 */
async function waitForPageReady(page, timeout = TIMEOUTS.PAGE_LOAD) {
    await page.waitForLoadState('load', { timeout });
}

/**
 * Esperar a que todos los elementos de un locator sean visibles
 */
async function waitForAllVisible(locator, timeout = TIMEOUTS.LONG) {
    const count = await locator.count();
    for (let i = 0; i < count; i++) {
        await expect(locator.nth(i)).toBeVisible({ timeout });
    }
}

/**
 * Rellenar múltiples campos a la vez
 */
async function fillMultiple(fieldsMap) {
    for (const [locator, value] of Object.entries(fieldsMap)) {
        await locator.fill(value);
    }
}

/**
 * Tomar screenshot con nombre descriptivo
 */
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
