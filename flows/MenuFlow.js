const { expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { TIMEOUTS } = require('../utils/constants');

/**
 * Flujo encargado de la navegación por los menús principales del sistema.
 */
class MenuFlow {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.homePage = new HomePage(page);
    }

    /**
     * Navega desde Home a Bandeja de Entrada a través de menús secuenciales.
     * Precondición: Usuario autenticado en página de Home.
     * @throws {Error} Si alguno de los menús no aparece o click falla
     * @returns {Promise<void>}
     */
    async irABandejaDeEntrada() {
        await this.homePage.esperarCarga();
        
        await this.homePage.menu.inicioMenu.click();
        
        await expect(this.homePage.menu.bandejaTareasMenu).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
        await this.homePage.menu.bandejaTareasMenu.click();

        await expect(this.homePage.menu.bandejaEntradaMenu).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
        await this.homePage.menu.bandejaEntradaMenu.click();

        //await this.page.waitForLoadState('networkidle');
    }

    /**
     * Recarga la página principal sincronizando estado.
     * Útil para limpiar caché de sesión o reinicar flujos.
     * @throws {Error} Si recarga falla o home no se estabiliza
     * @returns {Promise<void>}
     */
    async refrescarHome() {
        await this.homePage.btnRecargar.click();
        await this.homePage.esperarCarga();
    }
}

module.exports = { MenuFlow };