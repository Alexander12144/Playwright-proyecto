const { expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { TIMEOUTS } = require('../utils/constants');

class MenuActions {
    constructor(page) {
        this.page = page;
        this.homePage = new HomePage(page);
    }

    // ========== VALIDACIONES DEL DASHBOARD ==========
    /**
     * Validar que el logo está visible
     */
    async validateLogoVisible() {
        await this.homePage.expectVisible(this.homePage.logo, TIMEOUTS.MEDIUM);
    }

    /**
     * Validar botones principales del header
     */
    async validateHeaderButtons() {
        await this.homePage.expectVisible(this.homePage.btnInicio, TIMEOUTS.MEDIUM);
        await this.homePage.expectVisible(this.homePage.btnAccesos, TIMEOUTS.MEDIUM);
    }

    /**
     * Validar controles de navegación
     */
    async validateNavigationControls() {
        await this.homePage.expectVisible(this.homePage.btnAtras, TIMEOUTS.MEDIUM);
        await this.homePage.expectVisible(this.homePage.btnRecargar, TIMEOUTS.MEDIUM);
    }

    /**
     * Validar elementos del primer iframe
     */
    async validateFirstFrameElements() {
        await this.homePage.expectVisible(this.homePage.linkActividadUsuario, TIMEOUTS.LONG);
    }

    /**
     * Validar elementos del segundo iframe (información del usuario)
     */
    async validateUserInfoElements() {
        await this.homePage.expectVisible(this.homePage.txtUltimaActividad, TIMEOUTS.MEDIUM);
        await this.homePage.expectVisible(this.homePage.cellUsuario, TIMEOUTS.MEDIUM);
        await this.homePage.expectVisible(this.homePage.cellEmpresa, TIMEOUTS.MEDIUM);
        await this.homePage.expectVisible(this.homePage.cellSucursal, TIMEOUTS.MEDIUM);
        await this.homePage.expectVisible(this.homePage.cellFechaSistema, TIMEOUTS.MEDIUM);
    }

    /**
     * Validación completa de toda la UI del dashboard
     */
    async validateFullUI() {
        await this.validateLogoVisible();
        await this.validateHeaderButtons();
        await this.validateNavigationControls();
        await this.validateFirstFrameElements();
        await this.validateUserInfoElements();
    }

    // ========== NAVEGACIÓN ==========
    /**
     * Navegar al menú Inicio
     */
    async navigateToInicio() {
        await this.homePage.click(this.homePage.btnInicio);
    }

    /**
     * Valide que el home ha cargado correctamente y luego navegar a Inicio
     */
    async waitForHomeReady() {
        await this.homePage.expectVisible(this.homePage.linkActividadUsuario, TIMEOUTS.MEDIUM);
    }

    /**
     * Navegar a Bandeja de Tareas desde el menú
     */
    async navigateToBandejaTareas() {
        // Esperar que el menú esté disponible
        await this.homePage.expectVisible(this.homePage.menu.inicioMenu, TIMEOUTS.MEDIUM);
        await this.homePage.click(this.homePage.menu.inicioMenu);

        // Esperar que aparezca la opción de bandeja de tareas
        await this.homePage.expectVisible(this.homePage.menu.bandejaTareasMenu, TIMEOUTS.MEDIUM);
        await this.homePage.click(this.homePage.menu.bandejaTareasMenu);
    }

    /**
     * Navegar a Bandeja de Entrada de Tareas
     */
    async navigateToBandejaEntrada() {
        await this.navigateToBandejaTareas();

        // Esperar que aparezca la opción de entrada de tareas
        await this.homePage.expectVisible(this.homePage.menu.bandejaEntradaMenu, TIMEOUTS.MEDIUM);
        await this.homePage.click(this.homePage.menu.bandejaEntradaMenu);

        // Esperar a que se cargue el contenido de la bandeja
        await this.page.waitForTimeout(2000);
    }

    // ========== ACCIONES DE DASHBOARD ==========
    /**
     * Recargar la página
     */
    async recargar() {
        await this.homePage.click(this.homePage.btnRecargar);
        await this.homePage.linkActividadUsuario.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    }

    /**
     * Ir atrás en el historial
     */
    async irAtras() {
        await this.homePage.click(this.homePage.btnAtras);
        await this.homePage.linkActividadUsuario.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    }

    /**
     * Ir adelante en el historial
     */
    async irAdelante() {
        await this.homePage.click(this.homePage.btnAdelante);
        await this.homePage.linkActividadUsuario.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    }

    // ========== FLUJOS ORQUESTADOS ==========
    /**
     * Flujo completo: Validar dashboard + navegar a bandeja
     */
    async validateAndNavigateToBandeja() {
        await this.validateFullUI();
        await this.navigateToBandejaInstancias();
    }
}

module.exports = { MenuActions };