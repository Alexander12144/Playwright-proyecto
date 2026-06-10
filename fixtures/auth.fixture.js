const base = require('@playwright/test');
const { AuthFlows } = require('../flows/AuthFlows');
const { MenuFlow } = require('../flows/MenuFlow');
const { BandejaTareasFlow } = require('../flows/BandejaTareasFlow/BandejaTareasFlow');
const { OperacionesVehicularesFlow } = require('../flows/ConsultasBasicasFlow/OperacionesVehicularesFlow');

exports.test = base.test.extend({
    // Fixture para tests de Login (página limpia)
    authFlow: async ({ page }, use) => {
        await use(new AuthFlows(page));
    },

    // Fixture para tests de Proceso (página ya logueada)
    authenticatedPage: async ({ page }, use) => {
        const authFlow = new AuthFlows(page);
        const user = process.env.USER;
        const pass = process.env.PASSWORD;

        if (!user || !pass) throw new Error('Faltan credenciales en .env');

        // loginSuccess ya maneja la captura de la nueva ventana
        const mainPage = await authFlow.loginSuccess(user, pass);
        await use(mainPage);
    },

    // Fixture para el menú (inyectamos la página autenticada)
    menuFlow: async ({ authenticatedPage }, use) => {
        await use(new MenuFlow(authenticatedPage));
    },

    // Fixture para la bandeja (inyectamos la página autenticada)
    bandejaFlow: async ({ authenticatedPage }, use) => {
        await use(new BandejaTareasFlow(authenticatedPage));
    },

    // Fixture para Consulta de Operaciones Vehiculares (inyectamos la página autenticada)
    operacionesVehicularesFlow: async ({ authenticatedPage }, use) => {
        await use(new OperacionesVehicularesFlow(authenticatedPage));
    }
    
});

exports.expect = base.expect;