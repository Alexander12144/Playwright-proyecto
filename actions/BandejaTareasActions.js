const { expect } = require('@playwright/test');
const { BandejaTareasPage } = require('../pages/BandejaTareasPage');
const { TIMEOUTS } = require('../utils/constants');

class BandejaTareasActions {
    constructor(page) {
        this.page = page;
        this.bandejaPage = new BandejaTareasPage(page);
    }

    async validarCargaCompleta() {
        await expect(this.bandejaPage.tituloBandeja).toBeVisible({ timeout: TIMEOUTS.LONG });
        await expect(this.bandejaPage.btnFiltrar).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
    }

    /**
     * Maneja la selección de combos con fallback: 
     * Si falla el select nativo, intenta mediante click y búsqueda de opción.
     */
    async seleccionarDelCombo(comboLocator, valor) {
        if (!valor) return;
        try {
            await comboLocator.selectOption({ label: valor }, { timeout: 2000 });
        } catch (error) {
            await comboLocator.click();
            const opcion = this.bandejaPage.getOpcionCombo(valor);
            await opcion.click({ force: true });
        }
    }

    async filtrarInstancias(filtros = {}) {
        const { nroInstancia, vista, rol, comentario, orden } = filtros;

        if (nroInstancia) await this.bandejaPage.inputInstancia.fill(nroInstancia.toString());
        if (comentario) await this.bandejaPage.inputComentario.fill(comentario);
        
        await this.seleccionarDelCombo(this.bandejaPage.comboVista, vista);
        await this.seleccionarDelCombo(this.bandejaPage.comboRoles, rol);
        await this.seleccionarDelCombo(this.bandejaPage.comboOrden, orden);

        await this.bandejaPage.btnFiltrar.click();
        
        // Espera de estabilidad post-filtrado
        await this.page.waitForLoadState('networkidle');
    }

    async seleccionarFila(instancia) {
        const fila = this.bandejaPage.getFilaPorInstancia(instancia);
        await expect(fila).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
        await fila.click();
    }

    async ejecutarAccion() {
        await expect(this.bandejaPage.btnEjecutar).toBeVisible({ timeout: TIMEOUTS.MEDIUM });
        await this.bandejaPage.btnEjecutar.click();
        // Espera hasta que el botón de la siguiente fase sea visible
        await expect(this.bandejaPage.btnIniciarProceso).toBeVisible({ timeout: TIMEOUTS.LONG });
    }

    /**
     * Transiciona de la Bandeja (Step 1) a la Instancia de Proceso (Step 2)
     */
    async ingresarInicioProceso() {
        await expect(this.bandejaPage.btnIniciarProceso).toBeVisible({ timeout: TIMEOUTS.LONG });
        await this.bandejaPage.btnIniciarProceso.click();
        
        // Verificamos el elemento en el frame del Step 2 para confirmar el cambio de contexto
        await expect(this.bandejaPage.btnPagSig).toBeVisible({ timeout: TIMEOUTS.LONG });
    }
}

module.exports = { BandejaTareasActions };