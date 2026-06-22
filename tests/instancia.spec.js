const { test } = require('../fixtures/auth.fixture');
const { buildInstanciaExistente, buildDatosIncompletos } = require('../fixtures/data/creditoVehicular.data');
const { TIMEOUTS } = require('../utils/constants');
const TEST_TIMEOUT_MS = process.env.E2E_LONG_WAIT === 'true'
    ? (TIMEOUTS.PROCESSING_MAX + TIMEOUTS.UI_TRANSITION)
    : 180000;

test.describe('Módulo de Créditos Vehiculares', () => {

    test('Debe procesar una instancia existente hasta completar datos generales', 
    async ({ menuFlow, bandejaFlow }) => { 
        test.setTimeout(TEST_TIMEOUT_MS);
        // 1. Navegación inicial
        await menuFlow.irABandejaDeEntrada();

        // 2. Orquestación del flujo de negocio
        await bandejaFlow.continuarInstanciaExistente(buildInstanciaExistente(), {
            validarPasoPersona: true
        });
    });

    test('Debe validar error por falta de datos obligatorios en Datos Generales', 
    async ({ menuFlow, bandejaFlow }) => { 
        test.setTimeout(TEST_TIMEOUT_MS);
        // 1. Navegación inicial
        await menuFlow.irABandejaDeEntrada();

        // 2. Orquestación del flujo enviando datos incompletos (faltan tipoDoc y numDoc)
        await bandejaFlow.crearNuevaSolicitudVehicular(
            'Flujo Vehicular / StartSolicitud',
            buildDatosIncompletos(), 
            { validarExito: false });
    });

});