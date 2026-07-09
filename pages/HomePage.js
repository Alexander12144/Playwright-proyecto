const { BasePage } = require('./BasePage');
const { NavigationMenu } = require('./components/NavigationMenu');
const { TIMEOUTS, FRAMES } = require('../utils/constants');

/**
 * Page Object para la página principal (Home) de Bantotal.
 */
class HomePage extends BasePage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        super(page);
        this.menu = new NavigationMenu(page);
    }

    get frame1() {
        return this.page.frameLocator(FRAMES.MAIN);
    }

    get frameInterno() { 
        return this.frame1.frameLocator('iframe[name="process-1_step0"]'); 
    }

    get logo() { return this.page.locator('#logo'); }
    get btnInicio() { return this.page.getByText('Inicio'); }
    get btnAccesos() { return this.page.getByText('Accesos'); }
    get btnAtras() { return this.page.getByRole('link', { name: 'Atrás' }); }
    get btnAdelante() { return this.page.getByRole('link', { name: 'Adelante' }); }
    get btnRecargar() { return this.page.getByRole('listitem').filter({ hasText: 'Recargar' }); }
    get btnImprimir() { return this.page.getByRole('listitem').filter({ hasText: 'Imprimir' }); }

    get linkActividadUsuario() { 
        return this.frame1.getByRole('link', { name: 'Actividad del usuario' }); 
    }

    get txtUltimaActividad() { return this.frameInterno.getByText('Última actividad registrada'); }
    get cellUsuario() { return this.frameInterno.getByRole('cell', { name: 'Usuario', exact: true }); }
    get cellEmpresa() { return this.frameInterno.getByRole('cell', { name: 'Empresa', exact: true }); }
    get cellSucursal() { return this.frameInterno.getByRole('cell', { name: 'Sucursal', exact: true }); }
    get cellFechaSistema() { return this.frameInterno.getByRole('cell', { name: 'Fecha del Sistema', exact: true }); }

    getPageLoadFrame() {
        return this.frame1;
    }

    getPageLoadLocators() {
        return [this.linkActividadUsuario];
    }
}

module.exports = { HomePage };