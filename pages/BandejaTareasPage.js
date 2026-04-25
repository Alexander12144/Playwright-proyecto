const { BasePage } = require('./BasePage');

class BandejaTareasPage extends BasePage {
    constructor(page) {
        super(page);

        // Definición de Frames base
        this.framePadre = page.frameLocator('iframe[id="1"]');
        this.baseBandeja = this.framePadre.frameLocator('iframe[name="process1_step1"]');
        this.baseStep2 = this.framePadre.frameLocator('iframe[name="process1_step2"]');
    }

    // --- Títulos y Filtros ---
    get tituloBandeja() { return this.baseBandeja.getByText('Bandeja de Entrada de Tareas'); }
    get comboVista() { return this.baseBandeja.locator('#vVISTA'); }
    get comboRoles() { return this.baseBandeja.locator('#vWFROLCODFLT'); }
    get comboOrden() { return this.baseBandeja.locator('#vORDER'); }
    get inputInstancia() { return this.baseBandeja.locator('#vBINST'); }
    get inputComentario() { return this.baseBandeja.locator('#vBCOM'); }
    get btnFiltrar() { return this.baseBandeja.getByRole('link', { name: 'Filtrar' }); }

    // --- Botones de Acción (Bandeja) ---
    get btnConsultar() { return this.baseBandeja.getByRole('link', { name: 'Consultar' }); }
    get btnDelegar() { return this.baseBandeja.getByRole('link', { name: 'Delegar' }); }
    get btnLiberar() { return this.baseBandeja.getByRole('link', { name: 'Liberar' }); }
    get btnEjecutar() { return this.baseBandeja.getByRole('link', { name: 'Ejecutar' }); }
    get btnDatosIng() { return this.baseBandeja.getByRole('link', { name: 'Datos.Ing' }); }
    get btnDocumentos() { return this.baseBandeja.getByRole('link', { name: 'Documentos' }); }
    get btnImpresos() { return this.baseBandeja.getByRole('link', { name: 'Impresos' }); }
    get btnAutDisponibles() { return this.baseBandeja.getByRole('link', { name: 'Aut. Disponibles' }); }
    get btnIniciarProceso() { return this.baseBandeja.getByRole('link', { name: 'Iniciar Proceso' }); }

    // --- Navegación ---
    get btnAnterior() { return this.baseBandeja.getByText('<< Anterior'); }
    get btnSiguiente() { return this.baseBandeja.getByText('Siguiente >>'); }
    get btnPagSig() { return this.baseStep2.getByText('Iniciar Instancia de Proceso'); }

    // --- Localizadores Dinámicos ---
    /**
     * @param {string|number} instancia - ID de la instancia a buscar
     */
    getFilaPorInstancia(instancia) {
        return this.baseBandeja.getByRole('row', { 
            name: new RegExp(`^${instancia}\\s`)
        });
    }

    /**
     * @param {string} valor - Texto de la opción en el combo
     */
    getOpcionCombo(valor) {
        return this.baseBandeja
            .getByRole('option', { name: valor, exact: true })
            .or(this.baseBandeja.getByText(valor, { exact: true }));
    }
}

module.exports = { BandejaTareasPage };