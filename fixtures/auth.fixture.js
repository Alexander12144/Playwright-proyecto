const base = require('@playwright/test');
const { AuthFlows } = require('../flows/AuthFlows');

/**
 * Fixture personalizada para manejar la sesión autenticada.
 * Reutiliza el flujo de login para entregar una página lista para operar.
 */
exports.test = base.test.extend({
    authenticatedPage: async ({ page }, use) => {
        const authFlow = new AuthFlows(page);

        // Validación de variables de entorno
        const user = process.env.USER;
        const pass = process.env.PASSWORD;

        if (!user || !pass) {
            throw new Error('Credenciales no encontradas: USER o PASSWORD en .env');
        }

        const mainPage = await authFlow.loginSuccess(user, pass);

        // Proporciona la página autenticada al test
        await use(mainPage);
    }
});

exports.expect = base.expect;