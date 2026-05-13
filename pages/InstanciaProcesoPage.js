const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');
const { TIMEOUTS, FRAMES} = require('../utils/constants');
const { BantotalNavigator } = require('./components/BantotalNavigator');

class IniciarProcesoPage extends BasePage {
    constructor(page) {
        super(page);
        this.baseFrame = this.mainFrame.frameLocator(FRAMES.BANDEJA_STEP2);
        this.nav = new BantotalNavigator(this.baseFrame);
    }

    // --- Selectores ---
    get titulo() { return this.baseFrame.getByText('Iniciar Instancia de Proceso'); }
    get inputAsunto() { return this.baseFrame.locator('#vASUNTO'); }
    get inputComentario() { return this.baseFrame.locator('#vCOMENTARIO'); }
    get btnIniciar() { return this.nav.btnIniciar; }
    get btnCancelar() { return this.nav.btnCancelar; }

    getFlujoLocator(nombreFlujo) {
        return this.baseFrame.getByText(nombreFlujo, { exact: true });
    }

    // --- Métodos Técnicos (Ex-Actions) ---
    getPageLoadFrame() {
        return this.baseFrame;
    }

    async validarDisponibilidadDeFlujos() {
        const flujosEsperados = [
            'Flujo Vehicular / StartCotizacion',
            'Flujo Vehicular / StartSolicitud',
            'Flujo Vehicular / StartBatch',
            'Flujo de Refinanciación',
            'Flujo de Reprogramación Regular',
        ];

        for (const nombre of flujosEsperados) {
            await expect(this.getFlujoLocator(nombre)).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
        }
        // Validamos también los inputs principales
        await expect(this.inputAsunto).toBeVisible();
        await expect(this.btnIniciar).toBeVisible();
    }
}

module.exports = { IniciarProcesoPage };