const { NavigationMenu } = require('./menu/NavigationMenu');
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

        // Titulo de frame
        this.linkActividadUsuario = this.frame1.getByRole('link', { name: 'Actividad del usuario' });

        // Elementos en el Iframe (Anidado)
        this.txtUltimaActividad = this.frameInterno.getByText('Última actividad registrada');
        this.cellUsuario = this.frameInterno.getByRole('cell', { name: 'Usuario', exact: true });
        this.cellEmpresa = this.frameInterno.getByRole('cell', { name: 'Empresa', exact: true });
        this.cellSucursal = this.frameInterno.getByRole('cell', { name: 'Sucursal', exact: true });
        this.cellFechaSistema = this.frameInterno.getByRole('cell', { name: 'Fecha del Sistema', exact: true });

        // Menu de navegación (ahora usa frames correctos)
        this.menu = new NavigationMenu(page);
    }
}

module.exports = { HomePage };