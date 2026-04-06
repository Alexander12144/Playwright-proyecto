const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class IniciarProcesoPage extends BasePage {
    constructor(page) {
        super(page);

        // Mantenemos el ID="1" y actualizamos al Step 2
        this.framePadre = page.frameLocator('iframe[id="1"]');
        this.frameContenido = this.framePadre.frameLocator('iframe[name="process1_step2"]');

        // --- SELECTORES ---
        this.titulo = this.frameContenido.getByText('Iniciar Instancia de Proceso');
        
        // Campos de Texto
        this.inputAsunto = this.frameContenido.locator('#vASUNTO');
        this.inputComentario = this.frameContenido.locator('#vCOMENTARIO');

        // Botones de Acción
        this.btnIniciar = this.frameContenido.getByRole('link', { name: 'Iniciar' });
        this.btnCancelar = this.frameContenido.getByRole('link', { name: 'Cancelar' });
    }

    async validarCarga() {
        await this.expectVisible(this.titulo, 15000);
    }

    /**
     * @param {string} nombreFlujo - Ej: 'Flujo Vehicular / StartSolicitud'
     * @param {Object} datos - { asunto: '...', comentario: '...' }
     */
    async seleccionarFlujoEIniciar(nombreFlujo, datos = {}) {
        // 1. Seleccionamos el flujo (haciendo clic en el texto exacto)
        const flujoTarget = this.frameContenido.getByText(nombreFlujo, { exact: true });
        await flujoTarget.click();

        // 2. Llenamos los datos si vienen en el objeto
        if (datos.asunto) await this.inputAsunto.fill(datos.asunto);
        if (datos.comentario) await this.inputComentario.fill(datos.comentario);

        // 3. Clic en Iniciar
        await this.btnIniciar.click();
        
        // Sincronización de salida del Step 2
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Valida que todos los flujos esperados estén visibles en la lista.
     * Útil para Smoke Tests o validaciones de regresión de UI.
     */
    async validarPresenciaDeFlujos() {
        const flujosEsperados = [
            'Flujo Vehicular / StartCotizacion',
            'Flujo Vehicular / StartSolicitud',
            'Flujo Vehicular / StartBatch',
            'Flujo Refinanciación',
            'Flujo Reprogramación Regular'
        ];

        for (const nombreFlujo of flujosEsperados) {
            const locator = this.frameContenido.getByText(nombreFlujo);
            
            // Usamos un assertion de expect para que el test falle si uno no está
            await expect(locator).toBeVisible({ timeout: 5000 });
        }

        // Validar también los campos de entrada
        await expect(this.inputAsunto).toBeVisible();
        await expect(this.inputComentario).toBeVisible();
        await expect(this.btnIniciar).toBeVisible();
    }
}

module.exports = { IniciarProcesoPage };