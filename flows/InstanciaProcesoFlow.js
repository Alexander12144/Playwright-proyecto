const { InstanciaProcesoActions } = require('../actions/InstanciaProcesoActions');

class InstanciaProcesoFlow {
    constructor(page) {
        this.page = page;
        this.instanciaProcesoActions = new InstanciaProcesoActions(page);
    }

    // ========== FLUJOS COMPLETOS ==========
    /**
     * Seleccionar flujo, llenar datos e iniciar proceso
     * @param {string} nombreFlujo - Ej: 'Flujo Vehicular / StartSolicitud'
     * @param {Object} datos - { asunto: '...', comentario: '...' }
     */
    async seleccionarFlujoEIniciar(nombreFlujo, datos = {}) {
        await this.instanciaProcesoActions.seleccionarFlujo(nombreFlujo);
        await this.instanciaProcesoActions.ingresarAsunto(datos.asunto);
        await this.instanciaProcesoActions.ingresarComentario(datos.comentario);
        await this.instanciaProcesoActions.clickIniciar();
    }

    // ========== FLUJOS ORQUESTADOS ==========
    /**
     * Flujo completo: Validar carga + validar flujos + seleccionar e iniciar
     * @param {string} nombreFlujo
     * @param {Object} datos
     */
    async validarYSeleccionarFlujo(nombreFlujo, datos = {}) {
        await this.instanciaProcesoActions.validarCarga();
        await this.instanciaProcesoActions.validarPresenciaDeFlujos();
        await this.instanciaProcesoActions.seleccionarFlujoEIniciar(nombreFlujo, datos);
    }
}

module.exports = { InstanciaProcesoFlow };