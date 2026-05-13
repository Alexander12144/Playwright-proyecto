const { DatosGeneralesPage } = require('../pages/DatosGeneralesPage');
const { TIMEOUTS, FRAMES } = require('../utils/constants');

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
     * @param {string} data.tipoPersona - Tipo de persona (PF/PJ)
     * @param {string} data.tipoDoc - Tipo de documento
     * @param {string} data.numDoc - Número de documento
     * @param {string} data.tipoSolicitud - Tipo de solicitud
     * @param {string} data.sucursal - Sucursal
     * @param {string} data.vendedor - Vendedor asignado
     * @param {Object} [opciones={}] - Configuración del paso
     * @param {boolean} [opciones.validarExito=true] - Avanzar a STEP3 después de completar
     * @throws {Error} Si alguna validación de campos falla
     * @throws {Error} Si transición a STEP3 no se completa en timeout
     * @returns {Promise<void>}
     */
    async completarSeccion(data = {}, opciones = { validarExito: true }) {
        const datosGenerales = data.datosGenerales ?? data;
        
        await this.datosPage.esperarCarga();
        await this.datosPage.completarDatosGenerales(datosGenerales);

        if (opciones.validarExito) {
            await this.datosPage.click(() => this.datosPage.linkSiguiente, this.datosPage.baseFrame);
            const step3Frame = this.datosPage.page.frameLocator(FRAMES.BANDEJA_STEP3);
            await step3Frame.waitFor({ state: 'visible', timeout: TIMEOUTS.PROCESSING_MAX });
        } else {
            await this.datosPage.ejecutarValidacion();
            await this._gestionarErrores(datosGenerales);
        }
    }

    /**
     * Valida la presencia de mensajes de error esperados.
     * Se ejecuta cuando validarExito=false. Verifica que faltenén campos requeridos muestren mensajes adecuados.
     * @private
     * @param {Object} data - Datos incompletos para validación
     * @returns {Promise<void>}
     * @throws {Error} Si algún error esperado no se muestra
     */
    async _gestionarErrores(data) {
        const msg = this.datosPage.MENSAJES_ERROR;
        
        // Mapeo de relación: Propiedad del objeto 'data' vs Propiedad del objeto 'MESSAGES'
        const camposObligatorios = {
            tipoPersona: msg.tipoPersona,
            tipoDoc: msg.tipoDoc,
            numDoc: msg.numDoc,
            tipoSolicitud: msg.tipoSolicitud,
            sucursal: msg.sucursal,
            vendedor: msg.vendedor
        };

        const erroresAValidar = Object.keys(camposObligatorios)
            .filter(key => !data[key])
            .map(key => camposObligatorios[key]);

        await this.datosPage.validarErrores(erroresAValidar);
    }
}

module.exports = { DatosGeneralesFlow };