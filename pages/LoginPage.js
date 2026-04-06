const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
    constructor(page) {
        super(page);

        this.usernameInput = page.locator('#vUSER');
        this.passwordInput = page.locator('#vPASSWORD');
        this.loginButton = page.getByRole('link', {name: 'Iniciar Sesión'});
        this.loginErrorMessage = page.locator('text=Invalid credentials/Credenciales inválidas');
        this.invalidPassword = page.getByText('Contraseña inválida, no puede');
        this.message = page.getByText("Sesión iniciada");
    }

    async navigate() {
        await this.goto('/mafgx16/servlet/com.dlya.bantotal.hlogin');
    }

    async fillCredentials(username, password) {
        await this.fill(this.usernameInput, username);
        await this.fill(this.passwordInput, password);
    }

    async submit() {
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.loginButton.click()
        ]);

        await newPage.waitForLoadState('domcontentloaded');

        return newPage;
    }

    async login(username, password) {
        await this.fillCredentials(username, password);
        return await this.submit();
    }
   

    async loginError (username, password) {
        await this.fillCredentials(username, password);
        await this.loginButton.click();
    }
}

module.exports = {
    LoginPage
};