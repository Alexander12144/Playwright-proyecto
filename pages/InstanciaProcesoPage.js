const { BasePage } = require('./BasePage');

class IniciarProcesoPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Centralización del frame de contenido
        this.baseFrame = page.frameLocator('iframe[id="1"]').frameLocator('iframe[name="process1_step2"]');
    }

    // --- Títulos y Etiquetas ---
    get titulo() { return this.baseFrame.getByText('Iniciar Instancia de Proceso'); }

    // --- Campos de Entrada ---
    get inputAsunto() { return this.baseFrame.locator('#vASUNTO'); }
    get inputComentario() { return this.baseFrame.locator('#vCOMENTARIO'); }

    // --- Botones de Acción ---
    get btnIniciar() { return this.baseFrame.getByRole('link', { name: 'Iniciar' }); }
    get btnCancelar() { return this.baseFrame.getByRole('link', { name: 'Cancelar' }); }

    // --- Localizadores Dinámicos ---
    /**
     * @param {string} nombreFlujo - Nombre exacto del flujo a seleccionar
     */
    getFlujoLocator(nombreFlujo) {
        return this.baseFrame.getByText(nombreFlujo, { exact: true });
    }
}

module.exports = { IniciarProcesoPage };