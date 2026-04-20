const { expect } = require('@playwright/test');
const { IniciarProcesoPage } = require('../pages/InstanciaProcesoPage');
const { TIMEOUTS } = require('../utils/constants');

/**
 * InstanciaProcesoActions - Orquestación de acciones de instancias de proceso
 * ⚠️ RESPONSABILIDAD: Lógica de negocio de selección e inicio de procesos
 * Compone acciones de IniciarProcesoPage (Page Object)
 */
class InstanciaProcesoActions {
    constructor(page) {
        this.page = page;
        this.procesoPage = new IniciarProcesoPage(page);
    }

    // ========== VALIDACIONES ==========
    /**
     * Validar que la página de iniciar proceso cargó correctamente
     */
    async validarCarga() {
        await this.procesoPage.expectVisible(this.procesoPage.titulo, TIMEOUTS.LONG);
    }

    /**
     * Validar que los campos principales están visibles
     */
    async validarCamposPrincipales() {
        await this.procesoPage.expectVisible(this.procesoPage.inputAsunto, TIMEOUTS.MEDIUM);
        await this.procesoPage.expectVisible(this.procesoPage.inputComentario, TIMEOUTS.MEDIUM);
        await this.procesoPage.expectVisible(this.procesoPage.btnIniciar, TIMEOUTS.MEDIUM);
    }

    /**
     * Validar que un flujo específico está visible
     */
    async validarFlujoVisible(nombreFlujo) {
        const flujoLocator = this.procesoPage.getFlujoLocator(nombreFlujo);
        await expect(flujoLocator).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    }

    /**
     * Validar presencia de múltiples flujos esperados
     */
    async validarPresenciaDeFlujos() {
        const flujosEsperados = [
            'Flujo Vehicular / StartCotizacion',
            'Flujo Vehicular / StartSolicitud',
            'Flujo Vehicular / StartBatch',
            'Flujo Refinanciación',
            'Flujo Reprogramación Regular'
        ];

        for (const nombreFlujo of flujosEsperados) {
            await this.validarFlujoVisible(nombreFlujo);
        }

        // Validar también los campos de entrada
        await this.validarCamposPrincipales();
    }

    // ========== ACCIONES ==========

    async ingresarAsunto(asunto) {
        if (!asunto) return;
        await this.procesoPage.fill(this.procesoPage.inputAsunto, asunto);
    }

    async ingresarComentario(comentario) {
        if (!comentario) return;
        await this.procesoPage.fill(this.procesoPage.inputComentario, comentario);
    }

    async seleccionarFlujo(nombreFlujo) {
        const flujoLocator = this.procesoPage.getFlujoLocator(nombreFlujo);
        await this.procesoPage.click(flujoLocator);
    }

    async clickIniciar() {
        await this.procesoPage.click(this.procesoPage.btnIniciar);
        // removed: wait for page-specific elements instead
    }

    async clickCancelar() {
        await this.procesoPage.click(this.procesoPage.btnCancelar);
        await expect(this.procesoPage.btnCancelar).toBeHidden({ timeout: TIMEOUTS.MEDIUM });
    }

}

module.exports = { InstanciaProcesoActions };