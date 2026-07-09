const { test } = require('../fixtures/auth.fixture');
const { BASE_CREDITO_VEHICULAR, buildDatosIncompletos } = require('../fixtures/data/creditoVehicular.data');
const { TIMEOUTS } = require('../utils/constants');

/**
 * Validaciones del paso Datos Generales en el flujo de Créditos Vehiculares.
 */
test.describe('Validaciones de Datos Generales - Créditos Vehiculares', () => {
    test.setTimeout(TIMEOUTS.PROCESSING_MAX);

    test('Debe mostrar errores cuando faltan tipo de documento y número de documento', async ({ menuFlow, bandejaFlow }) => {
        await menuFlow.irABandejaDeEntrada();

        await bandejaFlow.crearNuevaSolicitudVehicular(
            'Flujo Vehicular / StartSolicitud',
            buildDatosIncompletos(),
            { validarExito: false }
        );

        await bandejaFlow.validarResultadoValidacionVacio();
        await bandejaFlow.validarMensajesObligatoriosDatosGenerales();
    });

    test('Debe completar el campo de resultado de validación con datos válidos al ejecutar solo la validación', async ({ menuFlow, bandejaFlow }) => {
        await menuFlow.irABandejaDeEntrada();

        await bandejaFlow.crearNuevaSolicitudVehicular(
            'Flujo Vehicular / StartSolicitud',
            BASE_CREDITO_VEHICULAR,
            { validarExito: false }
        );

        await bandejaFlow.validarResultadoValidacionCompleto();
    });
});
