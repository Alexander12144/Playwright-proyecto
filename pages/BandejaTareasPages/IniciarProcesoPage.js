const { expect } = require('@playwright/test');
const { BasePage } = require('../BasePage');
const { TIMEOUTS, FRAMES } = require('../../utils/constants');
const { BantotalNavigator } = require('../components/BantotalNavigator');

/**
 * Page Object para la pantalla Iniciar Instancia de Proceso (Step 2).
 */
class IniciarProcesoPage extends BasePage {
    constructor(page) {
        super(page);
        this.frameSelector = FRAMES.BANDEJA_STEP2;
        this.nav = new BantotalNavigator(this.baseFrame);
    }

    get baseFrame() { return this.mainFrame.frameLocator(this.frameSelector); }
    get titulo() { return this.baseFrame.getByText('Iniciar Instancia de Proceso'); }
    get inputAsunto() { return this.baseFrame.locator('#vASUNTO'); }
    get inputComentario() { return this.baseFrame.locator('#vCOMENTARIO'); }
    get btnIniciar() { return this.nav.btnIniciar; }
    get btnCancelar() { return this.nav.btnCancelar; }

    /**
     * Localizador del flujo de proceso a iniciar.
     * @param {string} nombreFlujo - Nombre exacto del flujo en pantalla.
     * @returns {import('@playwright/test').Locator}
     */
    getFlujoLocator(nombreFlujo) {
        return this.baseFrame.getByText(nombreFlujo, { exact: true });
    }

    getPageLoadFrame() {
        return this.baseFrame;
    }

    getPageLoadLocators() {
        return [this.titulo];
    }

    /**
     * Valida que los flujos vehiculares esperados estén disponibles en pantalla.
     * @returns {Promise<void>}
     */
    async validarDisponibilidadDeFlujos() {
        await this.esperarCarga();
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
        await expect(this.inputAsunto).toBeVisible();
        await expect(this.btnIniciar).toBeVisible();
    }
}

module.exports = { IniciarProcesoPage };
