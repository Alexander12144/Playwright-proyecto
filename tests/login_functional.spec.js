const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { HomePage } = require('../pages/HomePage');
const { NavigationMenu } = require('../components/NavigationMenu');
const { BandejaInstanciasPage } = require('../pages/BandejaTareasPage');
const { IniciarProcesoPage } = require('../pages/InstanciaProcesoPage');

test.describe('Inicio de sesión - Bantotal', () => {
    let loginPage;

    test.beforeEach(async ({
        page
    }) => {
        // Configuramos un timeout generoso para todos los tests del bloque
        test.setTimeout(120000);
        loginPage = new LoginPage(page);
        await loginPage.navigate();
    });

    test('Debe loguearse exitosamente y validar la UI en el dashboard', async () => {
        // El POM maneja la complejidad de la nueva pestaña internamente
        const newPage = await loginPage.login(process.env.USER,
            process.env.PASSWORD);
        await newPage.setViewportSize({
            width: 1366,
            height: 1080
        });
        await expect(newPage).toHaveURL(/realIndex.html/);

        // Inyectamos la nueva pestaña directamente al HomePage
        const homePage = new HomePage(newPage);
        await homePage.validateFullUI();
        await homePage.menu.irABandejaInstancias();

        const bandeja = new BandejaInstanciasPage(newPage);
        await bandeja.validarCargaCompleta();
        /*await bandeja.buscarInstancia({ rol: 'MAF Operaciones', nroInstancia: 798569 });*/
        await bandeja.ingresarInicioProceso();

        const iniciarProceso = new IniciarProcesoPage(newPage);
        await iniciarProceso.validarPresenciaDeFlujos();

    });

    // 2. Agrupamos casos negativos para mayor claridad
    test.describe('Validaciones de error', () => {

        test('Debe mostrar error al usar usuario/contraseña incorrecta', async () => {
            await loginPage.loginError('hdr_aaguilAr', '123456');
            await expect(loginPage.loginErrorMessage).toBeVisible();
        });

        test('Debe mostrar error al usar formato de usuario inválido', async () => {
            await loginPage.loginError('HDR_AAGUILAR¿', '01234560212121212121221');
            await expect(loginPage.loginErrorMessage).toBeVisible();
        });

        test('Debe mostrar validación cuando la contraseña está vacía', async () => {
            await loginPage.loginError('HDR_AAAAA', '');
            await expect(loginPage.invalidPassword).toBeVisible();
        });
    });
});