const { expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { URLS, TIMEOUTS } = require('../utils/constants');

class AuthActions {
    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
    }

    // ========== NAVEGACIÓN ==========
    async navigateToLogin() {
        await this.loginPage.goto(URLS.LOGIN);
    }

    // ========== ACCIONES ==========
    async fillCredentials(username, password) {
        if (username) {
            await this.loginPage.fill(this.loginPage.usernameInput, username);
        }
        if (password) {
            await this.loginPage.fill(this.loginPage.passwordInput, password);
        }
    }

    async clickLoginButton() {
        await this.loginPage.click(this.loginPage.loginButton);
    }

    async clickAndWaitNewPage(action) {
        const pagePromise = this.page.context().waitForEvent('page');
        
        await action(); 
        const newPage = await pagePromise;

        // Esperamos a que la URL cambie a la de Bantotal (hwelcome o similar)
        await newPage.waitForURL(/.*realIndex\.html.*/, { timeout: 30000 });
        await newPage.waitForLoadState('domcontentloaded');

        return newPage;
    }

    async loginErrorAndValidate(username, password) {
        await this.navigateToLogin();
        await this.fillCredentials(username, password);
        
        await this.clickLoginButton();

        await expect(this.loginPage.loginErrorMessage).toBeVisible({ 
            timeout: TIMEOUTS.DEFAULT 
        });
    }

    async loginErrorAndValidateNull(username, password) {
        await this.navigateToLogin();
        await this.fillCredentials(username, password);
        
        await this.clickLoginButton();

        await expect(this.loginPage.invalidPassword).toBeVisible({ 
            timeout: TIMEOUTS.DEFAULT 
        });
    }
}

module.exports = { AuthActions };