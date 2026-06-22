const { OperacionesVehicularesPage } = require('../../pages/ConsultasBasicasPages/OperacionesVehicularesPage');
const { SeleccionClientePage } = require('../../pages/ConsultasBasicasPages/SeleccionClientePage');

class OperacionesVehicularesFlow {
    constructor(page) {
        this.page = page;
        this.operacionesVehicularesPage = new OperacionesVehicularesPage(page);
        this.seleccionCliente = null;
    }

    async validarUICompleta() {
        await this.operacionesVehicularesPage.validarUICompleta();
    }

    // Filtra directamente en la pantalla de operaciones vehiculares, sin pasar por el popup de selección de cliente
    async filtrarOperaciones({ cuenta, operacion, estado } = {}) {
        console.log(`[Flow] Filtrando operación: Cuenta=${cuenta}`);
        await this.operacionesVehicularesPage.esperarCarga();
        
        const tieneResultados = await this.operacionesVehicularesPage.filtrarOperaciones({ cuenta, operacion, estado });

        if (tieneResultados) {
            await this.operacionesVehicularesPage.seleccionarFila({ cuenta, operacion, estado });
        }

        return tieneResultados;
    }

    /**
     * Busca y selecciona un cliente desde el popup de búsqueda.
     *
     * Flujo:
     * 1. Abre el popup de selección de clientes.
     * 2. Ejecuta la búsqueda utilizando los criterios recibidos.
     * 3. Selecciona el cliente encontrado.
     * 4. Recupera la cuenta reflejada en la pantalla principal.
     * 5. Selecciona el registro correspondiente en la grilla principal.
     */
    async seleccionarCuentaCliente(pais, tipoDocumento, cuenta) {
        console.log(`[Flow] Iniciando búsqueda de cliente: ${cuenta}`);

        const popup = await this.operacionesVehicularesPage.buscarCuentaCliente();

        this.seleccionCliente = new SeleccionClientePage(popup);

        const exitoSeleccion =
            await this.seleccionCliente.buscarYSeleccionarCliente({
                pais,
                tipoDocumento,
                cuenta
            });

        if (!exitoSeleccion) {
            return false;
        }

        await this.page.waitForTimeout(1000);

        // La búsqueda puede realizarse por nombre u otros criterios.
        // Se obtiene la cuenta resultante para identificar de forma única
        // el registro que debe seleccionarse en la pantalla principal.
        const nroCuenta =
            await this.operacionesVehicularesPage.obtenerCuenta();

        await this.operacionesVehicularesPage.seleccionarFila({
            cuenta: nroCuenta
        });

        return true;
    }
}

module.exports = { OperacionesVehicularesFlow };