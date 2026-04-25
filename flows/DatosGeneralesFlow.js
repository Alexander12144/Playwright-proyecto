const { DatosGeneralesActions } = require('../actions/DatosGeneralesActions');

class DatosGeneralesFlow {
    constructor(page) {
        this.page = page;
        this.actions = new DatosGeneralesActions(page);
    }

    /**
     * @param {Object} data - Datos para el formulario
     * @param {Object} opciones - { validarExito: boolean }
     */
    async completarSeccionDatosGenerales(data = {}, opciones = { validarExito: true }) {
        await this.actions.validarCargaSeccion();
        
        await this._llenarCamposEnviados(data);
        await this.actions.ejecutarValidacion();

        if (opciones.validarExito) {
            await this.actions.continuarSiguiente();
        } else {
            await this._gestionarValidacionDeErrores(data);
        }
    }

    async _llenarCamposEnviados(data) {
        if (data.tipoPersona) await this.actions.seleccionarTipoPersona(data.tipoPersona);
        if (data.pais) await this.actions.seleccionarPais(data.pais);
        if (data.tipoDoc) await this.actions.seleccionarTipoDoc(data.tipoDoc);
        if (data.numDoc) await this.actions.ingresarNumeroDocumento(data.numDoc);
        if (data.tipoSolicitud) await this.actions.seleccionarTipoSolicitud(data.tipoSolicitud);
        if (data.sucursal) await this.actions.seleccionarSucursal(data.sucursal);
        if (data.vendedor) await this.actions.seleccionarVendedor(data.vendedor);
    }

    /**
     * Mapea reglas de negocio: si el dato no se envió, se valida el error correspondiente.
     */
    async _gestionarValidacionDeErrores(data) {
        const msg = this.actions.datosPage.MENSAJES_ERROR;
        const erroresAValidar = [];

        const reglas = [
            { dato: data.tipoPersona, error: msg.tipoPersona },
            { dato: data.tipoDoc, error: msg.tipoDoc },
            { dato: data.numDoc, error: msg.numDoc },
            { dato: data.tipoSolicitud, error: msg.tipoSolicitud },
            { dato: data.sucursal, error: msg.sucursal },
            { dato: data.vendedor, error: msg.vendedor }
        ];

        reglas.forEach(regla => {
            if (!regla.dato || regla.dato === '') {
                erroresAValidar.push(regla.error);
            }
        });

        if (erroresAValidar.length > 0) {
            await this.actions.validarPresenciaDeErrores(erroresAValidar);
        }
    }

    async soloValidarEstructura() {
        await this.actions.validarCargaSeccion();
    }
}

module.exports = { DatosGeneralesFlow };