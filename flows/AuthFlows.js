const { AuthActions } = require('../actions/AuthActions');

class AuthFlows {
    constructor(page) {
        this.auth = new AuthActions(page);
    }

    /**
     * Flujo: login exitoso
     */
    async loginSuccess(username, password) {
        await this.auth.navigateToLogin();
        await this.auth.fillCredentials(username, password);
        
        return await this.auth.clickAndWaitNewPage(() =>
            this.auth.clickLoginButton()
        );
    }

    /**
     * Flujo: login fallido (credenciales incorrectas)
     */
    async loginFail(username, password) {
        await this.auth.navigateToLogin();
        await this.auth.fillCredentials(username, password);
        await this.auth.clickLoginButton();
    }

    /**
     * Flujo: login sin datos
     */
    async loginWithoutCredentials() {
        await this.auth.navigateToLogin();
        await this.auth.clickLoginButton();
    }

    /**
     * Flujo: login con datos inválidos
     */
    async loginWithInvalidData(username, password) {
        await this.auth.navigateToLogin();
        await this.auth.fillCredentials(username, password);
        await this.auth.clickLoginButton();
    }
}

module.exports = { AuthFlows };