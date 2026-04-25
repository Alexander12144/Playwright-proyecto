const { BasePage } = require('./BasePage');
const { NavigationMenu } = require('../components/NavigationMenu');

class HomePage extends BasePage {
    constructor(page) {
        super(page);
        // Composición: El menú es un componente independiente
        this.menu = new NavigationMenu(page);
    }

    // ========== DEFINICIÓN DE FRAMES (Dinámicos) ==========
    
    get frame1() { 
        return this.page.frameLocator('iframe[id="1"]'); 
    }

    get frameInterno() { 
        return this.frame1.frameLocator('iframe[name="process-1_step0"]'); 
    }

    // ========== ELEMENTOS NIVEL SUPERIOR (Main Page) ==========
    
    get logo() { return this.page.locator('#logo'); }
    get btnInicio() { return this.page.getByText('Inicio'); }
    get btnAccesos() { return this.page.getByText('Accesos'); }
    get btnAtras() { return this.page.getByRole('link', { name: 'Atrás' }); }
    get btnAdelante() { return this.page.getByRole('link', { name: 'Adelante' }); }
    get btnRecargar() { return this.page.getByRole('listitem').filter({ hasText: 'Recargar' }); }
    get btnImprimir() { return this.page.getByRole('listitem').filter({ hasText: 'Imprimir' }); }

    // ========== ELEMENTOS EN FRAME 1 ==========
    
    get linkActividadUsuario() { 
        return this.frame1.getByRole('link', { name: 'Actividad del usuario' }); 
    }

    // ========== ELEMENTOS EN IFRAME ANIDADO (Dashboard Info) ==========
    
    get txtUltimaActividad() { return this.frameInterno.getByText('Última actividad registrada'); }
    get cellUsuario() { return this.frameInterno.getByRole('cell', { name: 'Usuario', exact: true }); }
    get cellEmpresa() { return this.frameInterno.getByRole('cell', { name: 'Empresa', exact: true }); }
    get cellSucursal() { return this.frameInterno.getByRole('cell', { name: 'Sucursal', exact: true }); }
    get cellFechaSistema() { return this.frameInterno.getByRole('cell', { name: 'Fecha del Sistema', exact: true }); }
}

module.exports = { HomePage };