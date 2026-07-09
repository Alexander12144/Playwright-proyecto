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
     * Abre el menú Inicio desde la pantalla principal.
     * @returns {Promise<void>}
     */
    async _abrirMenuInicio() {
        await this.homePage.esperarCarga();
        await this.homePage.click(() => this.homePage.menu.inicioMenu, this.page);
    }

    /**
     * Navega hasta el submenú Bandeja de Tareas.
     * @returns {Promise<void>}
     */
    async _abrirSubmenuBandejaTareas() {
        await this._abrirMenuInicio();
        await expect(this.homePage.menu.bandejaTareasMenu).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
        await this.homePage.click(() => this.homePage.menu.bandejaTareasMenu, this.page);
    }

    /**
     * Navega desde Home a Bandeja de Entrada a través de menús secuenciales.
     * @returns {Promise<void>}
     */
    async irABandejaDeEntrada() {
        await this._abrirSubmenuBandejaTareas();
        await expect(this.homePage.menu.bandejaEntradaMenu).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
        await this.homePage.click(() => this.homePage.menu.bandejaEntradaMenu, this.page);
    }

    /**
     * Navega hasta Consulta de Instancias WF - Administrador.
     * @returns {Promise<void>}
     */
    async irAConsultaInstanciaAdministrador() {
        await this._abrirSubmenuBandejaTareas();
        await expect(this.homePage.menu.consultaInstanciaAdministrador).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
        await this.homePage.click(() => this.homePage.menu.consultaInstanciaAdministrador, this.page);
    }

    /**
     * Navega hasta Consulta de Operaciones Vehiculares.
     * @returns {Promise<void>}
     */
    async irAConsultaOperacionesVehiculares() {
        await this._abrirMenuInicio();
        await expect(this.homePage.menu.consultasBasicasMenu).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
        await this.homePage.click(() => this.homePage.menu.consultasBasicasMenu, this.page);
        await expect(this.homePage.menu.consultaOperacionesVehiculares).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
        await this.homePage.click(() => this.homePage.menu.consultaOperacionesVehiculares, this.page);
        await this.page.waitForLoadState('networkidle');
    }
}

module.exports = { MenuFlow };
