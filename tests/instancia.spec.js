const { test } = require('../fixtures/auth.fixture');
const { MenuFlow } = require('../flows/MenuFlow');
const { BandejaTareasFlow } = require('../flows/BandejaTareasFlow');

test.describe('Módulo de Créditos Vehiculares', () => {

    test('Debe procesar una instancia existente hasta completar datos generales', async ({ authenticatedPage }) => {
        const menuFlow = new MenuFlow(authenticatedPage);
        const bandejaFlow = new BandejaTareasFlow(authenticatedPage);

        // 1. Navegación inicial
        await menuFlow.irABandejaDeEntrada();

        // 2. Orquestación del flujo de negocio
        await bandejaFlow.continuarInstanciaExistente({
            nroInstancia: '918094',
            tipoPersona: 'Natural',
            pais: 'PERU',
            tipoDoc: 'D.N.I',
            numDoc: '12345678',
            tipoSolicitud: 'Vehicular',
            concesionaria: 'AUTOESPAR',
            sucursal: 'AU-SAN MIGUEL',
            vendedor: 'Administrador'
        });
    });

});