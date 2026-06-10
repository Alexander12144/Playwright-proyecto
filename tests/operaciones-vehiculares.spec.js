const { test, expect } = require('../fixtures/auth.fixture');
const { TIMEOUTS } = require('../utils/constants');
const { OPERACIONES_VEHICULARES_INVALIDAS, OPERACIONES_VEHICULARES_VALIDAS } = require('../fixtures/data/operacionesVehiculares.data');
const TEST_TIMEOUT_MS = process.env.E2E_LONG_WAIT === 'true'
    ? (TIMEOUTS.PROCESSING_MAX + TIMEOUTS.UI_TRANSITION)
    : 180000;

test.describe('Módulo de Operaciones Vehiculares - Bantotal', () => {
    test('Debe mostrar sin resultados cuando filtra con datos erróneos', 
        async ({ menuFlow, operacionesVehicularesFlow }) => {
            test.setTimeout(TEST_TIMEOUT_MS);

            // 1) Navegamos al módulo y validamos que la UI carga correctamente
            await menuFlow.irAConsultaOperacionesVehiculares();
            await operacionesVehicularesFlow.validarUICompleta();

            // 2) Filtramos con datos erróneos
            const tieneResultados = await operacionesVehicularesFlow.filtrarOperaciones(OPERACIONES_VEHICULARES_INVALIDAS);

            // 3) Validamos que no se muestran resultados
            expect(tieneResultados).toBeFalsy();
    });

    test('Debe filtrar y seleccionar operación válida', 
        async ({ menuFlow, operacionesVehicularesFlow }) => {
            test.setTimeout(TEST_TIMEOUT_MS);

            // 1) Navegamos al módulo y validamos que la UI carga correctamente
            await menuFlow.irAConsultaOperacionesVehiculares();
            await operacionesVehicularesFlow.validarUICompleta();

            // 2) Filtramos con datos válidos y seleccionamos la fila encontrada
            const tieneResultados = await operacionesVehicularesFlow.filtrarOperaciones(OPERACIONES_VEHICULARES_VALIDAS);

            // 3) Validamos que se muestran resultados y se selecciona la fila correctamente
            expect(tieneResultados).toBeTruthy();
    });

    test('Debe seleccionar por cuenta desde busqueda',
        async ({ menuFlow, operacionesVehicularesFlow }) => {
            test.setTimeout(TEST_TIMEOUT_MS);

            // 1) Navegamos al módulo y validamos que la UI carga correctamente
            await menuFlow.irAConsultaOperacionesVehiculares();
            await operacionesVehicularesFlow.validarUICompleta();

            // 2) Seleccionamos la cuenta del cliente
            await operacionesVehicularesFlow.seleccionarCuentaCliente();
        });    
});