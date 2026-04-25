const { expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { URLS, TIMEOUTS } = require('../utils/constants');

class AuthActions {
    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
    }

    async navigateToLogin() {
        await this.page.goto(URLS.LOGIN);
    }

    async fillCredentials(username, password) {
        if (username) await this.loginPage.usernameInput.fill(username);
        if (password) await this.loginPage.passwordInput.fill(password);
    }

    /**
     * Maneja la apertura de la nueva ventana tras el login.
     * @param {Function} action - Acción que desencadena la apertura (click en login)
     * @returns {Promise<Page>} - La instancia de la nueva página/ventana
     */
    async clickAndWaitNewPage(action) {
        const pagePromise = this.page.context().waitForEvent('page');
        
        await action(); 
        const newPage = await pagePromise;

        // Espera de estabilidad en la nueva ventana
        await newPage.waitForURL(/.*realIndex\.html.*/, { timeout: TIMEOUTS.LONG });
        await newPage.waitForLoadState('domcontentloaded');

        return newPage;
    }

    async loginSuccess(username, password) {
        await this.navigateToLogin();
        await this.fillCredentials(username, password);
        
        // Retornamos la nueva página que se abre tras el éxito
        return await this.clickAndWaitNewPage(() => this.loginPage.loginButton.click());
    }

    async loginErrorAndValidate(username, password) {
        await this.navigateToLogin();
        await this.fillCredentials(username, password);
        await this.loginPage.loginButton.click();

        await expect(this.loginPage.invalidPasswordloginErrorMessage).toBeVisible({ 
            timeout: TIMEOUTS.MEDIUM 
        });
    }
}

module.exports = { AuthActions };