const { test } = require('@playwright/test');
const { AuthFlows } = require('../flows/AuthFlows');

test.describe('Módulo de Autenticación - Bantotal', () => {
    let authFlow;

    test.beforeEach(async ({ page }) => {
        authFlow = new AuthFlows(page);
    });

    test('Debe loguearse correctamente con credenciales válidas', async ({ page }) => {
        await authFlow.loginSuccess(
            process.env.USER,
            process.env.PASSWORD
        );
    });

    test('Debe rechazar el acceso con usuario inválido', async ({ page }) => {
        await authFlow.loginConError(
            'usuario_invalido',
            process.env.PASSWORD
        );
    });

    test('Debe rechazar el acceso con password inválido', async ({ page }) => {
        await authFlow.loginConError(
            process.env.USER,
            'password_invalido'
        );
    });

    test('Debe validar la obligatoriedad de las credenciales (campos vacíos)', async ({ page }) => {
        await authFlow.loginSinCredenciales();
    });

    test('Debe rechazar el acceso cuando falta el password', async ({ page }) => {
        await authFlow.loginConError(
            process.env.USER,
            ''
        );
    });

    test('Debe rechazar el acceso cuando falta el usuario', async ({ page }) => {
        await authFlow.loginConError(
            '',
            process.env.PASSWORD
        );
    });

    test('Debe rechazar el acceso con usuario y password solo espacios', async ({ page }) => {
        await authFlow.loginConError(
            '   ',
            '   '
        );
    });

});