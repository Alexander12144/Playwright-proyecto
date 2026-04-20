const { MenuActions } = require('../actions/MenuActions');
class MenuFlow {
    constructor(page) {
        this.menuActions = new MenuActions(page);
    }

    async seleccionarInicio() {
        await this.menuActions.waitForHomeReady();
        await this.menuActions.navigateToBandejaEntrada();
    }
}

module.exports = { MenuFlow };