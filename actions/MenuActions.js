const { expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { TIMEOUTS } = require('../utils/constants');

class MenuActions {
    constructor(page) {
        this.page = page;
        this.homePage = new HomePage(page);
    }

    // ========== VALIDACIONES DE UI ==========

    async validateFullUI() {
        /**
         * Paralelismo: Validamos elementos del DOM principal simultáneamente.
         * Esto reduce el tiempo de ejecución en Smoke Tests.
         */
        await Promise.all([
            expect(this.homePage.logo).toBeVisible({ timeout: TIMEOUTS.MEDIUM }),
            expect(this.homePage.btnInicio).toBeVisible({ timeout: TIMEOUTS.MEDIUM }),
            expect(this.homePage.btnAccesos).toBeVisible({ timeout: TIMEOUTS.MEDIUM }),
            expect(this.homePage.btnAtras).toBeVisible({ timeout: TIMEOUTS.MEDIUM }),
            expect(this.homePage.btnRecargar).toBeVisible({ timeout: TIMEOUTS.MEDIUM })
        ]);
        
        /**
         * Estabilidad: Elementos dentro de frames anidados se validan secuencialmente.
         * Los Getters en HomePage resuelven la profundidad de frames automáticamente.
         */
        await expect(this.homePage.linkActividadUsuario).toBeVisible({ timeout: TIMEOUTS.LONG });
        await expect(this.homePage.cellUsuario).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
        await expect(this.homePage.cellFechaSistema).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    }

    async waitForHomeReady() {
        await expect(this.homePage.linkActividadUsuario).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    }

    // ========== NAVEGACIÓN SEMÁNTICA ==========

    async navigateToBandejaEntrada() {
        // Uso del componente NavigationMenu inyectado en HomePage
        await this.homePage.menu.inicioMenu.click();
        
        await expect(this.homePage.menu.bandejaTareasMenu).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
        await this.homePage.menu.bandejaTareasMenu.click();

        await expect(this.homePage.menu.bandejaEntradaMenu).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
        await this.homePage.menu.bandejaEntradaMenu.click();

        // Sincronización dinámica post-navegación
        await this.page.waitForLoadState('networkidle');
    }

    // ========== CONTROLES DE NAVEGACIÓN BANTOTAL ==========

    async recargar() {
        await this.homePage.btnRecargar.click();
        await this.waitForHomeReady();
    }

    async irAtras() {
        await this.homePage.btnAtras.click();
        await this.waitForHomeReady();
    }

    async validateAndNavigateToBandeja() {
        await this.validateFullUI();
        await this.navigateToBandejaEntrada();
    }
}

module.exports = { MenuActions };