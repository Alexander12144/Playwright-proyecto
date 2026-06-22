const { test, expect } = require('../fixtures/auth.fixture');
const { TIMEOUTS } = require('../utils/constants');

/**
 * Consultar Instancia - Cobertura adicional para el flujo de Consulta de Instancias utilizando POM y flujos reutilizables.
 * Este test se enfoca en validar la funcionalidad de consulta de instancias, asegurando que el proceso de búsqueda y selección de una instancia funcione correctamente.
 * Se cubren escenarios como la búsqueda de una instancia existente, la validación de los resultados de búsqueda y la selección de una instancia para su visualización.
 * 
 * Flujo del test:  
 * 1. Ir bandeja de Tareas.
 * 2. Navegar a Consulta de Instancia WF - Administrador.
 * 3. Realizar una búsqueda de instancia utilizando criterios específicos.
 * 4. Validar que los resultados de búsqueda sean correctos.
 * 5. Seleccionar una instancia de los resultados y validar que se muestre la información correspondiente.
 */
test.describe('Validaciones de Consulta de Instancias - Créditos Vehiculares', () => { test.setTimeout(60000);
    test('Debe buscar y seleccionar una instancia existente', async ({ menuFlow, consultaInstanciasFlow }) => {
        // 1. Navegación inicial
        await menuFlow.irAConsultaInstanciaAdministrador();
        
        // 2. Orquestación del flujo de negocio
        await consultaInstanciasFlow.filtrarYValidar();

    });
});