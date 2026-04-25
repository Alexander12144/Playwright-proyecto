const { expect } = require('@playwright/test');

class BasePage {
    constructor(page) {
        this.page = page;
    }

    /**
     * Espera a que el loader de Bantotal aparezca y desaparezca.
     * Se define dinámicamente para evitar errores de referencia en frames refrescados.
     */
    async waitForProcessing(timeout = 25000) {
        // Localizador dinámico: busca el loader sin importar el nivel de profundidad
        const loader = this.page.locator('iframe[id="1"]')
            .contentFrame()
            .getByText('Procesando, por favor espere');

        try {
            // Damos un margen pequeño para que el loader aparezca
            await loader.waitFor({ state: 'visible', timeout: 2000 });
            // Esperamos a que el sistema termine de procesar
            await loader.waitFor({ state: 'hidden', timeout });
        } catch (e) {
            // Si el loader no aparece en 2s, asumimos que el sistema ya procesó
        }
    }

    // ========== NAVEGACIÓN Y ESTADO ==========

    async goto(path, options = {}) {
        await this.page.goto(path, options);
        await this.page.waitForLoadState('load');
    }

    async waitForPageReady(timeout = 15000) {
        await this.page.waitForLoadState('domcontentloaded', { timeout });
        await this.page.waitForLoadState('networkidle', { timeout });
    }

    // ========== INTERACCIONES RESILIENTES ==========

    /**
     * Selección de opciones con reintento automático y manejo de loader.
     */
    async selectOption(locator, value) {
        try {
            await locator.waitFor({ state: 'visible', timeout: 5000 });
            await locator.selectOption(value);
        } catch (error) {
            // Reintento tras breve pausa si el frame se "pasmó"
            await this.page.waitForTimeout(1000);
            await locator.selectOption(value);
        }
        await this.waitForProcessing();
    }

    /**
     * Click estándar con espera de procesamiento posterior.
     */
    async click(locator) {
        await locator.click();
        await this.waitForProcessing();
    }

    // ========== UTILITARIOS DE DATOS ==========

    async getInputValue(locator) {
        await locator.waitFor({ state: 'visible' });
        return await locator.inputValue();
    }

    async getText(locator) {
        await locator.waitFor({ state: 'visible' });
        return (await locator.textContent()).trim();
    }
}

module.exports = { BasePage };