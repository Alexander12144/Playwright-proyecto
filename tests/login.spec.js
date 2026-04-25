const { test } = require('@playwright/test');
const { AuthFlows } = require('../flows/AuthFlows');

test.describe('Módulo de Autenticación - Bantotal', () => {

    test('Debe loguearse correctamente con credenciales válidas', async ({ page }) => {
        const authFlow = new AuthFlows(page);

        await authFlow.loginSuccess(
            process.env.USER,
            process.env.PASSWORD
        );
    });

    test('Debe rechazar el acceso con usuario inválido', async ({ page }) => {
        const authFlow = new AuthFlows(page);

        await authFlow.loginConError(
            'usuario_invalido',
            process.env.PASSWORD
        );
    });

    test('Debe rechazar el acceso con password inválido', async ({ page }) => {
        const authFlow = new AuthFlows(page);

        await authFlow.loginConError(
            process.env.USER,
            'password_invalido'
        );
    });

    test('Debe validar la obligatoriedad de las credenciales (campos vacíos)', async ({ page }) => {
        const authFlow = new AuthFlows(page);

        await authFlow.loginSinCredenciales();
    });

    test('Debe rechazar el acceso cuando falta el password', async ({ page }) => {
        const authFlow = new AuthFlows(page);

        await authFlow.loginConError(
            process.env.USER,
            ''
        );
    });

});