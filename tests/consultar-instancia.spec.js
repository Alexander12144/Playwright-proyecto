const { test } = require('../fixtures/auth.fixture');
const { TIMEOUTS } = require('../utils/constants');

/**
 * Consulta de Instancias WF - Administrador.
 */
test.describe('Validaciones de Consulta de Instancias - Créditos Vehiculares', () => {
    test.setTimeout(TIMEOUTS.PROCESSING_MAX);

    test('Debe buscar y seleccionar una instancia existente', async ({ menuFlow, consultaInstanciasFlow }) => {
        await menuFlow.irAConsultaInstanciaAdministrador();
        await consultaInstanciasFlow.filtrarYValidar();
    });
});
