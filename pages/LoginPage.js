const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');
const { TIMEOUTS, URLS } = require('../utils/constants');

class LoginPage extends BasePage {
    constructor(page) {
        super(page);
        this.url = URLS.LOGIN;
    }

    /**
     * Localizadores para la página de login.
     */
    get usernameInput() { return this.page.locator('#vUSER'); }
    get passwordInput() { return this.page.locator('#vPASSWORD'); }
    get loginButton() { return this.page.getByRole('link', { name: 'Iniciar Sesión' }); }
    get errorCredenciales() { return this.page.locator('text=Invalid credentials/Credenciales inválidas'); }
    get errorPasswordNulo() { return this.page.getByText('Contraseña inválida, no puede ser nula'); }

    /**
     * Navega a la página de login.
     * @throws {Error} Si navegación falla
     * @returns {Promise<void>}
     */
    async navegar() {
        await this.page.goto(URLS.LOGIN);
    }

    /**
     * Completa los campos de credenciales.
     * @param {string} user - Nombre de usuario
     * @param {string} pass - Contraseña
     * @throws {Error} Si alguno de los campos no es accesible
     * @returns {Promise<void>}
     */
    async completarCredenciales(user, pass) {
        await this.fill(() => this.usernameInput, user ?? '');
        await this.fill(() => this.passwordInput, pass ?? '');
    }

    /**
     * Hace clic en botón de login y espera validación.
     * @throws {Error} Si botón no es clickeable
     * @returns {Promise<void>}
     */
    async submitLogin() {
        await this.click(() => this.loginButton, this.page);
    }

    /**
     * Ejecuta login y captura nueva ventana de contexto autenticado.
     * Maneja el flujo popup/nueva ventana de Bantotal.
     * @param {string} user - Usuario válido
     * @param {string} pass - Contraseña válida
     * @throws {Error} Si popup no aparece o navegación a home falla
     * @returns {Promise<Page>} Página autenticada
     */
    async ejecutarLoginYCapturarVentana(user, pass) {
        await this.completarCredenciales(user, pass);

        const pagePromise = this.page.context().waitForEvent('page');
        await this.submitLogin();
        const newPage = await pagePromise;

        await newPage.waitForURL(/.*realIndex\.html.*/, { timeout: TIMEOUTS.LONG });
        return newPage;
    }

    /**
     * Valida la presencia de mensajes de error específicos
     * @param {string} tipo - 'credenciales' o 'password_vacio'
     */
    async validarError(escenario) {
        const locators = {
            'login_incorrecto': this.errorCredenciales,
            'password_vacio': this.errorPasswordNulo,
            'usuario_vacio': this.errorCredenciales,
            'credenciales_vacias': this.errorPasswordNulo
        };

        const mensajeAValidar = locators[escenario];

        if (!mensajeAValidar) {
            throw new Error(`El escenario de error "${escenario}" no está mapeado en locators.`);
        }
        await expect(mensajeAValidar).toBeVisible({ timeout: TIMEOUTS.LONG });
    }
}

module.exports = { LoginPage };