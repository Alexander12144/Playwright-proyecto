const { expect } = require('@playwright/test');
const { BasePage } = require('../BasePage');
const { TIMEOUTS } = require('../../utils/constants');
const { BantotalNavigator } = require('../components/BantotalNavigator');
const { SeleccionClientePage } = require('./SeleccionClientePage');

class OperacionesVehicularesPage extends BasePage {
    constructor(page) {
        super(page);
        this._frameSelector = 'iframe[name="process1_step1"]';
        this._activeBaseFrame = null;
        this.nav = new BantotalNavigator(this.baseFrame);
        // Eliminamos la instanciación de SeleccionClientePage de aquí, 
        // ya que el popup usa un objeto 'page' (ventana) distinto.
    }
    // -------------------- Frame helpers --------------------

    get frameSelector() {
        return this._frameSelector;
    }

    get baseFrame() {
        return this._activeBaseFrame || this.mainFrame.frameLocator(this.frameSelector).last();
    }

    async _ensurePageLoad() {
        const timeout = TIMEOUTS.MEDIUM;
        const candidateFrames = this.page.frames().filter(frame => /process.*_step/i.test(frame.name()));

        for (const candidate of candidateFrames) {
            try {
                await this.waitForFrameStable(() => candidate);
                const header = candidate.locator('text=Consulta de Operaciones Vehiculares').first();
                await expect(header).toBeVisible({ timeout });
                this._activeBaseFrame = candidate;
                return;
            } catch {
            }
        }

        throw new Error('No se pudo detectar el frame activo de Operaciones Vehiculares');
    }

    // -------------------- Locators --------------------

    get labelEncabezado() { return this.baseFrame.getByText('Consulta de Operaciones Vehiculares'); }
    get labelTitulo() { return this.baseFrame.getByText('Operaciones', { exact: true }); }
    get labelCuenta() { return this.baseFrame.getByRole('cell', { name: 'Cuenta Cliente', exact: true }); }
    get valorCuenta() { return this.baseFrame.locator('#vCUENTAFIL'); }
    get labelOperacion() { return this.baseFrame.getByRole('cell', { name: 'Operación', exact: true }); }
    get valorOperacion() { return this.baseFrame.locator('#vOPERACIONFIL'); }
    get labelEstado() { return this.baseFrame.getByRole('cell', { name: 'Estado', exact: true }); }
    get valorEstado() { return this.baseFrame.locator('#vESTADOFIL'); }
    get btnFiltrar() { return this.baseFrame.getByRole('link', { name: 'Filtrar' }); }
    get btnSeleccionar() { return this.baseFrame.getByRole('link', { name: 'Seleccionar' }); }

    get labelAlerta() { return this.baseFrame.getByText('No hay ninguna fila seleccionada.'); }
    get labelSinResultados() { return this.baseFrame.getByText('No hay registros'); }
    get btnCuentaCliente() {return this.baseFrame.getByRole('row', { name: '0', exact: true }).getByRole('link');}
    
    /**
     * Aplica filtros combinados para cuenta, operación y/o estado.
     */
    async filtrarOperaciones({ cuenta, operacion, estado } = {}) {
        if (cuenta != null) {
            await this.completarCampo(this.valorCuenta, cuenta);
        }

        if (operacion != null) {
            await this.completarCampo(this.valorOperacion, operacion);
        }

        if (estado != null) {
            await this.completarCampo(this.valorEstado, estado);
        }

        return await this.filtrar();
    }

    /**
     * Filtra y selecciona una operación. Lanza error si no hay resultados.
     */
    async buscarYSeleccionarOperacion(filtros) {
        const tieneResultados = await this.filtrarOperaciones(filtros);
        if (!tieneResultados) {
            throw new Error(`La búsqueda no retornó resultados para: ${JSON.stringify(filtros)}`);
        }
        await this.seleccionarFila(filtros);
    }

    /**
     * Selecciona la fila que coincide con los filtros aplicados.
     */
    async seleccionarFila({ cuenta, operacion, estado }) {
        let fila = this.baseFrame.locator('[id^="GridopervehiContainerRow_"]');

        if (cuenta) {
            fila = fila.filter({
                has: this.baseFrame.getByRole('cell', {
                    name: cuenta.toString()
                })
            });
        }

        if (operacion) {
            fila = fila.filter({
                has: this.baseFrame.getByRole('cell', {
                    name: operacion.toString()
                })
            });
        }

        if (estado) {
            fila = fila.filter({
                has: this.baseFrame.getByRole('cell', {
                    name: estado.toString()
                })
            });
        }

        const count = await fila.count();

        if (count === 0) {
            throw new Error(
                `Error Técnico: Se esperaba encontrar la fila pero no está presente en el DOM.`
            );
        }

        if (count > 1) {
            throw new Error(
                `Se encontraron ${count} filas para cuenta=${cuenta}, operacion=${operacion}, estado=${estado}`
            );
        }

        await fila.first().click();

        // Seleccionar la fila encontrada
        await this.seleccionar();

        await this.esperarCarga();
    }

    /**
     * Verifica que los elementos principales de la pantalla estén visibles.
     */
    async validarUICompleta() {
        const timeout = { timeout: TIMEOUTS.MEDIUM };

        await this.esperarCarga();

        await expect(this.labelEncabezado).toBeVisible(timeout);
        await expect(this.labelTitulo).toBeVisible(timeout);
        await expect(this.labelCuenta).toBeVisible(timeout);
        await expect(this.valorCuenta).toBeVisible(timeout);
        await expect(this.labelOperacion).toBeVisible(timeout);
        await expect(this.valorOperacion).toBeVisible(timeout);
        await expect(this.labelEstado).toBeVisible(timeout);
        await expect(this.valorEstado).toBeVisible(timeout);
        await expect(this.btnFiltrar).toBeVisible(timeout);
    }

    /**
     * Verifica que se muestre el mensaje de "No hay registros" cuando no se encuentran resultados.
     */
    async validarSinResultados() {
        const timeout = { timeout: TIMEOUTS.MEDIUM };
        await expect(this.labelSinResultados).toBeVisible(timeout);
    }

    /**
     * Ejecuta el botón de filtrar y espera la recarga del frame.
     */
    async filtrar() {
        await this.click(this.btnFiltrar);
        await this.esperarCarga();

        return !(await this.labelSinResultados.isVisible().catch(() => false));
    }

    /**
     * Método auxiliar que delega a seleccionarFila.
     */
    async seleccionar() {
        await this.btnSeleccionar.click();
    }

    async filtrarOperacion(operacion) {
        await this.completarCampo(this.valorOperacion, operacion);
        return await this.filtrar();
    }

    async filtrarCuenta(cuenta) {
        await this.completarCampo(this.valorCuenta, cuenta);
        return await this.filtrar();
    }

    async filtrarEstado(estado) {
        await this.completarCampo(this.valorEstado, estado);
        return await this.filtrar();
    }

    /**
     * Dispara la apertura del popup de búsqueda.
     * @returns {Promise<Page>} La instancia de la nueva ventana.
     */
    async buscarCuentaCliente() {
        const [popup] = await Promise.all([
            this.page.waitForEvent('popup'),
            this.click(this.btnCuentaCliente, this.baseFrame)
        ]);
        
        await popup.waitForLoadState('networkidle');
        return popup;
    }

    async obtenerCuenta() {
        return await this.valorCuenta.inputValue();
    }
}

module.exports = { OperacionesVehicularesPage };