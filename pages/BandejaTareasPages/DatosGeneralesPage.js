const { expect } = require('@playwright/test');
const { BasePage } = require('../BasePage');
const { TIMEOUTS, MESSAGES, FRAMES, TEXTS } = require('../../utils/constants');
const { BantotalNavigator } = require('../components/BantotalNavigator');

class DatosGeneralesPage extends BasePage {
    constructor(page, frameSelector = FRAMES.BANDEJA_STEP4) {
        super(page);
        this.frameSelector = frameSelector;
        this._activeBaseFrame = null;
        this.MENSAJES_ERROR = MESSAGES.ERRORS_DATOS_GENERALES;
        this._nav = null;
    }

    get baseFrame() {
        return this._activeBaseFrame || this.mainFrame.frameLocator(this.frameSelector).last();
    }

    get tituloStep() { return this.baseFrame.locator('#HTMLTXTTITLE1'); }
    get selectTipoPersona() { return this.baseFrame.locator('#vATRDATCMB_0004'); }
    get selectPaisDocumento() { return this.baseFrame.locator('#vATRDATCMB_0005'); }
    get selectTipoDocumento() { return this.baseFrame.locator('#vATRDATCMB1_0005'); }
    get inputNumeroDocumento() { return this.baseFrame.locator('#vATRDATEDT_0006'); }
    get selectTipoSolicitud() { return this.baseFrame.locator('#vATRDATCMB_0007'); }
    get selectConcesionaria() { return this.baseFrame.locator('#vATRDATCMB1_0007'); }
    get selectSucursal() { return this.baseFrame.locator('#vATRDATCMB_0008'); }
    get selectVendedor() { return this.baseFrame.locator('#vATRDATCMB1_0008'); }
    get inputResultadoValidacion() { return this.baseFrame.locator('#TXT_CAMPOSOLOLECTURA_0009'); }
    get linkValidarDatos() { return this.baseFrame.getByRole('link', { name: TEXTS.VALIDAR_DATOS }); }
    
    get nav() {
        if (!this._nav) {
            this._nav = new BantotalNavigator(this.baseFrame);
        }
        return this._nav;
    }

    get linkSiguiente() { return this.nav.btnSiguiente; }

    async _ensurePageLoad() {
        const activeFrame = await this._findActiveProcessFrame();

        if (activeFrame) {
            this._activeBaseFrame = activeFrame;
            return;
        }

        await this._ensurePageLoadForFrames(
            [FRAMES.BANDEJA_STEP1, FRAMES.BANDEJA_STEP2, FRAMES.BANDEJA_STEP3, FRAMES.BANDEJA_STEP4],
            [this.tituloStep, this.selectTipoPersona],
            'No se pudo detectar un frame válido para DatosGeneralesPage'
        );
    }

    /**
     * Completa los campos de la página mediante un mapeo de datos.
     * @param {Object} data - Datos de la solicitud.
     */
    async completarDatosGenerales(data) {
        const mapping = [
            { key: 'tipoPersona',   locator: () => this.selectTipoPersona,   type: 'select' },
            { key: 'pais',          locator: () => this.selectPaisDocumento, type: 'select' },
            { key: 'tipoDoc',       locator: () => this.selectTipoDocumento, type: 'select' },
            { key: 'numDoc',        locator: () => this.inputNumeroDocumento,type: 'fill'   },
            { key: 'tipoSolicitud', locator: () => this.selectTipoSolicitud, type: 'select' },
            { key: 'concesionaria', locator: () => this.selectConcesionaria, type: 'select' },
            { key: 'sucursal',      locator: () => this.selectSucursal,      type: 'select' },
            { key: 'vendedor',      locator: () => this.selectVendedor,      type: 'select' }
        ];

        await this.fillForm(mapping, data, this.baseFrame);
    }

    async ejecutarValidacion() {
        await this.click(() => this.linkValidarDatos, () => this.baseFrame);
        
        /**
         * Esperamos estabilidad tras validar. El sistema responderá de dos formas:
         * 1. Aparecen mensajes de error ('Debe...').
         * 2. Se llena el campo de resultado de validación (éxito).
         */
        await Promise.race([
            this.inputResultadoValidacion.filter({ hasText: /.+/ }).waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM }),
        ]).catch(() => {});
    }

    async fillNumeroDocumento(value) {
        await this.fill(() => this.inputNumeroDocumento, value, this.baseFrame);
    }

    async validarErrores(listaErrores) {
        if (!listaErrores || listaErrores.length === 0) {
            return;
        }

        for (const texto of listaErrores.filter(e => !!e)) {
            const mensajeEsperado = this.baseFrame.getByText(texto, { exact: false }).first();
            try {
                await expect(mensajeEsperado).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
            } catch {
                await expect(this.baseFrame.getByText(/Debe\s+/).first()).toBeVisible({ timeout: TIMEOUTS.LONG });
            }
        }
    }
}

module.exports = { DatosGeneralesPage };