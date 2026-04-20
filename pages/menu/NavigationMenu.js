/**
 * NavigationMenu - Componente de navegación
 */
class NavigationMenu {
    constructor(page) {
        // El menú principal está en la página principal después del login
        this.inicioMenu = page.getByText('Inicio');
        this.bandejaTareasMenu = page.getByText('Bandeja de Tareas');
        this.bandejaEntradaMenu = page.getByText('Bandeja de Entrada de Tareas');
        this.menuCobranzasJudicial = page.getByText('Menú de Cobranzas Judicial');
        this.menuInstalacionBantotal = page.getByText('Menú de Instalación de Bantotal');
        this.menuIngresoOperaciones = page.getByText('Menú de Ingreso de Operaciones');
        this.menuOperacionesSupervicion = page.getByText('Menú de Operaciones de Supervisión');
        this.menuConsultasBasicas = page.getByText('Menú de Consultas Básicas');
        this.menuReportes = page.getByText('Menú de Reportes');
        this.menuConsultas = page.getByText('Menú de Consultas', { exact: true });
        this.menuClientes = page.getByText('Menú de Clientes');
        this.menuContrapartes = page.getByText('Menú de Contrapartes');
        this.menuContabilidad = page.getByText('Menú de Contabilidad');
    }
}

module.exports = { NavigationMenu };