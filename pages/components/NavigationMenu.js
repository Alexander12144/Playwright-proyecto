/**
 * Componente con los localizadores del menú principal de Bantotal.
 */
class NavigationMenu {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
    }

    get inicioMenu() { return this.page.getByText('Inicio'); }
    get bandejaTareasMenu() { return this.page.getByText('Bandeja de Tareas'); }
    get bandejaEntradaMenu() { return this.page.getByText('Bandeja de Entrada de Tareas'); }
    get consultaInstanciaAdministrador() { return this.page.getByText('Consulta de Instancias WF -Administrador'); }
    get consultasBasicasMenu() { return this.page.getByText('Menú de Consultas Básicas'); }
    get consultaOperacionesVehiculares() { return this.page.getByText('Consulta de Operaciones Vehiculares'); }
}

module.exports = { NavigationMenu };
