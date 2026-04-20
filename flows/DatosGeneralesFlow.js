const { DatosGeneralesActions } = require('../actions/DatosGeneralesActions');

class DatosGeneralesFlow {
    constructor(page) {
        this.page = page;
        this.actions = new DatosGeneralesActions(page);
    }

    /**
     * Orquesta el proceso completo de la sección de Datos Generales
     * @param {Object} data - Datos para el formulario
     */
    async completarSeccionDatosGenerales(data = {}, opciones = { validarExito: true }) {
        await this.actions.validarDatosIniciales();
        
        // 1. Llenado Dinámico (Solo interactúa si el dato viene en el test)
        if (data.tipoPersona) await this.actions.seleccionarTipoPersona(data.tipoPersona);
        if (data.pais) await this.actions.seleccionarPais(data.pais);
        if (data.tipoDoc) await this.actions.seleccionarTipoDoc(data.tipoDoc);
        if (data.numDoc) await this.actions.ingresarNumeroDocumento(data.numDoc);
        if (data.tipoSolicitud) await this.actions.seleccionarTipoSolicitud(data.tipoSolicitud);
        if (data.concesionaria) await this.actions.seleccionarConcesionaria(data.concesionaria);
        if (data.sucursal) await this.actions.seleccionarSucursal(data.sucursal);
        if (data.vendedor) await this.actions.seleccionarVendedor(data.vendedor);

        // 2. Ejecutar validación en la UI
        await this.actions.ejecutarValidacion();

        // 3. Verificación Automática
        if (opciones.validarExito) {
            await this.actions.continuarSiguiente();
        } else {
            const erroresAValidar = [];
            const msg = this.actions.datosPage.MENSAJES_ERROR;

            // Mapeo de Reglas de Negocio: "Si falta X dato, debe salir Y error"
            const reglas = [
                { dato: data.tipoPersona, error: msg.TIPO_PERSONA },
                { dato: data.tipoDoc, error: msg.TIPO_DOC },
                { dato: data.numDoc, error: msg.NUM_DOC },
                { dato: data.tipoSolicitud, error: msg.TIPO_SOLICITUD },
                { dato: data.concesionaria, error: msg.CONCESIONARIA },
                { dato: data.sucursal, error: msg.SUCURSAL },
                { dato: data.vendedor, error: msg.VENDEDOR }
            ];

            // Filtramos solo los que están vacíos o no se enviaron
            reglas.forEach(regla => {
                if (!regla.dato || regla.dato === '') {
                    erroresAValidar.push(regla.error);
                }
            });

            // El Action valida todos los errores detectados de un solo golpe
            await this.actions.validarPresenciaDeErrores(erroresAValidar);
        }
    }

    async soloValidarEstructura() {
        await this.actions.validarDatosIniciales();
        await this.actions.validarOpcionesTipoSolicitud();
    }
}

module.exports = { DatosGeneralesFlow };