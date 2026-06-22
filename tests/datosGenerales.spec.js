const { test, expect } = require('../fixtures/auth.fixture');
const { BASE_CREDITO_VEHICULAR, buildDatosIncompletos } = require('../fixtures/data/creditoVehicular.data');

/**
 * Cobertura adicional para el flujo de Datos Generales utilizando POM y flujos reutilizables.
 */
test.describe('Validaciones de Datos Generales - Créditos Vehiculares', () => { test.setTimeout(60000);
    test('Debe mostrar errores cuando faltan tipo de documento y número de documento', async ({ menuFlow, bandejaFlow }) => {
        await menuFlow.irABandejaDeEntrada();

        await bandejaFlow.crearNuevaSolicitudVehicular(
            'Flujo Vehicular / StartSolicitud',
            buildDatosIncompletos(),
            { validarExito: false }
        );
    });

    test('Debe mantener el resultado de validación vacío cuando la validación falla', async ({ menuFlow, bandejaFlow }) => {
        await menuFlow.irABandejaDeEntrada();

        await bandejaFlow.crearNuevaSolicitudVehicular(
            'Flujo Vehicular / StartSolicitud',
            buildDatosIncompletos(),
            { validarExito: false }
        );

        await expect(bandejaFlow.datosGeneralesFlow.datosPage.inputResultadoValidacion).toHaveValue('', { timeout: 10000 });
        await expect(bandejaFlow.datosGeneralesFlow.datosPage.baseFrame.getByText(/Debe\s+/).first()).toBeVisible({ timeout: 10000 });
    });

    test('Debe completar el campo de resultado de validación con datos válidos al ejecutar solo la validación', async ({ menuFlow, bandejaFlow }) => {
        await menuFlow.irABandejaDeEntrada();

        await bandejaFlow.crearNuevaSolicitudVehicular(
            'Flujo Vehicular / StartSolicitud',
            BASE_CREDITO_VEHICULAR,
            { validarExito: false }
        );

        await expect(bandejaFlow.datosGeneralesFlow.datosPage.inputResultadoValidacion).not.toHaveValue('', { timeout: 10000 });
    });
});
