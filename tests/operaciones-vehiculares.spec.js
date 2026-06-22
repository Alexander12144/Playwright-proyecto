const { test, expect } = require('../fixtures/auth.fixture');
const { TIMEOUTS } = require('../utils/constants');

const {
    OPERACIONES_VEHICULARES_INVALIDAS,
    OPERACIONES_VEHICULARES_VALIDAS,
    OPERACIONES_VEHICULARES_DATOS_CLIENTE_VALIDOS,
    OPERACIONES_VEHICULARES_DATOS_CLIENTE_INVALIDOS
} = require('../fixtures/data/operacionesVehiculares.data');

const TEST_TIMEOUT_MS =
    process.env.E2E_LONG_WAIT === 'true'
        ? (TIMEOUTS.PROCESSING_MAX + TIMEOUTS.UI_TRANSITION)
        : 180000;

test.describe('Módulo de Operaciones Vehiculares - Bantotal', () => {

    test.setTimeout(TEST_TIMEOUT_MS);

    test.beforeEach(async ({ menuFlow, operacionesVehicularesFlow }) => {
        await menuFlow.irAConsultaOperacionesVehiculares();
        await operacionesVehicularesFlow.validarUICompleta();
    });

    const escenariosFiltrado = [
        {
            nombre: 'Debe mostrar sin resultados cuando se filtra con datos erróneos',
            datos: OPERACIONES_VEHICULARES_INVALIDAS,
            resultadoEsperado: false
        },
        {
            nombre: 'Debe mostrar resultados cuando se filtra con datos válidos',
            datos: OPERACIONES_VEHICULARES_VALIDAS,
            resultadoEsperado: true
        }
    ];

    escenariosFiltrado.forEach(({ nombre, datos, resultadoEsperado }) => {

        test(nombre, async ({ operacionesVehicularesFlow }) => {

            const tieneResultados =
                await operacionesVehicularesFlow.filtrarOperaciones(datos);

            expect(tieneResultados).toBe(resultadoEsperado);

        });

    });

    test(
        'Debe seleccionar una cuenta existente desde la búsqueda',
        async ({ operacionesVehicularesFlow }) => {

            const cuentaEncontrada =
                await operacionesVehicularesFlow.seleccionarCuentaCliente(
                    OPERACIONES_VEHICULARES_DATOS_CLIENTE_VALIDOS.pais,
                    OPERACIONES_VEHICULARES_DATOS_CLIENTE_VALIDOS.tipoDocumento,
                    OPERACIONES_VEHICULARES_DATOS_CLIENTE_VALIDOS.cuenta
                );

            expect(cuentaEncontrada).toBeTruthy();

        }
    );

    test(
        'Debe mostrar sin resultados al buscar una cuenta inexistente',
        async ({ operacionesVehicularesFlow }) => {

            const cuentaEncontrada =
                await operacionesVehicularesFlow.seleccionarCuentaCliente(
                    OPERACIONES_VEHICULARES_DATOS_CLIENTE_INVALIDOS.pais,
                    OPERACIONES_VEHICULARES_DATOS_CLIENTE_INVALIDOS.tipoDocumento,
                    OPERACIONES_VEHICULARES_DATOS_CLIENTE_INVALIDOS.cuenta
                );

            expect(cuentaEncontrada).toBeFalsy();

        }
    );

});