const { IniciarProcesoPage } = require('../../pages/BandejaTareasPages/InstanciaProcesoPage');
const { TIMEOUTS, FRAMES } = require('../../utils/constants');

/**
 * Orquestador para iniciar un nuevo flujo/proceso en Bantotal.
 * Gestiona selección de flujo, llenado de información y transición a STEP2.
 */
class InstanciaProcesoFlow {
    constructor(page) {
        this.page = page;
        this.procesoPage = new IniciarProcesoPage(page);
    }

    /**
     * Inicia un nuevo flujo en Bantotal seleccionando tipo de proceso y completando información.
     * Precondición: Usuario debe estar en página de inicio de proceso.
     * @param {string} nombreFlujo - Identificador del flujo (ej: 'Flujo Vehicular / StartSolicitud')
     * @param {Object} [data={}] - Información adicional del flujo
     * @param {string} [data.asunto] - Asunto del proceso (opcional)
     * @param {string} [data.comentario] - Comentario inicial (opcional)
     * @throws {Error} Si flujo no existe o transición a STEP2 falla
     * @returns {Promise<void>}
     * @example
     * await flujo.iniciarNuevoProceso('Flujo Vehicular / StartSolicitud', {
     *   asunto: 'Nueva solicitud crédito',
     *   comentario: 'Cliente preferente'
     * });
     */
    async iniciarNuevoProceso(nombreFlujo, data = {}) {
        await this.procesoPage.esperarCarga();
        
        await this.procesoPage.getFlujoLocator(nombreFlujo).click();
        
        if (data.asunto) {
            await this.procesoPage.inputAsunto.fill(data.asunto);
        }
        if (data.comentario) {
            await this.procesoPage.inputComentario.fill(data.comentario);
        }
        
        await this.procesoPage.btnIniciar.click();
        await this.procesoPage.page.waitForTimeout(1000);
        
    }

    /**
     * Verifica que la interfaz de inicio de procesos esté disponible.
     * Valida carga de página y accesibilidad de flujos.
     * @throws {Error} Si interfaz no carga o flujos no están disponibles
     * @returns {Promise<void>}
     */
    async verificarInterfazDeInicio() {
        await this.procesoPage.esperarCarga();
        await this.procesoPage.validarDisponibilidadDeFlujos();
    }
}

module.exports = { InstanciaProcesoFlow };