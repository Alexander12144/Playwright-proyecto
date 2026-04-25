const { BandejaTareasActions } = require('../actions/BandejaTareasActions');
const { InstanciaProcesoFlow } = require('../flows/InstanciaProcesoFlow');
const { DatosGeneralesFlow } = require('../flows/DatosGeneralesFlow');

class BandejaTareasFlow {
    constructor(page) {
        this.page = page;
        this.actions = new BandejaTareasActions(page);
        this.instanciaProcesoFlow = new InstanciaProcesoFlow(page);
        this.datosGeneralesFlow = new DatosGeneralesFlow(page);
    }

    /**
     * @param {string|number} instancia - ID de la tarea
     * @param {Object} filtros - Criterios de búsqueda opcionales
     */
    async ejecutarInstancia(instancia, filtros = {}) {
        await this.actions.validarCargaCompleta();

        if (Object.keys(filtros).length > 0) {
            await this.actions.filtrarInstancias(filtros);
        }

        await this.actions.seleccionarFila(instancia);
        await this.actions.ejecutarAccion();
    }

    /**
     * Orquesta la creación desde cero de una solicitud vehicular.
     */
    async crearInstanciaProcesoVehicular(dataCliente = {}) {
        await this.actions.ingresarInicioProceso();
        
        await this.instanciaProcesoFlow.seleccionarFlujoEIniciar('Flujo Vehicular / StartSolicitud');
        
        // El flow de datos generales ya tiene sus propias validaciones internas
        await this.datosGeneralesFlow.completarSeccionDatosGenerales(dataCliente, { validarExito: true });
    }

    /**
     * Retoma una instancia existente en la bandeja y completa sus datos.
     */
    async continuarInstanciaExistente(datosInstancia = {}) {
        await this.actions.filtrarInstancias(datosInstancia);
        await this.actions.seleccionarFila(datosInstancia.nroInstancia);
        await this.actions.ejecutarAccion();
        
        await this.datosGeneralesFlow.completarSeccionDatosGenerales(datosInstancia, { validarExito: true });
    }
}

module.exports = { BandejaTareasFlow };