/**
 * Componente reutilizable con los botones de navegación comunes en pantallas WF de Bantotal.
 */
class BantotalNavigator {
    /**
     * @param {import('@playwright/test').FrameLocator} frame - Frame donde se encuentran los botones.
     */
    constructor(frame) {
        this.frame = frame;
    }

    get btnSiguiente() { return this.frame.getByRole('link', { name: 'Siguiente' }); }
    get btnAnterior() { return this.frame.getByRole('link', { name: 'Anterior' }); }
    get btnEjecutar() { return this.frame.getByRole('link', { name: 'Ejecutar' }); }
    get btnFiltrar() { return this.frame.getByRole('link', { name: 'Filtrar' }); }
    get btnIniciar() { return this.frame.getByRole('link', { name: 'Iniciar' }); }
    get btnCancelar() { return this.frame.getByRole('link', { name: 'Cancelar' }); }
}

module.exports = { BantotalNavigator };
