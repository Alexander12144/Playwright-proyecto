const { AuthActions } = require('../actions/AuthActions');

class AuthFlows {
    constructor(page) {
        this.page = page;
        this.actions = new AuthActions(page);
    }

    /**
     * @returns {Promise<Page>} - Retorna la nueva ventana/página autenticada.
     */
    async loginSuccess(username, password) {
        return await this.actions.loginSuccess(username, password);
    }

    /**
     * Procesa un intento de login esperando un mensaje de error.
     */
    async loginConError(username, password) {
        await this.actions.loginErrorAndValidate(username, password);
    }

    /**
     * Intento de login con campos vacíos.
     */
    async loginSinCredenciales() {
        await this.actions.loginErrorAndValidate('', '');
    }
}

module.exports = { AuthFlows };