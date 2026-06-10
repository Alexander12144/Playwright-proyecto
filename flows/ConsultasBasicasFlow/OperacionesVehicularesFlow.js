const { TIMEOUTS } = require('../../utils/constants');
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

    async filtrarOperaciones({ cuenta, operacion, estado } = {}) {
        const tieneResultados = await this.operacionesVehicularesPage.filtrarOperaciones({ 
            cuenta, 
            operacion, 
            estado 
        });

        if (!tieneResultados) {
            return false;
        }

        // Si hay resultados, selecciona la fila encontrada automáticamente
        try {
            await this.operacionesVehicularesPage.seleccionarFila({ cuenta, operacion, estado });
        } catch (err) {
            // Captura evidencia si la selección falla
            await this._captureEvidenceOnError('filtrarOperaciones', err);
            throw err;
        }

        return true;
    }

    async seleccionarCuentaCliente(pais, tipoDocumento, cuenta) {
        try {
            // Abre el popup de búsqueda
            const popup = await this.operacionesVehicularesPage.buscarCuentaCliente();
            this.seleccionCliente = new SeleccionClientePage(popup);

            // Completa criterios de búsqueda
            await this.seleccionCliente.completarDatosBusqueda({ 
                pais, 
                tipoDocumento, 
                cuenta 
            });

            // Selecciona la fila encontrada
            const clienteSeleccionado = await this.seleccionCliente.seleccionarFila({ cuenta });

            if (!clienteSeleccionado) {
                throw new Error(`No se encontró cliente con cuenta: ${cuenta}`);
            }

            // Filtra operaciones de la cuenta seleccionada
            await this.filtrarOperaciones({ cuenta });
        } catch (err) {
            await this._captureEvidenceOnError('seleccionarCuentaCliente', err);
            throw err;
        }
    }

}

module.exports = { OperacionesVehicularesFlow };