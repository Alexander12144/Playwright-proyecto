const { test } = require('../fixtures/auth.fixture');

test.describe('Módulo de Autenticación - Bantotal', () => {
    test('Debe loguearse correctamente con credenciales válidas', async ({ authFlow }) => {
        await authFlow.loginSuccess(
            process.env.USER,
            process.env.PASSWORD
        );
    });

    test('Debe rechazar el acceso con usuario inválido', async ({ authFlow }) => {
        await authFlow.loginConError(
            'usuario_invalido',
            process.env.PASSWORD
        );
    });

    test('Debe rechazar el acceso con password inválido', async ({ authFlow }) => {
        await authFlow.loginConError(
            process.env.USER,
            'password_invalido'
        );
    });

    test('Debe validar la obligatoriedad de las credenciales (campos vacíos)', async ({ authFlow }) => {
        await authFlow.loginSinCredenciales();
    });

    test('Debe rechazar el acceso cuando falta el password', async ({ authFlow }) => {
        await authFlow.loginConError(
            process.env.USER,
            ''
        );
    });

    test('Debe rechazar el acceso cuando falta el usuario', async ({ authFlow }) => {
        await authFlow.loginConError(
            '',
            process.env.PASSWORD
        );
    });

    test('Debe rechazar el acceso con usuario y password solo espacios', async ({ authFlow }) => {
        await authFlow.loginConError(
            '   ',
            '   '
        );
    });
});
