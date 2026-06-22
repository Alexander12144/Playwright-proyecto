const { expect } = require('@playwright/test');
const { BasePage } = require('../BasePage');
const { TIMEOUTS, FRAMES} = require('../../utils/constants');
const { BantotalNavigator } = require('../components/BantotalNavigator');

/**
 * Page Object para la Consulta de Instancias (Step 2).
 */
class ConsultaInstanciasPage extends BasePage {
    constructor(page) {
        super(page);
        this.frameSelector = FRAMES.BANDEJA_STEP1;
        this.nav = new BantotalNavigator(this.baseFrame);
    }
    get baseFrame() { return this.mainFrame.frameLocator(this.frameSelector); }

    get tituloFrame() { return this.baseFrame.getByText('Consulta de Instancias'); }
    get labelProceso() { return this.baseFrame.getByRole('cell', { name: 'Proceso', exact: true }); }
    get labelUsuario() { return this.baseFrame.getByRole('cell', { name: 'Usuario', exact: true }); }
    get labelInstancia() { return this.baseFrame.getByRole('cell', { name: 'Instancia', exact: true }); }
    get labelFechInicio() { return this.baseFrame.getByRole('cell', { name: 'Desde', exact: true }); }
    get labelFecFin() { return this.baseFrame.getByRole('cell', { name: 'Hasta', exact: true }); }
    get labelDato() { return this.baseFrame.getByRole('cell', { name: 'Dato', exact: true }); }
    get labelValor() { return this.baseFrame.getByRole('cell', { name: 'Valor', exact: true }); }
    get labelActiva() { return this.baseFrame.getByRole('cell', { name: 'Solo Activas', exact: true }); }

    get valorProceso() { return this.baseFrame.locator('#vFWFPRCID'); }
    get valorUsuario() { return this.baseFrame.locator('#vFWFITEMUSRCOD'); }
    get valorInstancia() { return this.baseFrame.locator('#vFWFINSPRCID'); }
    get valorFecInicio() { return this.baseFrame.locator('#vFFECHADESDE'); }
    get valorFecFin() { return this.baseFrame.locator('#vFFECHAHASTA'); }
    get valorDato() { return this.baseFrame.locator('#vFWFATTID'); }
    get valorValor() { return this.baseFrame.locator('#vFWFATTSVAL'); }

    get checkActiva() { return this.baseFrame.getByRole('checkbox', { name: '_' }); }
    get btnFiltrar() { return this.baseFrame.getByRole('link', { name: 'Filtrar' }); }
    get btnDatos() { return this.baseFrame.getByRole('link', { name: 'Datos.Ing' }); }
    get btnConsultar() { return this.baseFrame.getByRole('link', { name: 'Consultar' }); }
    get btnAsientos() { return this.baseFrame.getByRole('link', { name: 'Asientos' }); }
    get btnPlan() { return this.baseFrame.getByRole('link', { name: 'Plan de Pagos' }); }
    get btnOtrosReportes() { return this.baseFrame.getByRole('link', { name: 'Otros Reportes' }); }
    get btnReasignar() { return this.baseFrame.getByRole('link', { name: 'Reasignar Item' }); }
    get btnDocumentos() { return this.baseFrame.getByRole('link', { name: 'Documentos' }); }
    get btnModDatos() { return this.baseFrame.getByRole('link', { name: 'Modif.Datos' }); }
    get btnDelegar() { return this.baseFrame.getByRole('link', { name: 'Delegar' }); }
    get btnAbortar() { return this.baseFrame.getByRole('link', { name: 'Abortar' }); }
    get btnCandidatos() { return this.baseFrame.getByRole('link', { name: 'Candidatos' }); }
    get btnReEjecutar() { return this.baseFrame.getByRole('link', { name: 'Re-Ejecutar' }); }
    get btnImpresos() { return this.baseFrame.getByRole('link', { name: 'Impresos' }); }

    get selectFecInicio() { return this.baseFrame.locator('#vFFECHADESDE_dp_trigger'); }
    get selectFecFin() { return this.baseFrame.locator('#vFFECHAHASTA_dp_trigger'); }

    get labelAdvertencia() { return this.baseFrame.getByText('Debe ingresar Proceso'); }
    get labelSinResultados() { return this.baseFrame.getByText('No hay registros'); }
    async filtrarInstancias() {
        await this.btnFiltrar.click();
    }

    async validarMensajeAdvertencia() {
        await expect(this.labelAdvertencia).toBeVisible();
    }

    async validarUI() {
        await expect(this.tituloFrame).toBeVisible();
        await expect(this.labelProceso).toBeVisible();
        await expect(this.labelUsuario).toBeVisible();
        await expect(this.labelInstancia).toBeVisible();
        await expect(this.labelFechInicio).toBeVisible();
        await expect(this.labelFecFin).toBeVisible();
        await expect(this.labelDato).toBeVisible();
        await expect(this.labelValor).toBeVisible();
        await expect(this.labelActiva).toBeVisible();

        await expect(this.valorProceso).toBeVisible();
        await expect(this.valorUsuario).toBeVisible();
        await expect(this.valorInstancia).toBeVisible();
        await expect(this.valorFecInicio).toBeVisible();
        await expect(this.valorFecFin).toBeVisible();
        await expect(this.valorDato).toBeVisible();
        await expect(this.valorValor).toBeVisible();
        await expect(this.checkActiva).toBeVisible();

        await expect(this.btnDatos).toBeVisible();
        await expect(this.btnConsultar).toBeVisible();
        await expect(this.btnAsientos).toBeVisible();
        await expect(this.btnPlan).toBeVisible();
        await expect(this.btnOtrosReportes).toBeVisible();
        await expect(this.btnReasignar).toBeVisible();
        await expect(this.btnDocumentos).toBeVisible();
        await expect(this.btnModDatos).toBeVisible();
        await expect(this.btnDelegar).toBeVisible();
        await expect(this.btnAbortar).toBeVisible();
        await expect(this.btnCandidatos).toBeVisible();
        await expect(this.btnReEjecutar).toBeVisible();
        await expect(this.btnImpresos).toBeVisible();
        await expect(this.btnFiltrar).toBeVisible();
    }

    async validarSinResultados() {
        await expect(this.labelSinResultados).toBeVisible();
    }

    async filtrarInstancias({proceso, usuario, instancia, fecInicio, fecFin, dato, valor, activa} = {}) {
        if (proceso) {
            this.completarCampo(this.valorProceso, proceso);
        }

        if (usuario) {
            await this.completarCampo(this.valorUsuario, usuario);
        }

        if (instancia) {
            await this.completarCampo(this.valorInstancia, instancia);
        }

        if (fecInicio) {
            await this.completarCampo(this.valorFecInicio, fecInicio);
        }

        if (fecFin) {
            await this.completarCampo(this.valorFecFin, fecFin);
        }

        if (dato) {
            await this.completarCampo(this.valorDato, dato);
        }

        if (valor) {
            await this.completarCampo(this.valorValor, valor);
        }

        if (activa !== undefined) {
            const checked = await this.checkActiva.isChecked();

            if (activa && !checked) {
                await this.checkActiva.check();
            }

            if (!activa && checked) {
                await this.checkActiva.uncheck();
            }
        }

        await this.btnFiltrar.click();
    }
    
    async seleccionarFila() {
        await this.btnSeleccionar.click();
    }
}

module.exports = { ConsultaInstanciasPage }