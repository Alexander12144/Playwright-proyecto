const { MenuActions } = require('../actions/MenuActions');

class MenuFlow {
    constructor(page) {
        this.page = page;
        this.actions = new MenuActions(page);
    }

    /**
     * Orquesta la entrada inicial al sistema y navegación a la Bandeja de Tareas.
     */
    async irABandejaDeEntrada() {
        await this.actions.waitForHomeReady();
        await this.actions.navigateToBandejaEntrada();
    }
}

module.exports = { MenuFlow };