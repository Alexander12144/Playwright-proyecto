const { expect } = require('@playwright/test');
const { BasePage } = require('../BasePage');
const { TIMEOUTS, FRAMES} = require('../../utils/constants');
const { BantotalNavigator } = require('../components/BantotalNavigator');

/**
 * Page Object para la Bandeja de Tareas (Step 1).
 */
class BandejaTareasPage extends BasePage {
    constructor(page) {
        super(page);
        this.frameSelector = FRAMES.BANDEJA_STEP1;
        this.baseStep2 = this.mainFrame.frameLocator(FRAMES.BANDEJA_STEP2);
        this.nav = new BantotalNavigator(this.baseBandeja);
    }
    get baseBandeja() { return this.mainFrame.frameLocator(this.frameSelector); }

    get tituloBandeja() { return this.baseBandeja.getByText('Bandeja de Entrada de Tareas'); }
    get inputInstancia() { return this.baseBandeja.locator('#vBINST'); }
    
    get btnFiltrar() { return this.nav.btnFiltrar; }
    get btnEjecutar() { return this.nav.btnEjecutar; }
    
    get btnIniciarProceso() { return this.baseBandeja.getByRole('link', { name: 'Iniciar Proceso' }); }
    get indicatorStep2() { return this.baseStep2.getByText('Iniciar Instancia de Proceso'); }

    getPageLoadFrame() {
        return this.baseBandeja;
    }

    getPageLoadLocators() {
        return [this.tituloBandeja];
    }

    // ========== MÉTODOS PRIVADOS: Solo UI ==========

    /**
     * Escribe un número en el campo de instancia de forma segura.
     * @private
     * @param {string|number} instancia
     * @returns {Promise<void>}
     */
    async _escribirInstanciaEnCampo(instancia) {
        if (!instancia) {
            throw new Error('_escribirInstanciaEnCampo: instancia es requerido');
        }

        await this.inputInstancia.focus();
        await this.inputInstancia.press('Control+a');
        await this.inputInstancia.press('Backspace');
        await this.inputInstancia.pressSequentially(instancia.toString(), { delay: 50 });
        await this.inputInstancia.press('Enter');
        await this.page.waitForTimeout(500);
    }

    /**
     * Obtiene la fila que contiene el número de instancia.
     * @private
     * @param {string|number} instancia
     * @returns {import('@playwright/test').Locator}
     */
    _getFilaPorInstancia(instancia) {
        if (!instancia) {
            throw new Error('_getFilaPorInstancia: instancia es requerido');
        }

        const instanciaStr = instancia.toString();
        return this.baseBandeja
            .locator('tr:has(td)')
            .filter({ hasText: instanciaStr });
    }

    /**
     * Valida que la fila existe en el DOM.
     * @private
     * @param {import('@playwright/test').Locator} fila
     * @param {string|number} instancia
     * @returns {Promise<void>}
     * @throws {Error} si fila no existe
     */
    async _validarFilaExiste(fila, instancia) {
        const count = await fila.count();
        if (count === 0) {
            throw new Error(`No se encontró fila con instancia ${instancia} en la bandeja`);
        }
    }

    /**
     * Hace clic en una fila esperando que esté visible.
     * @private
     * @param {import('@playwright/test').Locator} fila
     * @returns {Promise<void>}
     */
    async _clickEnFila(fila) {
        await expect(fila.first()).toBeVisible({ timeout: TIMEOUTS.LONG });
        await this.click(fila.first(), this.baseBandeja);
    }

    // ========== MÉTODOS PÚBLICOS: Mantienen interfaz existente ==========

    async ejecutarTareaSeleccionada() {
        await this.click(() => this.btnEjecutar, () => this.baseBandeja);
        await this.waitForFrameStable(this.baseStep2);
    }

    /**
     * Filtra la bandeja por número de instancia usando escritura secuencial.
     * Ahora usa método privado para la escritura.
     * @param {string|number} instancia
     */
    async filtrarPorInstancia(instancia) {
        await this._escribirInstanciaEnCampo(instancia);
    }

    /**
     * Selecciona la fila que coincide con el número de instancia.
     * Ahora usa métodos privados sin validación inline.
     * @param {string|number} instancia
     */
    async seleccionarFila(instancia) {
        const fila = this._getFilaPorInstancia(instancia);
        await this._validarFilaExiste(fila, instancia);
        await this._clickEnFila(fila);
    }

    /**
     * Navega a la pantalla de Inicio de Proceso.
     */
    async irAInicioProceso() {
        await this.click(this.btnIniciarProceso);
        await expect(this.indicatorStep2).toBeVisible({ timeout: TIMEOUTS.LONG });
    }
}

module.exports = { BandejaTareasPage };