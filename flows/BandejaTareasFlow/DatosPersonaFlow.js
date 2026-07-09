const { DatosPersonaPage } = require('../../pages/BandejaTareasPages/DatosPersonaPage');
const { TIMEOUTS, FRAMES } = require('../../utils/constants');

/**
 * Orquestador para completar la sección de Datos de la Persona (STEP3).
 * Maneja información personal del solicitante y avance a STEP4.
 */
class DatosPersonaFlow {
    constructor(page) {
        this.page = page;
        this.personaPage = new DatosPersonaPage(page);
    }

    /**
     * Completa datos personales del solicitante y opcionalmente avanza a STEP4.
     * Precondición: Página STEP3 debe estar visible.
     * @param {Object} [data={}] - Datos personales del solicitante
     * @param {Object} data.datosPersona - Información personal (nombres, apellidos, etc.)
     * @param {Object} [opciones={}] - Configuración del paso
     * @param {boolean} [opciones.avanzar=false] - Hacer clic en 'Siguiente' para STEP4
     * @param {boolean} [opciones.validarExito=true] - Validar transición exitosa
     * @throws {Error} Si validación de campos falla
     * @returns {Promise<void>}
     * @example
     * await datosPersonaFlow.completarSeccion(
     *   { datosPersona: { nombres: 'Juan', apellidos: 'Pérez' } },
     *   { avanzar: true }
     * );
     */
    async completarSeccion(data = {}, opciones = { avanzar: false, validarExito: true }) {
        const datosPersona = data.datosPersona ?? data;
        
        await this.personaPage.esperarCarga();
        await this.personaPage.completarDatosPersona(datosPersona);

        if (opciones.avanzar) {
            await this.personaPage.click(() => this.personaPage.linkSiguiente, this.personaPage.baseFrame);
            const step4Frame = this.personaPage.page.frameLocator(FRAMES.BANDEJA_STEP4).last();
            await step4Frame.waitFor({ state: 'visible', timeout: TIMEOUTS.PROCESSING_MAX }).catch(() => {});
        }
    }
}

module.exports = { DatosPersonaFlow };