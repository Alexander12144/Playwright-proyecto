const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
    constructor(page) {
        super(page);
    }

    // --- Inputs de Credenciales ---
    get usernameInput() { return this.page.locator('#vUSER'); }
    get passwordInput() { return this.page.locator('#vPASSWORD'); }
    
    // --- Botones ---
    get loginButton() { return this.page.getByRole('link', { name: 'Iniciar Sesión' }); }

    // --- Mensajes de Validación ---
    get invalidPasswordloginErrorMessage() { 
        return this.page.locator('text=Invalid credentials/Credenciales inválidas'); 
    }
    
    get invalidPassword() { 
        return this.page.getByText('Contraseña inválida, no puede'); 
    }
    
    get successMessage() { 
        return this.page.getByText('Sesión iniciada'); 
    }
}

module.exports = { LoginPage };