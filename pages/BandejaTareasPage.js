const { BasePage } = require('./BasePage');

/**
 * BandejaTareasPage - Page Object
 * ⚠️ RESPONSABILIDAD: SOLO selectores y localizadores
 * Toda la lógica va en BandejaActions.js
 */
class BandejaTareasPage extends BasePage {
    constructor(page) {
        super(page);

        // Jerarquía de Frames (Ruta confirmada)
        this.framePadre = page.frameLocator('iframe[id="1"]');
        this.frameBandeja = this.framePadre.frameLocator('iframe[name="process1_step1"]');
        this.frameStep2 = this.framePadre.frameLocator('iframe[name="process1_step2"]');

        // --- SELECTORES BANDEJA ---
        this.tituloBandeja = this.frameBandeja.getByText('Bandeja de Entrada de Tareas');
        
        // Combos (IDs de Bantotal)
        this.comboVista = this.frameBandeja.locator('#vVISTA');
        this.comboRoles = this.frameBandeja.locator('#vWFROLCODFLT');
        this.comboOrden = this.frameBandeja.locator('#vORDER');
        
        // Inputs de filtrado
        this.inputInstancia = this.frameBandeja.locator('#vBINST');
        this.inputComentario = this.frameBandeja.locator('#vBCOM');
        this.btnFiltrar = this.frameBandeja.getByRole('link', { name: 'Filtrar' });

        // Botones de acción
        this.btnConsultar = this.frameBandeja.getByRole('link', { name: 'Consultar' });
        this.btnDelegar = this.frameBandeja.getByRole('link', { name: 'Delegar' });
        this.btnLiberar = this.frameBandeja.getByRole('link', { name: 'Liberar' });
        this.btnEjecutar = this.frameBandeja.getByRole('link', { name: 'Ejecutar' });
        this.btnDatosIng = this.frameBandeja.getByRole('link', { name: 'Datos.Ing' });
        this.btnDocumentos = this.frameBandeja.getByRole('link', { name: 'Documentos' });
        this.btnImpresos = this.frameBandeja.getByRole('link', { name: 'Impresos' });
        this.btnAutDisponibles = this.frameBandeja.getByRole('link', { name: 'Aut. Disponibles' });
        this.btnIniciarProceso = this.frameBandeja.getByRole('link', { name: 'Iniciar Proceso' });
        
        // Botones de navegación
        this.btnAnterior = this.frameBandeja.getByText('<< Anterior');
        this.btnSiguiente = this.frameBandeja.getByText('Siguiente >>');
        
        // Para Step 2 (después de ejecutar)
        this.btnPagSig = this.frameStep2.getByText('Iniciar Instancia de Proceso');
    }

    // ========== LOCALIZADORES DINÁMICOS ==========
    getFilaPorInstancia(instancia) {
        return this.frameBandeja.getByRole('row', { 
            name: new RegExp(`^${instancia}\\s`)
        });
    }

    getOpcionCombo(valor) {
        return this.frameBandeja
            .getByRole('option', { name: valor, exact: true })
            .or(this.frameBandeja.getByText(valor, { exact: true }));
    }
}

module.exports = { BandejaTareasPage };