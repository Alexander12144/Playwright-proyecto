const { expect } = require('@playwright/test');
const { DatosGeneralesPage } = require('../pages/DatosGeneralesPage');
const { TIMEOUTS } = require('../utils/constants');

class DatosGeneralesActions {
    constructor(page) {
        this.page = page;
        this.datosPage = new DatosGeneralesPage(page);
    }

    async validarCargaSeccion() {
        await expect(this.datosPage.tituloStep).toBeVisible({ timeout: TIMEOUTS.LONG });
    }

    /**
     * @param {string[]} listaErrores - Array de mensajes de error a validar
     */
    async validarPresenciaDeErrores(listaErrores) {
        for (const textoError of listaErrores.filter(e => !!e)) {
            await expect(this.datosPage.getLocatorError(textoError)).toBeVisible({ 
                timeout: TIMEOUTS.MEDIUM 
            });
        }
    }

    async seleccionarTipoPersona(tipo) {
        await this.datosPage.selectTipoPersona.selectOption(tipo);
    }

    async seleccionarPais(pais) {
        await this.datosPage.selectPaisDocumento.selectOption(pais);
    }

    async seleccionarTipoDoc(tipo) {
        await this.datosPage.selectTipoDocumento.selectOption(tipo);
    }

    async ingresarNumeroDocumento(numero) {
        await this.datosPage.inputNumeroDocumento.fill(numero.toString());
    }

    async seleccionarTipoSolicitud(tipo) {
        await this.datosPage.selectTipoSolicitud.selectOption(tipo);
    }

    async seleccionarSucursal(sucursal) {
        await this.datosPage.selectSucursal.selectOption(sucursal);
    }

    async seleccionarVendedor(vendedor) {
        await this.datosPage.selectVendedor.selectOption(vendedor);
    }

    async ejecutarValidacion() {
        await this.datosPage.linkValidarDatos.click();
        // Sincronización dinámica: espera éxito o error
        await Promise.race([
            this.datosPage.inputResultadoValidacion.waitFor({ state: 'visible' }),
            this.page.locator('text=Debe').first().waitFor({ state: 'visible' })
        ]).catch(() => {});
    }

    async continuarSiguiente() {
        await this.datosPage.linkSiguiente.click();
    }
}

module.exports = { DatosGeneralesActions };