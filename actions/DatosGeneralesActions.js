const { expect } = require('@playwright/test');
const { DatosGeneralesPage } = require('../pages/DatosGeneralesPage');
const { TIMEOUTS } = require('../utils/constants');

class DatosGeneralesActions {
    constructor(page) {
        this.page = page;
        this.datosPage = new DatosGeneralesPage(page);
    }

    // ========== VALIDACIONES DE ESTRUCTURA ==========
    async validarDatosIniciales() {
        await this.datosPage.expectVisible(this.datosPage.tituloStep4, TIMEOUTS.LONG);
        await this.datosPage.expectVisible(this.datosPage.labelDatosIniciales, TIMEOUTS.MEDIUM);
        await this.datosPage.expectVisible(this.datosPage.selectTipoPersona, TIMEOUTS.MEDIUM);
        await this.datosPage.expectVisible(this.datosPage.inputNumeroDocumento, TIMEOUTS.MEDIUM);
    }

    /**
     * Valida que todos los mensajes de error detectados por el Flow sean visibles
     * @param {string[]} listaErrores - Array de mensajes definidos en la Page
     */
    async validarPresenciaDeErrores(listaErrores) {
        const erroresValidos = listaErrores.filter(error => !!error);

        if (erroresValidos.length === 0) return;

        for (const textoError of erroresValidos) {
            const locator = this.datosPage.getLocatorError(textoError);
            
            await expect(locator, `No se visualizó el error: ${textoError}`).toBeVisible({ 
                timeout: TIMEOUTS.MEDIUM 
            });
        }
    }

    // ========== ACCIONES ATÓMICAS (INTERACCIÓN) ==========

    async seleccionarTipoPersona(tipo) {
        await this.datosPage.selectOption(this.datosPage.selectTipoPersona, tipo);
    }

    async seleccionarPais(pais) {
        await this.datosPage.selectOption(this.datosPage.selectPaisDocumento, pais);
    }

    async seleccionarTipoDoc(tipo) {
        await this.datosPage.selectOption(this.datosPage.selectTipoDocumento, tipo);
    }

    async ingresarNumeroDocumento(numero) {
        await this.datosPage.fill(this.datosPage.inputNumeroDocumento, numero);
    }

    async seleccionarTipoSolicitud(tipo) {
        await this.datosPage.selectOption(this.datosPage.selectTipoSolicitud, tipo);
    }

    async seleccionarConcesionaria(concesionaria) {
        await this.datosPage.selectOption(this.datosPage.selectConcesionaria, concesionaria);
    }

    async seleccionarSucursal(sucursal) {
        await this.datosPage.selectOption(this.datosPage.selectSucursal, sucursal);
    }

    async seleccionarVendedor(vendedor) {
        await this.datosPage.selectOption(this.datosPage.selectVendedor, vendedor);
    }

    async ejecutarValidacion() {
        await this.datosPage.click(this.datosPage.linkValidarDatos);
        await this.datosPage.waitForValidacionProcesada();
    }

    async continuarSiguiente() {
        await this.datosPage.click(this.datosPage.linkSiguiente);
    }
}

module.exports = { DatosGeneralesActions };