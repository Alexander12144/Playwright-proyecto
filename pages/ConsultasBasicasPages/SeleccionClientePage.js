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

    // ========== MÉTODOS PRIVADOS: Solo UI ==========

    /**
     * Completa un campo individual de búsqueda sin lógica.
     * @private
     * @param {import('@playwright/test').Locator} campo
     * @param {string} valor
     * @returns {Promise<void>}
     */
    async _completarCampoBusqueda(campo, valor) {
        if (valor) {
            await this.completarCampo(campo, valor);
        }
    }

    /**
     * Obtiene filas del grid filtradas por cuenta.
     * @private
     * @param {string} cuenta
     * @returns {import('@playwright/test').Locator}
     */
    _getFilasClientesPor(cuenta) {
        let fila = this.page.locator('[id^="GridclientesContainerRow_0001"]');

        if (cuenta) {
            fila = fila.filter({
                has: this.page.getByRole('cell', {
                    name: cuenta.toString(),
                    exact: true
                })
            });
        }

        return fila;
    }

    /**
     * Valida que exista exactamente una fila para cuenta.
     * @private
     * @param {import('@playwright/test').Locator} fila
     * @returns {Promise<boolean>} true si hay fila, false si no hay
     * @throws {Error} si hay múltiples filas
     */
    async _validarFilaUnica(fila) {
        const count = await fila.count();

        if (count === 0) {
            return false;
        }

        if (count > 1) {
            throw new Error(`Se encontraron ${count} clientes, se esperaba máximo 1`);
        }

        return true;
    }

    /**
     * Hace clic en el link de la fila.
     * @private
     * @param {import('@playwright/test').Locator} fila
     * @returns {Promise<void>}
     */
    async _clickEnFilaCliente(fila) {
        await fila.getByRole('link').click();
    }

    // ========== MÉTODOS PÚBLICOS: Mantienen interfaz existente ==========

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
        await this._completarCampoBusqueda(this.valorPais, pais);
        await this._completarCampoBusqueda(this.valorTipoDocumento, tipoDocumento);
        await this._completarCampoBusqueda(this.valorCuenta, cuenta);
        await this._completarCampoBusqueda(this.valorNroDocumento, nroDocumento);

        await this.btnFiltrar.click();
        await this.page.waitForTimeout(800);
    }

    /**
     * Realiza la búsqueda completa y selección de un cliente en una sola acción.
     * Ahora delega a métodos más simples.
     * @param {Object} criterios - Datos de búsqueda
     */
    async buscarYSeleccionarCliente(criterios) {
        await this.validarUI();
        await this.completarDatosBusqueda(criterios);
        return await this.seleccionarFila(criterios);
    }

    /**
     * Selecciona la fila que coincide con la cuenta.
     * Ahora internamente usa métodos simples sin lógica.
     */
    async seleccionarFila({ cuenta }) {
        const fila = this._getFilasClientesPor(cuenta);
        const existe = await this._validarFilaUnica(fila);

        if (!existe) {
            await this.btnCerrar.click();
            return false;
        }

        await this._clickEnFilaCliente(fila);
        return true;
    }
}

module.exports = { SeleccionClientePage };