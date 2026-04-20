const { BasePage } = require('./BasePage');

/**
 * InstanciaProcesoPage - Page Object
 * ⚠️ RESPONSABILIDAD: SOLO selectores y localizadores
 * Toda la lógica va en InstanciaProcesoActions.js
 */
class IniciarProcesoPage extends BasePage {
    constructor(page) {
        super(page);

        // Frames
        this.framePadre = page.frameLocator('iframe[id="1"]');
        this.frameContenido = this.framePadre.frameLocator('iframe[name="process1_step2"]');

        // --- SELECTORES ---
        this.titulo = this.frameContenido.getByText('Iniciar Instancia de Proceso');

        // Campos de Texto
        this.inputAsunto = this.frameContenido.locator('#vASUNTO');
        this.inputComentario = this.frameContenido.locator('#vCOMENTARIO');

        // Botones de Acción
        this.btnIniciar = this.frameContenido.getByRole('link', { name: 'Iniciar' });
        this.btnCancelar = this.frameContenido.getByRole('link', { name: 'Cancelar' });
    }

    // ========== LOCALIZADORES DINÁMICOS ==========
    /**
     * Obtener locator para un flujo específico
     */
    getFlujoLocator(nombreFlujo) {
        return this.frameContenido.getByText(nombreFlujo, { exact: true });
    }
}

module.exports = { IniciarProcesoPage };