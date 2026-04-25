const { InstanciaProcesoActions } = require('../actions/InstanciaProcesoActions');

class InstanciaProcesoFlow {
    constructor(page) {
        this.page = page;
        this.actions = new InstanciaProcesoActions(page);
    }

    /**
     * @param {string} nombreFlujo - Nombre del proceso en la lista
     * @param {Object} datos - { asunto: string, comentario: string }
     */
    async seleccionarFlujoEIniciar(nombreFlujo, datos = {}) {
        await this.actions.seleccionarFlujo(nombreFlujo);
        await this.actions.ingresarAsunto(datos.asunto);
        await this.actions.ingresarComentario(datos.comentario);
        await this.actions.clickIniciar();
    }

    /**
     * Realiza validaciones de estructura antes de iniciar el flujo solicitado.
     */
    async validarYSeleccionarFlujo(nombreFlujo, datos = {}) {
        await this.actions.validarCarga();
        await this.actions.validarPresenciaDeFlujos();
        await this.seleccionarFlujoEIniciar(nombreFlujo, datos);
    }
}

module.exports = { InstanciaProcesoFlow };