const { expect } = require('@playwright/test');
const { BasePage } = require('../BasePage');
const { TIMEOUTS } = require('../../utils/constants');

class SeleccionPaisPage extends BasePage {
    constructor(page) {
        super(page);
    }

    get labelTitulo() { return this.page.getByText('Selección de Países'); }
    get labelPosicion() { return this.page.getByText('Posicionarse en'); }

    get valorPosicion() { return this.page.locator('#vPANOM'); }
    get btnFiltrar() { return this.page.getByRole('link', { name: 'Filtrar' }); }
    get btnAnterior() { return this.page.getByRole('link', { name: '<< Anterior' }); }
    get btnSiguiente() { return this.page.getByRole('link', { name: 'Siguiente' }); }
    get btnCerrar() { return this.page.getByRole('link', { name: 'Cerrar' }); }

    async filtrarPorPais(pais) {
        await this.completarCampo(this.valorPosicion, pais);
        await this.btnFiltrar.click();
        await this.page.waitForTimeout(500);
    }
    async seleccionarPais(pais) {
        const mensajeSinRegistros = this.page.getByText('No hay registros');

        if (await mensajeSinRegistros.isVisible({ timeout: 2000 }).catch(() => false)) {
            await this.btnCerrar.click();
            return false;
        }

        const fila = this.page
            .getByRole('row')
            .filter({ hasText: pais });

        await fila.getByRole('link').click();

        return true;
    }

    async irASiguiente(){
        if (await this.btnSiguiente.isDisabled()) {
            return false;
        }
        await this.btnSiguiente.click();
        await this.page.waitForTimeout(500);

        return true;
    }

    async irAAnterior(){
        if (await this.btnAnterior.isDisabled()) {
           return false;
        }
        await this.btnAnterior.click();
        await this.page.waitForTimeout(500);
        
        return true;
    }

    async validarUI() {
        const timeout = { timeout: TIMEOUTS.MEDIUM };

        await expect(this.labelTitulo).toBeVisible(timeout);
        await expect(this.labelPosicion).toBeVisible(timeout);
        await expect(this.valorPosicion).toBeVisible(timeout);
        await expect(this.btnFiltrar).toBeVisible(timeout);
        await expect(this.btnAnterior).toBeVisible(timeout);
        await expect(this.btnSiguiente).toBeVisible(timeout);
        await expect(this.btnCerrar).toBeVisible(timeout);
    }
}

module.exports = { SeleccionPaisPage };