const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class BandejaInstanciasPage extends BasePage {
    constructor(page) {
        super(page);

        // Jerarquía de Frames (Ruta confirmada)
        this.framePadre = page.frameLocator('iframe[id="1"]');
        this.frameBandeja = this.framePadre.frameLocator('iframe[name="process1_step1"]');

        // --- SELECTORES ---
        this.tituloBandeja = this.frameBandeja.getByText('Bandeja de Entrada de Tareas');
        
        // Localizadores de los Combos (IDs de Bantotal)
        this.comboVista = this.frameBandeja.locator('#vVISTA');
        this.comboRoles = this.frameBandeja.locator('#vWFROLCODFLT');
        this.comboOrden = this.frameBandeja.locator('#vORDER'); // Ajustar si el ID cambia
        
        // Otros Filtros
        this.inputInstancia = this.frameBandeja.locator('#vBINST');
        this.inputComentario = this.frameBandeja.locator('#vBCOM');
        this.btnFiltrar = this.frameBandeja.getByRole('link', { name: 'Filtrar' });

        //Botones de pagina
        this.btnConsultar = this.frameBandeja.getByRole('link', { name: 'Consultar' });
        this.btnDelegar = this.frameBandeja.getByRole('link', { name: 'Delegar' });
        this.btnLiberar = this.frameBandeja.getByRole('link', { name: 'Liberar' });
        this.btnEjecutar = this.frameBandeja.getByRole('link', { name: 'Ejecutar' });
        this.btnDatosIng = this.frameBandeja.getByRole('link', { name: 'Datos.Ing' });
        this.btnDocumentos = this.frameBandeja.getByRole('link', { name: 'Documentos' });
        this.btnImpresos = this.frameBandeja.getByRole('link', { name: 'Impresos' });
        this.btnAutDisponibles = this.frameBandeja.getByRole('link', { name: 'Aut. Disponibles' });
        this.btnIniciarProceso = this.frameBandeja.getByRole('link', { name: 'Iniciar Proceso' });
        
        // Selectores de Navegación
        this.btnAnterior = this.frameBandeja.getByText('<< Anterior');
        this.btnSiguiente = this.frameBandeja.getByText('Siguiente >>');
        this.btnPagSig = this.framePadre.frameLocator('iframe[name="process1_step2"]').getByText('Iniciar Instancia de Proceso');
    }

    /**
     * Método privado para manejar cualquier desplegable de la bandeja
     */
    async _seleccionarDeLista(locatorCombo, valor) {
        if (!valor) return;
        
        // 1. Intentamos la vía rápida y estándar primero (selectOption)
        // El log mostró <option value="11">, así que esto suele ser lo más estable
        try {
            await locatorCombo.selectOption({ label: valor }, { timeout: 2000 });
        } catch (e) {
            await locatorCombo.click();
            
            const opcion = this.frameBandeja
                .getByRole('option', { name: valor, exact: true })
                .or(this.frameBandeja.getByText(valor, { exact: true }));

            await opcion.waitFor({ state: 'attached', timeout: 5000 });
            
            // Forzamos el clic aunque Playwright piense que está oculto
            await opcion.click({ force: true });
        }
    }

    async validarCargaCompleta() {
        await this.expectVisible(this.tituloBandeja, 20000);
        await this.expectVisible(this.btnFiltrar, 10000);
    }

    /**
     * Método Maestro de Búsqueda
     * @param {Object} filtros - { nroInstancia, vista, rol, comentario, orden }
     */
    async buscarInstancia(filtros = {}) {
        const { nroInstancia, vista, rol, comentario, orden } = filtros;

        // Inputs de texto
        if (nroInstancia) await this.inputInstancia.fill(nroInstancia.toString());
        if (comentario) await this.inputComentario.fill(comentario);

        // Desplegables usando la lógica dinámica
        await this._seleccionarDeLista(this.comboVista, vista);
        await this._seleccionarDeLista(this.comboRoles, rol);
        await this._seleccionarDeLista(this.comboOrden, orden);

        // Ejecutar y Sincronizar
        await this.btnFiltrar.click();
        await this.page.waitForLoadState('networkidle');
    }

    async ingresarInicioProceso () {
        await this.expectVisible(this.btnIniciarProceso, 30000);

        await this.btnIniciarProceso.click();
        await this.page.waitForLoadState('networkidle');

        await this.expectVisible(this.btnPagSig, 30000);
    }
}

module.exports = { BandejaInstanciasPage };