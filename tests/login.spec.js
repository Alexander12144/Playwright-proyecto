const { test, expect } = require('@playwright/test');
const { AuthFlows } = require('../flows/AuthFlows');
const { AuthActions } = require('../actions/AuthActions');

test.describe('Login - Bantotal', () => {

    test('Debe loguearse correctamente con credenciales válidas', async ({ page }) => {
        const authFlow = new AuthFlows(page);

        await authFlow.loginSuccess(
            process.env.USER,
            process.env.PASSWORD
        );
    });

    test('Debe rechazar usuario inválido', async ({ page }) => {
        const authActions = new AuthActions(page);

        await authActions.loginErrorAndValidate(
            'usuario_invalido',
            process.env.PASSWORD
        );
    });

    test('Debe rechazar password inválido', async ({ page }) => {
        const authActions = new AuthActions(page);

        await authActions.loginErrorAndValidate(
            process.env.USER,
            'password_invalido'
        );
    });

    test('Debe rechazar credenciales vacías', async ({ page }) => {
        const authActions = new AuthActions(page);

        await authActions.loginErrorAndValidateNull('', '');
    });

    test('Debe rechazar username o password vacío', async ({ page }) => {
        const authActions = new AuthActions(page);

        await authActions.loginErrorAndValidateNull(
            process.env.USER,
            ''
        );
    });

});