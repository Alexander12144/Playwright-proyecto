const { clickAndExpectVisible, expectVisible } = require('../utils/pageActions');

class NavigationMenu {
    constructor(page) {
        this.page = page;
        this.inicioMenu = page.getByText('Inicio');
        this.bandejaTareas = page.getByText('Bandeja de tareas');
        this.opcionEntradaTareas = page.getByText('Bandeja de Entrada de Tareas');
        this.menuCobranzaJudicial = page.getByText('Menú de Cobranzas Judicial');
    }

    async irABandejaInstancias() {
        await clickAndExpectVisible(this.inicioMenu, this.bandejaTareas);
        await clickAndExpectVisible(this.bandejaTareas, this.opcionEntradaTareas);
        await clickAndExpectVisible(this.opcionEntradaTareas, this.page.locator('iframe[id="1"]'));
    }
}

module.exports = { NavigationMenu };