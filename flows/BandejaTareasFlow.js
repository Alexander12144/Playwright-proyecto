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
     * Flujo completo:
     * 1. Validar carga
     * 2. Filtrar (opcional)
     * 3. Seleccionar
     * 4. Ejecutar
     * 5. Iniciar proceso
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
     * Crear instancia de proceso desde la bandeja de tareas:
     * 1. Ingresar inicio de proceso
     * 2. Seleccionar proceso
     * 3. Ingresar datos
     */
    async crearInstanciaProceso() {
        await this.actions.ingresarInicioProceso();
        await this.instanciaProcesoFlow.seleccionarFlujoEIniciar('Flujo Vehicular / StartSolicitud');
        await this.datosGeneralesFlow.completarSeccionDatosGenerales(
            {
                tipoPersona: 'Natural',
                pais: 'Perú',
                tipoDoc: 'DNI',
                numDoc: '12345678',
                tipoSolicitud: 'Vehicular',
                concesionaria: 'AUTOESPAR',
                sucursal: 'AU-SAN MIGUEL',
                vendedor: 'Juan Pérez'
            }, { validarExito: true });
    }

    async continuarInstanciaEjecutar(datosManuales = {}) {
        await this.actions.filtrarInstancias(datosManuales);
        await this.actions.validarFilaVisible(datosManuales.nroInstancia);  
        await this.actions.seleccionarFila(datosManuales.nroInstancia);
        await this.actions.ejecutarAccion();
        /*await this.datosGeneralesFlow.validarCargaYCompletarDatosGenerales(
            {
                tipoPersona: 'Natural',
                pais: 'Perú',
                tipoDoc: 'DNI',
                numDoc: '12345678',
                tipoSolicitud: 'Vehicular',
                concesionaria: 'AUTOESPAR',
                sucursal: 'AU-SAN MIGUEL',
                vendedor: 'Juan Pérez'
            }, { validarExito: true });*/
    }
}
module.exports = { BandejaTareasFlow };