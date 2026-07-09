const { TIMEOUTS, TEST_DATA } = require('../../utils/constants');
const { ConsultaInstanciasPage } = require('../../pages/BandejaTareasPages/ConsultaInstanciasPage');

/**
 * Orquestador del flujo Consulta de Instancias WF - Administrador.
 */
class ConsultaInstanciasFlow {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.consultaInstanciasPage = new ConsultaInstanciasPage(page);
    }

    /**
     * Valida la UI, ejecuta un filtro vacío y luego busca una instancia configurable.
     * @returns {Promise<void>}
     */
    async filtrarYValidar() {
        await this.page.waitForLoadState('networkidle');
        await this.consultaInstanciasPage.validarUI();
        await this.consultaInstanciasPage.filtrarInstancias();
        await this.consultaInstanciasPage.labelSinResultados.waitFor({
            state: 'visible',
            timeout: TIMEOUTS.MEDIUM
        });
        await this.consultaInstanciasPage.filtrarInstancias({
            instancia: TEST_DATA.INSTANCIA_CONSULTA
        });
    }
}

module.exports = { ConsultaInstanciasFlow };
