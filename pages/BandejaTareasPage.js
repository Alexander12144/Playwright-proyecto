const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');
const { TIMEOUTS, FRAMES} = require('../utils/constants');
const { BantotalNavigator } = require('./components/BantotalNavigator');

/**
 * Page Object para la Bandeja de Tareas (Step 1).
 */
class BandejaTareasPage extends BasePage {
    constructor(page) {
        super(page);
        this.baseBandeja = this.mainFrame.frameLocator(FRAMES.BANDEJA_STEP1);
        this.baseStep2 = this.mainFrame.frameLocator(FRAMES.BANDEJA_STEP2);
        this.nav = new BantotalNavigator(this.baseBandeja);
    }

    get tituloBandeja() { return this.baseBandeja.getByText('Bandeja de Entrada de Tareas'); }
    get inputInstancia() { return this.baseBandeja.locator('#vBINST'); }
    
    get btnFiltrar() { return this.nav.btnFiltrar; }
    get btnEjecutar() { return this.nav.btnEjecutar; }
    
    get btnIniciarProceso() { return this.baseBandeja.getByRole('link', { name: 'Iniciar Proceso' }); }
    get indicatorStep2() { return this.baseStep2.getByText('Iniciar Instancia de Proceso'); }

    getPageLoadFrame() {
        return this.baseBandeja;
    }

    async ejecutarTareaSeleccionada() {
        await this.click(() => this.btnEjecutar, () => this.baseBandeja);
        await this.waitForFrameStable(this.baseStep2);
    }

    /**
     * Filtra la bandeja por número de instancia usando escritura secuencial.
     * @param {string|number} instancia
     */
    async filtrarPorInstancia(instancia) {
        if (!instancia) {
            throw new Error('filtrarPorInstancia: nroInstancia es requerido');
        }

        await this.inputInstancia.focus();
        await this.inputInstancia.press('Control+a');
        await this.inputInstancia.press('Backspace');
        await this.inputInstancia.pressSequentially(instancia.toString(), { delay: 50 });
        await this.inputInstancia.press('Enter');

        // Esperar brevemente a que se aplique el filtro
        await this.page.waitForTimeout(500);
    }

    /**
     * Selecciona la fila que coincide con el número de instancia.
     * @param {string|number} instancia
     */
    async seleccionarFila(instancia) {
        if (!instancia) {
            throw new Error('seleccionarFila: nroInstancia es requerido');
        }

        const instanciaStr = instancia.toString();
        
        // Estrategia: buscar celdas que contengan exactamente la instancia, luego subir a la fila padre
        // Usamos nth-of-type para asegurar que tomamos solo filas de datos (no encabezados)
        const fila = this.baseBandeja
            .locator('tr:has(td)')  // Solo filas que contengan TD (excluye header/footer)
            .filter({ hasText: instanciaStr });

        // Verificar que se encontró al menos una fila
        const count = await fila.count();
        if (count === 0) {
            throw new Error(`No se encontró fila con instancia ${instanciaStr} en la bandeja`);
        }

        await expect(fila.first()).toBeVisible({ timeout: TIMEOUTS.LONG });
        await this.click(fila.first(), this.baseBandeja);
    }

    /**
     * Navega a la pantalla de Inicio de Proceso.
     */
    async irAInicioProceso() {
        await this.click(this.btnIniciarProceso);
        await expect(this.indicatorStep2).toBeVisible({ timeout: TIMEOUTS.LONG });
    }

    async esperarPaso2Visible() {
        await this.waitForFrameStable(this.baseStep2);
        await expect(this.indicatorStep2).toBeVisible({ timeout: TIMEOUTS.LONG });
    }

    /**
     * Fallback para combos difíciles en Bantotal
     */
    async seleccionarCombo(locator, valor) {
        if (!valor) return;
        try {
            await locator.selectOption({ label: valor }, { timeout: 2000 });
        } catch (e) {
            await locator.click();
            await this.baseBandeja.getByText(valor, { exact: true }).click({ force: true });
        }
    }
}

module.exports = { BandejaTareasPage };