const { BasePage } = require('./BasePage');

class DatosGeneralesPage extends BasePage {
    constructor(page) {
        super(page);
        this.baseFrame = page.frameLocator('iframe[id="1"]').frameLocator('iframe[name="process1_step2"]');

        this.MENSAJES_ERROR = {
            tipoPersona: 'Debe seleccionar Tipo de Persona',
            tipoDoc: 'Debe seleccionar Tipo de Documento',
            numDoc: 'Debe agregar Número de Documento',
            tipoSolicitud: 'Debe seleccionar Tipo de Solicitud',
            sucursal: 'Debe seleccionar Sucursal',
            vendedor: 'Debe seleccionar Vendedor'
        };
    }

    // --- Selectores ---
    get tituloStep() { return this.baseFrame.locator('#HTMLTXTTITLE1'); }
    get selectTipoPersona() { return this.baseFrame.locator('#vATRDATCMB_0004'); }
    get selectPaisDocumento() { return this.baseFrame.locator('#vATRDATCMB_0005'); }
    get selectTipoDocumento() { return this.baseFrame.locator('#vATRDATCMB1_0005'); }
    get inputNumeroDocumento() { return this.baseFrame.locator('#vATRDATEDT_0006'); }
    get selectTipoSolicitud() { return this.baseFrame.locator('#vATRDATCMB_0007'); }
    get selectSucursal() { return this.baseFrame.locator('#vATRDATCMB_0008'); }
    get selectVendedor() { return this.baseFrame.locator('#vATRDATCMB1_0008'); }
    get inputResultadoValidacion() { return this.baseFrame.locator('#TXT_CAMPOSOLOLECTURA_0009'); }
    get linkValidarDatos() { return this.baseFrame.getByRole('link', { name: 'Validar Datos' }); }
    get linkSiguiente() { return this.baseFrame.getByRole('link', { name: 'Siguiente' }); }

    getLocatorError(mensaje) {
        return this.baseFrame.getByRole('cell', { name: mensaje, exact: true });
    }
}

module.exports = { DatosGeneralesPage };