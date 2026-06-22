class NavigationMenu {
    constructor(page) {
        this.page = page;
    }

    /**
     * Localizadores para el menú de navegación.
     */

    get inicioMenu() { return this.page.getByText('Inicio'); }
    get bandejaTareasMenu() { return this.page.getByText('Bandeja de Tareas'); }
    get bandejaEntradaMenu() { return this.page.getByText('Bandeja de Entrada de Tareas'); }
    get consultaInstanciaAdministrador() { return this.page.getByText('Consulta de Instancias WF -Administrador'); }
    get consultasBasicasMenu() { return this.page.getByText('Menú de Consultas Básicas'); }

    get cobranzasJudicial() { return this.page.getByText('Menú de Cobranzas Judicial'); }
    get instalacionBantotal() { return this.page.getByText('Menú de Instalación de Bantotal'); }
    get ingresoOperaciones() { return this.page.getByText('Menú de Ingreso de Operaciones'); }
    get operacionesSupervicion() { return this.page.getByText('Menú de Operaciones de Supervisión'); }
    get consultaOperacionesVehiculares() { return this.page.getByText('Consulta de Operaciones Vehiculares'); }
    get reportes() { return this.page.getByText('Menú de Reportes'); }
    get consultas() { return this.page.getByText('Menú de Consultas', { exact: true }); }
    get clientes() { return this.page.getByText('Menú de Clientes'); }
    get contrapartes() { return this.page.getByText('Menú de Contrapartes'); }
    get contabilidad() { return this.page.getByText('Menú de Contabilidad'); }
}

module.exports = { NavigationMenu };