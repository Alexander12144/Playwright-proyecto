const { expect } = require('@playwright/test');
const { BandejaTareasPage } = require('../pages/BandejaTareasPage');
const { TIMEOUTS } = require('../utils/constants');

class BandejaTareasActions {
    constructor(page) {
        this.page = page;
        this.bandeja = new BandejaTareasPage(page);
    }

    // ========== VALIDACIONES ==========
    async validarCargaCompleta() {
        await this.bandeja.expectVisible(this.bandeja.tituloBandeja, 20000);
        await this.bandeja.expectVisible(this.bandeja.btnFiltrar, 10000);
    }

    // ========== FILTROS ==========
    async ingresarNumeroInstancia(nroInstancia) {
        if (!nroInstancia) return;
        await this.bandeja.fill(this.bandeja.inputInstancia, nroInstancia.toString());
    }

    async ingresarComentario(comentario) {
        if (!comentario) return;
        await this.bandeja.fill(this.bandeja.inputComentario, comentario);
    }

    async seleccionarDelCombo(comboLocator, valor) {
        if (!valor) return;

        try {
            await comboLocator.selectOption({ label: valor }, { timeout: 2000 });
        } catch {
            await comboLocator.click();
            const opcion = this.bandeja.getOpcionCombo(valor);
            await opcion.waitFor({ state: 'attached', timeout: 5000 });
            await opcion.click({ force: true });
        }
    }

    async seleccionarVista(vista) {
        await this.seleccionarDelCombo(this.bandeja.comboVista, vista);
    }

    async seleccionarRol(rol) {
        await this.seleccionarDelCombo(this.bandeja.comboRoles, rol);
    }

    async seleccionarOrden(orden) {
        await this.seleccionarDelCombo(this.bandeja.comboOrden, orden);
    }

    async ejecutarFiltro() {
        await this.bandeja.click(this.bandeja.btnFiltrar);
        await this.bandeja.btnFiltrar.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    }

    async filtrarInstancias(filtros = {}) {
        const { nroInstancia, vista, rol, comentario, orden } = filtros;

        await this.ingresarNumeroInstancia(nroInstancia);
        await this.ingresarComentario(comentario);
        await this.seleccionarVista(vista);
        await this.seleccionarRol(rol);
        await this.seleccionarOrden(orden);
        await this.ejecutarFiltro();
        
        await this.page.waitForTimeout(2000);
    }

    // ========== TABLA ==========
    async validarFilaVisible(instancia) {
        const fila = this.bandeja.getFilaPorInstancia(instancia);
        await expect(fila).toBeVisible({ timeout: 10000 });
        return fila;
    }

    async seleccionarFila(instancia) {
        const fila = await this.validarFilaVisible(instancia);
        await fila.click();
    }

    async ejecutarAccion() {
        await this.bandeja.expectVisible(this.bandeja.btnEjecutar, 5000);
        await this.bandeja.click(this.bandeja.btnEjecutar);
        await this.bandeja.btnIniciarProceso.waitFor({ state: 'visible', timeout: TIMEOUTS.LONG });
    }

    async ingresarInicioProceso() {
        await this.bandeja.expectVisible(this.bandeja.btnIniciarProceso, 30000);
        await this.bandeja.click(this.bandeja.btnIniciarProceso);
        await this.bandeja.expectVisible(this.bandeja.btnPagSig, 30000);
    }
}

module.exports = { BandejaTareasActions };