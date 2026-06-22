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
     * Precondición: Instancia debe estar accesible en Bandeja de Tareas.
     * @param {Object} datos - Datos de la instancia y negocio
     * @param {string} datos.nroInstancia - Número de instancia (requerido)
     * @param {Object} datos.datosGenerales - Datos para STEP2 (opcional)
     * @param {Object} datos.datosPersona - Datos para STEP3 (opcional)
     * @param {Object} [opciones] - Configuración del flujo
     * @param {boolean} [opciones.validarExito=true] - Validar transiciones exitosas
     * @param {boolean} [opciones.validarPasoPersona=false] - Completar STEP3 (DatosPersona)
     * @throws {Error} Si nroInstancia no está definido
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

        //await this.bandejaPage.esperarPaso2Visible();

        await this.datosGeneralesFlow.completarSeccion(datos, config);
        
        if (config.validarExito && config.validarPasoPersona) {
            await this.datosPersonaFlow.completarSeccion(datos, { avanzar: true });
        }
    }

    /**
     * Continúa desde STEP3 avanzando directamente al siguiente paso.
     * Precondición: Debe estar en página de DatosPersona (STEP3).
     * @param {Object} [datos={}] - Datos de la persona para completar (opcional)
     * @param {Object} datos.datosPersona - Información personal del solicitante
     * @returns {Promise<void>}
     */
    async continuarDesdeDatosPersona(datos = {}) {
        await this.datosPersonaFlow.completarSeccion(datos, { avanzar: true });
    }

    /**
     * Inicia una nueva solicitud vehicular desde inicio de proceso.
     * Precondición: Usuario autenticado en home de Bantotal.
     * @param {string} nombreProceso - Identificador del flujo (ej: 'Flujo Vehicular / StartSolicitud')
     * @param {Object} dataCliente - Datos del cliente para completar flujo
     * @param {Object} dataCliente.datosGenerales - Información general (STEP2)
     * @param {Object} dataCliente.datosPersona - Información personal (STEP3)
     * @param {Object} [opciones] - Configuración de validaciones
     * @param {boolean} [opciones.validarExito=true] - Validar éxito en transiciones
     * @throws {Error} Si nombreProceso no existe o es inaccesible
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

}

module.exports = { BandejaTareasFlow };