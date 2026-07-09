const { BandejaTareasPage } = require('../../pages/BandejaTareasPages/BandejaTareasPage');
const { InstanciaProcesoFlow } = require('./InstanciaProcesoFlow');
const { DatosGeneralesFlow } = require('./DatosGeneralesFlow');
const { DatosPersonaFlow } = require('./DatosPersonaFlow');
const { TIMEOUTS } = require('../../utils/constants');

/**
 * Orquestador de procesos relacionados con la Bandeja de Tareas.
 * Gestiona flujos completos: continuación de instancias existentes o creación de nuevas solicitudes.
 */
class BandejaTareasFlow {
    constructor(page) {
        this.page = page;
        this.bandejaPage = new BandejaTareasPage(page);
        this.instanciaProcesoFlow = new InstanciaProcesoFlow(page);
        this.datosGeneralesFlow = new DatosGeneralesFlow(page);
        this.datosPersonaFlow = new DatosPersonaFlow(page);
    }

    /**
     * Gestiona la continuación de una instancia existente completando campos en secuencia.
     * @param {Object} datos - Datos de la instancia y negocio
     * @param {Object} [opciones={}] - Configuración del flujo
     * @returns {Promise<void>}
     */
    async continuarInstanciaExistente(datos, opciones = {}) {
        const config = { validarExito: true, validarPasoPersona: false, ...opciones };
        const nroInstancia = datos.nroInstancia ?? datos.instancia?.nroInstancia;

        if (!nroInstancia) {
            throw new Error('continuarInstanciaExistente: nroInstancia es requerido');
        }

        await this.bandejaPage.esperarCarga();
        await this.bandejaPage.filtrarPorInstancia(nroInstancia);
        await this.bandejaPage.seleccionarFila(nroInstancia);
        await this.bandejaPage.ejecutarTareaSeleccionada();
        await this.datosGeneralesFlow.completarSeccion(datos, config);

        if (config.validarExito && config.validarPasoPersona) {
            await this.datosPersonaFlow.completarSeccion(datos, { avanzar: true });
        }
    }

    /**
     * Inicia una nueva solicitud vehicular desde inicio de proceso.
     * @param {string} nombreProceso - Identificador del flujo
     * @param {Object} dataCliente - Datos del cliente para completar flujo
     * @param {Object} [opciones={}] - Configuración de validaciones
     * @returns {Promise<void>}
     */
    async crearNuevaSolicitudVehicular(nombreProceso, dataCliente, opciones = {}) {
        await this.bandejaPage.esperarCarga();
        await this.bandejaPage.irAInicioProceso();
        await this.instanciaProcesoFlow.iniciarNuevoProceso(nombreProceso);
        await this.datosGeneralesFlow.completarSeccion(dataCliente, opciones);

        if (opciones.validarExito !== false) {
            await this.datosPersonaFlow.completarSeccion(dataCliente, { avanzar: true });
        }
    }

    /**
     * Valida que el resultado de validación de Datos Generales esté vacío.
     * @param {number} [timeout=TIMEOUTS.LONG]
     * @returns {Promise<void>}
     */
    async validarResultadoValidacionVacio(timeout = TIMEOUTS.LONG) {
        await this.datosGeneralesFlow.validarResultadoValidacionVacio(timeout);
    }

    /**
     * Valida mensajes de campos obligatorios visibles en Datos Generales.
     * @param {number} [timeout=TIMEOUTS.LONG]
     * @returns {Promise<void>}
     */
    async validarMensajesObligatoriosDatosGenerales(timeout = TIMEOUTS.LONG) {
        await this.datosGeneralesFlow.validarMensajesObligatoriosVisibles(timeout);
    }

    /**
     * Valida que el resultado de validación de Datos Generales contenga datos.
     * @param {number} [timeout=TIMEOUTS.LONG]
     * @returns {Promise<void>}
     */
    async validarResultadoValidacionCompleto(timeout = TIMEOUTS.LONG) {
        await this.datosGeneralesFlow.validarResultadoValidacionCompleto(timeout);
    }
}

module.exports = { BandejaTareasFlow };
