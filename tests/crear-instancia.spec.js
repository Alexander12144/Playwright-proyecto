const { test } = require('../fixtures/auth.fixture');
const { BASE_CREDITO_VEHICULAR } = require('../fixtures/data/creditoVehicular.data');
const { TIMEOUTS } = require('../utils/constants');

test.describe('Módulo de Créditos Vehiculares', () => {
    test('Debe crear una nueva solicitud vehicular', async ({ menuFlow, bandejaFlow }) => {
        test.setTimeout(TIMEOUTS.PROCESSING_MAX + TIMEOUTS.UI_TRANSITION);
        // 1. Navegación inicial
        await menuFlow.irABandejaDeEntrada();

        // 2. Orquestación del flujo de negocio
        await bandejaFlow.crearNuevaSolicitudVehicular('Flujo Vehicular / StartSolicitud', BASE_CREDITO_VEHICULAR);
    });
});