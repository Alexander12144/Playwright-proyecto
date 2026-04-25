const { expect } = require('@playwright/test');
const { IniciarProcesoPage } = require('../pages/InstanciaProcesoPage');
const { TIMEOUTS } = require('../utils/constants');

class InstanciaProcesoActions {
    constructor(page) {
        this.page = page;
        this.procesoPage = new IniciarProcesoPage(page);
    }

    async validarCarga() {
        await expect(this.procesoPage.titulo).toBeVisible({ timeout: TIMEOUTS.LONG });
    }

    async validarCamposPrincipales() {
        await expect(this.procesoPage.inputAsunto).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
        await expect(this.procesoPage.inputComentario).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
        await expect(this.procesoPage.btnIniciar).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    }

    /**
     * Valida que una lista predefinida de flujos de negocio esté presente en la UI.
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
            await expect(this.procesoPage.getFlujoLocator(nombreFlujo)).toBeVisible({ 
                timeout: TIMEOUTS.MEDIUM 
            });
        }
        await this.validarCamposPrincipales();
    }

    async ingresarAsunto(asunto) {
        if (asunto) await this.procesoPage.inputAsunto.fill(asunto);
    }

    async ingresarComentario(comentario) {
        if (comentario) await this.procesoPage.inputComentario.fill(comentario);
    }

    async seleccionarFlujo(nombreFlujo) {
        await this.procesoPage.getFlujoLocator(nombreFlujo).click();
    }

    async clickIniciar() {
        await this.procesoPage.btnIniciar.click();
    }

    async clickCancelar() {
        await this.procesoPage.btnCancelar.click();
        await expect(this.procesoPage.btnCancelar).toBeHidden();
    }
}

module.exports = { InstanciaProcesoActions };