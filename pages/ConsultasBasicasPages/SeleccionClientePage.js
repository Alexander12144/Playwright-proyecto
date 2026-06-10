const { expect } = require('@playwright/test');
const { BasePage } = require('../BasePage');
const { TIMEOUTS } = require('../../utils/constants');

class SeleccionClientePage extends BasePage {
    constructor(page) {
        super(page);
    }

    get labelTitulo() { return this.page.getByText('Selección de Cliente'); }

    get labelCuenta() { return this.page.getByRole('cell', { name: 'Cuenta', exact: true }); }
    get valorCuenta() { return this.page.locator('#vNOM_FIL'); }

    get labelPais() { return this.page.getByRole('cell', { name: 'País', exact: true }); }
    get valorPais() { return this.page.locator('#vPEPAIS_FIL'); }

    get labelTipoDocumento() { return this.page.getByRole('cell', { name: 'Tipo Doc.', exact: true }); }
    get valorTipoDocumento() { return this.page.locator('#vPETDOC_FIL'); }

    get labelNroDocumento() { return this.page.getByRole('cell', { name: 'Nro. Documento', exact: true }); }
    get valorNroDocumento() { return this.page.locator('#vPENDOC_FIL'); }

    get btnFiltrar() { return this.page.getByRole('link', { name: 'Filtrar' }); }
    get btnSiguiente() { return this.page.getByRole('link', { name: 'Siguiente' }); }
    get btnCerrar() { return this.page.getByRole('link', { name: 'Cerrar' }); }

    async validarUI() {
        const timeout = { timeout: TIMEOUTS.MEDIUM };

        await expect(this.labelTitulo).toBeVisible(timeout);
        await expect(this.labelCuenta).toBeVisible(timeout);
        await expect(this.valorCuenta).toBeVisible(timeout);
        await expect(this.labelPais).toBeVisible(timeout);
        await expect(this.valorPais).toBeVisible(timeout);
        await expect(this.labelTipoDocumento).toBeVisible(timeout);
        await expect(this.valorTipoDocumento).toBeVisible(timeout);
        await expect(this.labelNroDocumento).toBeVisible(timeout);
        await expect(this.valorNroDocumento).toBeVisible(timeout);
        await expect(this.btnFiltrar).toBeVisible(timeout);
        await expect(this.btnSiguiente).toBeVisible(timeout);
        await expect(this.btnCerrar).toBeVisible(timeout);
    }

    async filtrarPorCuenta(cuenta) {
        await this.completarCampo(this.valorCuenta, cuenta);
        await this.btnFiltrar.click();
        await this.page.waitForTimeout(500);
    }

    async completarDatosBusqueda({ cuenta, pais, tipoDocumento, nroDocumento }) {
        if (pais) {
            await this.completarCampo(this.valorPais, pais);
        }
        if (tipoDocumento) {
            await this.completarCampo(this.valorTipoDocumento, tipoDocumento);
        }
        if (cuenta) {
            await this.completarCampo(this.valorCuenta, cuenta);
        }
        if (nroDocumento) {
            await this.completarCampo(this.valorNroDocumento, nroDocumento);
        }

        await this.btnFiltrar.click();
        await this.page.waitForTimeout(500);

    }

    async seleccionarFila({ cuenta }) {
        let fila = this.page.locator('[id^="GridclientesContainerRow_0001"]');

        if (cuenta) {
            fila = fila.filter({
                has: this.page.getByRole('cell', {
                    name: cuenta.toString(),
                    exact: true
                })
            });
        }

        const count = await fila.count();

        if (count === 0) {
            await this.btnCerrar.click();
            return false;
        }

        await fila.first().click();
        await this.btnSiguiente.click();

        return true;
    }

}

module.exports = { SeleccionClientePage };