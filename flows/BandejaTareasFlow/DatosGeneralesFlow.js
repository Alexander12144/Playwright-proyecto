const { expect } = require('@playwright/test');
const { DatosGeneralesPage } = require('../../pages/BandejaTareasPages/DatosGeneralesPage');
const { TIMEOUTS, FRAMES } = require('../../utils/constants');

/**
 * Orquestador para completar la sección de Datos Generales (STEP2).
 * Maneja el llenado de campos obligatorios y validación de transición a STEP3.
 */
class DatosGeneralesFlow {
    constructor(page) {
        this.page = page;
        this.datosPage = new DatosGeneralesPage(page);
    }

    /**
     * Completa la sección de Datos Generales y valida transición a STEP3.
     * Precondición: Página STEP2 debe estar visible.
     * @param {Object} [data={}] - Datos generales del cliente
     * @param {Object} [opciones={}] - Configuración del paso
     * @param {boolean} [opciones.validarExito=true] - Avanzar a STEP3 después de completar
     * @returns {Promise<void>}
     */
    async completarSeccion(data = {}, opciones = { validarExito: true }) {
        const datosGenerales = data.datosGenerales ?? data;

        await this.datosPage.esperarCarga();
        await this.datosPage.completarDatosGenerales(datosGenerales);

        if (opciones.validarExito) {
            await this.datosPage.click(() => this.datosPage.linkSiguiente, this.datosPage.baseFrame);
            const step3Frame = this.datosPage.mainFrame.locator(FRAMES.BANDEJA_STEP3);
            await step3Frame.waitFor({ state: 'visible', timeout: TIMEOUTS.PROCESSING_MAX });
            return;
        }

        await this.datosPage.ejecutarValidacion();
        await this._gestionarErrores(datosGenerales);
    }

    /**
     * Valida que el campo de resultado de validación permanezca vacío tras un fallo.
     * @param {number} [timeout=TIMEOUTS.LONG]
     * @returns {Promise<void>}
     */
    async validarResultadoValidacionVacio(timeout = TIMEOUTS.LONG) {
        await expect(this.datosPage.inputResultadoValidacion).toHaveValue('', { timeout });
    }

    /**
     * Valida que exista al menos un mensaje de campo obligatorio en pantalla.
     * @param {number} [timeout=TIMEOUTS.LONG]
     * @returns {Promise<void>}
     */
    async validarMensajesObligatoriosVisibles(timeout = TIMEOUTS.LONG) {
        await expect(this.datosPage.baseFrame.getByText(/Debe\s+/).first()).toBeVisible({ timeout });
    }

    /**
     * Valida que el resultado de validación contenga información tras datos válidos.
     * @param {number} [timeout=TIMEOUTS.LONG]
     * @returns {Promise<void>}
     */
    async validarResultadoValidacionCompleto(timeout = TIMEOUTS.LONG) {
        await expect(this.datosPage.inputResultadoValidacion).not.toHaveValue('', { timeout });
    }

    /**
     * Valida la presencia de mensajes de error esperados según campos faltantes.
     * @private
     * @param {Object} data - Datos incompletos para validación
     * @returns {Promise<void>}
     */
    async _gestionarErrores(data) {
        const msg = this.datosPage.MENSAJES_ERROR;

        const camposObligatorios = {
            tipoPersona: msg.tipoPersona,
            tipoDoc: msg.tipoDoc,
            numDoc: msg.numDoc,
            tipoSolicitud: msg.tipoSolicitud,
            sucursal: msg.sucursal,
            vendedor: msg.vendedor
        };

        const erroresAValidar = Object.keys(camposObligatorios)
            .filter((key) => !data[key])
            .map((key) => camposObligatorios[key]);

        await this.datosPage.validarErrores(erroresAValidar);
    }
}

module.exports = { DatosGeneralesFlow };
