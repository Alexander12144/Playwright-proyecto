const { test } = require('../fixtures/auth.fixture');
const { MenuFlow } = require('../flows/MenuFlow');
const { BandejaTareasFlow } = require('../flows/BandejaTareasFlow');

test.describe('Creación de Instancias', () => {

    test('Debe crear instancia vehicular', async ({ authenticatedPage }) => {
        const menuFlow = new MenuFlow(authenticatedPage);
        const bandejaFlow = new BandejaTareasFlow(authenticatedPage);

        await menuFlow.seleccionarInicio();

        await bandejaFlow.continuarInstanciaEjecutar({
            tipoPersona: 'Natural',
            numDoc: '12345678',
            nroInstancia: '918094'
        });
    });

});