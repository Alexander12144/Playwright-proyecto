const { TIMEOUTS, FRAMES } = require('../../utils/constants');
const { ConsultaInstanciasPage } = require('../../pages/BandejaTareasPages/ConsultaInstanciasPage');

class ConsultaInstanciasFlow {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.consultaInstanciasPage = new ConsultaInstanciasPage(page);
    }   

    async consultarInstancias() {
        await this.page.frame(FRAMES.BANDEJA_STEP2).waitForSelector('text=Consulta de Instancias', { timeout: TIMEOUTS.LONG });
        await this.page.frame(FRAMES.BANDEJA_STEP2).click('text=Consulta de Instancias');
    }

    async filtrarYValidar() {
        await this.page.waitForLoadState('networkidle');
        await this.consultaInstanciasPage.validarUI();
        await this.consultaInstanciasPage.filtrarInstancias();
        await this.consultaInstanciasPage.labelSinResultados.waitFor({ state: 'visible', timeout: TIMEOUTS.MEDIUM });
        await this.consultaInstanciasPage.filtrarInstancias( {instancia: 918674});
    }

}

module.exports = { ConsultaInstanciasFlow };