const { NavigationMenu } = require('../components/NavigationMenu');
const { BasePage } = require('./BasePage');

class HomePage extends BasePage {
    constructor(page) {
        super(page);

        // Niveles de Frames
        this.frame1 = page.frameLocator('iframe[id="1"]');
        this.frameInterno = this.frame1.frameLocator('iframe[name="process-1_step0"]');

        // Elementos en el nivel Superior (Main Page)
        this.btnInicio = page.getByText('Inicio');
        this.btnAccesos = page.getByText('Accesos');
        this.btnAtras = page.getByRole('link', { name: 'Atrás' });
        this.btnAdelante = page.getByRole('link', { name: 'Adelante' });
        this.btnRecargar = page.getByRole('listitem').filter({ hasText: 'Recargar' });
        this.btnImprimir = page.getByRole('listitem').filter({ hasText: 'Imprimir' });
        this.logo = page.locator('#logo');

        // Elementos en el Primer Iframe (id="1")
        this.linkActividadUsuario = this.frame1.getByRole('link', { name: 'Actividad del usuario' });

        // Elementos en el Segundo Iframe (Anidado)
        this.txtUltimaActividad = this.frameInterno.getByText('Última actividad registrada');
        this.cellUsuario = this.frameInterno.getByRole('cell', { name: 'Usuario', exact: true });
        this.cellEmpresa = this.frameInterno.getByRole('cell', { name: 'Empresa', exact: true });
        this.cellSucursal = this.frameInterno.getByRole('cell', { name: 'Sucursal', exact: true });
        this.cellFechaSistema = this.frameInterno.getByRole('cell', { name: 'Fecha del Sistema', exact: true });

        // Menu de navegacion
        this.menu = new NavigationMenu(page);
    }

    async validateFullUI() {
        await this.expectVisible(this.logo);
        await this.expectVisible(this.btnInicio);
        await this.expectVisible(this.btnAccesos);

        await this.expectVisible(this.btnAtras);
        await this.expectVisible(this.btnRecargar);

        await this.expectVisible(this.linkActividadUsuario, 15000);
        await this.expectVisible(this.txtUltimaActividad);

        await this.expectVisible(this.cellUsuario);
        await this.expectVisible(this.cellEmpresa);
        await this.expectVisible(this.cellSucursal);
        await this.expectVisible(this.cellFechaSistema);
    }
}

module.exports = { HomePage };