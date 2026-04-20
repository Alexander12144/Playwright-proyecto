const { BasePage } = require('./BasePage');

/**
 * DatosGeneralesPage - Page Object
 * ⚠️ RESPONSABILIDAD: SOLO selectores y localizadores
 * Toda la lógica va en DatosGeneralesActions.js
 */
class DatosGeneralesPage extends BasePage {
    constructor(page) {
        super(page);

        this.framePadre = page.frameLocator('iframe[id="1"]');
        this.frameStep4 = this.framePadre.frameLocator('iframe[name="process1_step4"]');

        // Título y secciones principales
        this.tituloStep4 = this.frameStep4.locator('#HTMLTXTTITLE1');
        this.labelDatosIniciales = this.frameStep4.getByText('Datos Iniciales');

        // Información básica
        this.labelFechaIngreso = this.frameStep4.getByText('Fecha de Ingreso');
        this.labelSolicitud = this.frameStep4.getByText('Solicitud', { exact: true });
        this.labelUsuario = this.frameStep4.getByText('Usuario');
        this.labelCanalNoCorresponde = this.frameStep4.getByText('No Corresponde', { exact: true });
        this.labelIdentificacion = this.frameStep4.getByText('Identificación');

        // Tipo de Persona
        this.cellTipoPersona = this.frameStep4.getByRole('cell', { name: 'Tipo de Persona', exact: true });
        this.selectTipoPersona = this.frameStep4.locator('#vATRDATCMB_0004');

        // Documento
        this.labelPaisDocumento = this.frameStep4.getByText('País de Documento');
        this.selectPaisDocumento = this.frameStep4.locator('#vATRDATCMB_0005');
        this.labelTipoDocumento = this.frameStep4.getByText('Tipo de Documento');
        this.selectTipoDocumento = this.frameStep4.locator('#vATRDATCMB1_0005');
        this.labelNumeroDocumento = this.frameStep4.getByText('Número de Documento');
        this.inputNumeroDocumento = this.frameStep4.locator('#vATRDATEDT_0006');

        // Tipo de Solicitud
        this.labelTipoSolicitud = this.frameStep4.getByText('Tipo de Solicitud');
        this.selectTipoSolicitud = this.frameStep4.locator('#vATRDATCMB_0007');

        // Concesionaria y Sucursal
        this.cellConcesionaria = this.frameStep4.getByRole('cell', { name: 'Concesionaria', exact: true });
        this.labelSucursal = this.frameStep4.getByText('Sucursal');
        this.selectSucursal = this.frameStep4.locator('#vATRDATCMB_0008');
        this.labelVendedor = this.frameStep4.getByText('Vendedor');
        this.selectVendedor = this.frameStep4.locator('#vATRDATCMB1_0008');

        // Validación
        this.labelResultadoValidacionPower = this.frameStep4.getByText('Resultado Validacion Power');
        this.inputResultadoValidacionPower = this.frameStep4.locator('#TXT_CAMPOSOLOLECTURA_0009');
        this.linkValidarDatos = this.frameStep4.getByRole('link', { name: 'Validar Datos' });

        // Botones de navegación
        this.btnGuardarYCerrar = this.frameStep4.locator('#BTNOPGRABARYCERRAR');
        this.btnAnterior = this.frameStep4.getByRole('cell', { name: 'Anterior' }).nth(2);
        this.linkSiguiente = this.frameStep4.getByRole('link', { name: 'Siguiente' });
        this.btnFinalizar = this.frameStep4.getByRole('cell', { name: 'Finalizar' }).nth(2);
        this.linkCancelar = this.frameStep4.getByRole('link', { name: 'Cancelar' });

        // Mensajes de error que Bantotal dispara
        this.MENSAJES_ERROR = {
            TIPO_PERSONA: 'Debe seleccionar Tipo de Persona',
            TIPO_DOC: 'Debe seleccionar Tipo de Documento',
            NUM_DOC: 'Debe agregar Número de Documento',
            TIPO_SOLICITUD: 'Debe seleccionar Tipo de Solicitud',
            CONCESIONARIA: 'Debe seleccionar Concesionaria',
            SUCURSAL: 'Debe seleccionar Sucursal',
            VENDEDOR: 'Debe seleccionar Vendedor',
            TIPO_DOC_VALIDO: 'Tipo de documento no valido para país seleccionado'
        };
    }

    // ========== LOCALIZADORES DINÁMICOS ==========
    /**
     * Obtener opción específica de un select
     */
    getOptionFromSelect(selectLocator, optionText) {
        return selectLocator.locator('option', { hasText: optionText });
    }

    getLocatorError(texto) {
        return this.page
            .frameLocator('[id="1"]')
            .frameLocator('iframe[name="process1_step4"]')
            .getByRole('cell', { name: texto, exact: true });
    }

    async waitForValidacionProcesada() {
    const errores = Object.values(this.MENSAJES_ERROR)
        .map(msg => this.getLocatorError(msg));

    await Promise.race([
        ...errores.map(locator =>
            locator.waitFor({ state: 'visible', timeout: 10000 }).catch(() => null)
        ),
        this.inputResultadoValidacionPower.waitFor({
            state: 'visible',
            timeout: 10000
        }).catch(() => null)
    ]);
}
}

module.exports = { DatosGeneralesPage };