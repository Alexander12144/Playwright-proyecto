const { LoginPage } = require('../pages/LoginPage');

class AuthFlows {
    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
    }

    /**
     * Ejecuta login exitoso y retorna nueva ventana/contexto autenticado.
     * Precondición: Usuario debe estar en página de login.
     * @param {string} username - Usuario válido
     * @param {string} password - Contraseña válida
     * @throws {Error} Si credenciales son inválidas o timeout en carga
     * @returns {Promise<Page>} Página autenticada de home (Bantotal)
     */
    async loginSuccess(username, password) {
        await this.loginPage.navegar();
        return await this.loginPage.ejecutarLoginYCapturarVentana(username, password);
    }

    /**
     * Procesa intento de login esperando mensaje de error.
     * Soporta validación de campos vacíos y credenciales inválidas.
     * Precondición: Usuario debe estar en página de login.
     * @param {string} username - Usuario (puede ser vacío para validar)
     * @param {string} password - Contraseña (puede ser vacía para validar)
     * @param {string} [tipoError='credenciales'] - Tipo de error esperado
     * @throws {Error} Si mensaje de error no aparece
     * @returns {Promise<void>}
     */
    async loginConError(username, password, tipoError) {
        await this.loginPage.navegar();
        await this.loginPage.completarCredenciales(username, password);
        await this.loginPage.submitLogin();

        const usernameBlank = !username || username.toString().trim() === '';
        const passwordBlank = !password || password.toString().trim() === '';

        const escenarioAEsperar =
            usernameBlank && passwordBlank
                ? 'credenciales_vacias'
                : usernameBlank
                    ? 'usuario_vacio'
                    : passwordBlank
                        ? 'password_vacio'
                        : 'login_incorrecto';

        await this.loginPage.validarError(escenarioAEsperar);
    }

    /**
     * Intento de login con campos vacíos.
     * Valida que el sistema rechace credenciales faltantes.
     * @throws {Error} Si mensaje de error de campos vacíos no aparece
     * @returns {Promise<void>}
     */
    async loginSinCredenciales() {
        await this.loginConError('', '', 'credenciales_vacias');
    }
}

module.exports = { AuthFlows };