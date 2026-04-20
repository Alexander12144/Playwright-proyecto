const { BasePage } = require('./BasePage');

/**
 * LoginPage - Page Object
 * Toda la lógica va en AuthActions.js
 */
class LoginPage extends BasePage {
    constructor(page) {
        super(page);

        // --- SELECTORES DE LOGIN ---
        this.usernameInput = page.locator('#vUSER');
        this.passwordInput = page.locator('#vPASSWORD');
        this.loginButton = page.getByRole('link', { name: 'Iniciar Sesión' });

        // --- SELECTORES DE VALIDACIÓN ---
        this.invalidPasswordloginErrorMessage = page.locator('text=Invalid credentials/Credenciales inválidas');
        this.invalidPassword = page.getByText('Contraseña inválida, no puede');
        this.successMessage = page.getByText('Sesión iniciada');
    }
}

module.exports = { LoginPage };