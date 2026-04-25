/**
 * NavigationMenu - Componente de navegación reutilizable
 * Ubicación sugerida: ./components/NavigationMenu.js
 */
class NavigationMenu {
    constructor(page) {
        this.page = page;
    }

    // --- Niveles Principales ---
    get inicioMenu() { return this.page.getByText('Inicio'); }
    get bandejaTareasMenu() { return this.page.getByText('Bandeja de Tareas'); }
    get bandejaEntradaMenu() { return this.page.getByText('Bandeja de Entrada de Tareas'); }

    // --- Menús Específicos de Negocio ---
    get cobranzasJudicial() { return this.page.getByText('Menú de Cobranzas Judicial'); }
    get instalacionBantotal() { return this.page.getByText('Menú de Instalación de Bantotal'); }
    get ingresoOperaciones() { return this.page.getByText('Menú de Ingreso de Operaciones'); }
    get operacionesSupervicion() { return this.page.getByText('Menú de Operaciones de Supervisión'); }
    get consultasBasicas() { return this.page.getByText('Menú de Consultas Básicas'); }
    get reportes() { return this.page.getByText('Menú de Reportes'); }
    get consultas() { return this.page.getByText('Menú de Consultas', { exact: true }); }
    get clientes() { return this.page.getByText('Menú de Clientes'); }
    get contrapartes() { return this.page.getByText('Menú de Contrapartes'); }
    get contabilidad() { return this.page.getByText('Menú de Contabilidad'); }
}

module.exports = { NavigationMenu };