const { expect } = require('@playwright/test');

/**
 * BasePage - Clase base para todos los Page Objects
 */
class BasePage {
    constructor(page) {
        this.page = page;
    }

    // ========== NAVEGACIÓN ==========
    async goto(path, options = {}) {
        await this.page.goto(path, options);
        await this.waitForPageReady();
    }

    // ========== ACCIONES ATÓMICAS BÁSICAS ==========
    /**
     * Click simple en un elemento
     */
    async click(locator) {
        await locator.click();
    }

    /**
     * Llenar input con texto
     */
    async fill(locator, value) {
        await locator.fill(value);
    }

    /**
     * Escribir lentamente (letra por letra)
     */
    async type(locator, value) {
        await locator.type(value, { delay: 50 });
    }

    /**
     * Seleccionar opción en dropdown
     */
    async selectOption(locator, value) {
        await locator.selectOption(value);
    }

    /**
     * Click con force (ignora oculto)
     */
    async forceClick(locator) {
        await locator.click({ force: true });
    }

    /**
     * Presionar tecla
     */
    async press(locator, key) {
        await locator.press(key);
    }

    // ========== ESPERAS Y SINCRONIZACIÓN ==========
    /**
     * Esperar a que la página esté lista
     */
    async waitForPageReady(timeout = 15000) {
        await this.page.waitForLoadState('load', { timeout });
    }

    /**
     * Esperar a un elemento visible
     * ⚠️ USE ONLY FOR BASIC CHECKS
     */
    async waitForVisible(locator, timeout = 15000) {
        await locator.waitFor({ state: 'visible', timeout });
    }

    /**
     * Esperar a un elemento oculto
     */
    async waitForHidden(locator, timeout = 10000) {
        await locator.waitFor({ state: 'hidden', timeout });
    }

    /**
     * Esperar tiempo específico (úsalo con moderación)
     */
    async delay(ms) {
        await this.page.waitForTimeout(ms);
    }

    // ========== OBTENER DATOS ==========
    /**
     * Obtener texto visible
     */
    async getText(locator) {
        return await locator.textContent();
    }

    /**
     * Obtener atributo HTML
     */
    async getAttribute(locator, attribute) {
        return await locator.getAttribute(attribute);
    }

    /**
     * Obtener valor de input
     */
    async getInputValue(locator) {
        return await locator.inputValue();
    }

    /**
     * Contar elementos
     */
    async getCount(locator) {
        return await locator.count();
    }

    // ========== FRAMES ==========
    frameLocator(selector) {
        return this.page.frameLocator(selector);
    }

    // ========== VALIDACIONES BÁSICAS (usar con moderación) ==========
    /**
     * Validar que es visible - USAR SOLO PARA VERIFICACIONES CRÍTICAS
     * Las validaciones deben ir en Actions o Tests
     */
    async expectVisible(locator, timeout = 20000) {
        await expect(locator).toBeVisible({ timeout });
    }

    /**
     * Validar que es invisible
     */
    async expectHidden(locator, timeout = 10000) {
        await expect(locator).toBeHidden({ timeout });
    }

    /**
     * Validar cantidad de elementos
     */
    async expectCount(locator, count) {
        await expect(locator).toHaveCount(count);
    }

    /**
     * Validar que tiene texto
     */
    async expectText(locator, text) {
        await expect(locator).toContainText(text);
    }
}

module.exports = { BasePage };