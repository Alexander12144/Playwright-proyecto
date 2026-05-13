const { expect } = require('@playwright/test');
const { TIMEOUTS, URLS, FRAMES } = require('../utils/constants');

/**
 * Clase base para todas las Page Objects.
 * Proporciona funcionalidades comunes: navegación, interacción con elementos,
 * manejo de frames y esperas con reintentos automáticos.
 */
class BasePage {
    constructor(page) {
        this.page = page;
        this.url = URLS.BASE;
        
    }

    /**
     * Getter centralizado para el frame principal de Bantotal (MAIN).
     * @returns {FrameLocator} Localizador del frame principal
     */
    get mainFrame() {
        return this.page.frameLocator(FRAMES.MAIN);
    }

    /**
     * Ejecuta una acción sobre un elemento con reintentos automáticos.
     * Maneja errores de frame stale y contextos destruidos.
     * @private
     * @param {Function|Locator} locator - Localizador o función que retorna localizador
     * @param {Function|Frame|Page} context - Contexto donde ejecutar acción
     * @param {Function} callback - Función que ejecuta la acción
     * @param {Object} [options] - Opciones de reintento
     * @param {number} [options.retries=3] - Número de reintentos
     * @param {number} [options.retryDelayMs=500] - Delay entre reintentos
     * @throws {Error} Si la acción falla después de todos los reintentos
     * @returns {Promise<void>}
     */
    async _executeAction(locator, context, callback, options = {}) {
        const retries = options.retries ?? 3;
        const retryDelayMs = options.retryDelayMs ?? 500;
        let lastError;

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                // Re-resolver en cada intento evita locators/frames stale tras refresh.
                const frame = typeof context === 'function' ? context() : context;
                const target = typeof locator === 'function' ? locator() : locator;
                await target.waitFor({ state: 'visible', timeout: TIMEOUTS.VERY_LONG });
                await callback(target, frame);
                return;
            } catch (error) {
                lastError = error;
                const msg = (error && error.message ? error.message : '').toLowerCase();
                const isFrameRefreshIssue =
                    msg.includes('target page, context or browser has been closed') ||
                    msg.includes('execution context was destroyed') ||
                    msg.includes('frame was detached');

                if (!isFrameRefreshIssue || attempt === retries) {
                    throw error;
                }

                try {
                    const screenshotPath = `./tmp/retry-${Date.now()}-${attempt}.png`;
                    await this.page.screenshot({ path: screenshotPath, fullPage: false });
                } catch (screenshotError) {
                    // Continuar si no se puede guardar screenshot
                }

                await this.page.waitForTimeout(retryDelayMs);
            }
        }

        throw lastError;
    }

    /**
     * Navega a una URL y espera carga completa de página.
     * @param {string} path - Ruta o URL completa
     * @param {Object} [options] - Opciones de navegación de Playwright
     * @throws {Error} Si navegación falla
     * @returns {Promise<void>}
     */
    async goto(path, options = {}) {
        await this.page.goto(path, options);
        await this.page.waitForLoadState('load');
    }

    /**
     * Espera a que la página esté completamente cargada.
     * Las páginas pueden personalizar su criterio de carga mediante:
     *  - _ensurePageLoad()
     *  - getPageLoadFrames()
     *  - getPageLoadFrame()
     *  - getPageLoadLocators(frame)
     * @returns {Promise<void>}
     */
    async esperarCarga() {
        if (typeof this._ensurePageLoad === 'function') {
            return await this._ensurePageLoad();
        }

        const frames = [];
        if (typeof this.getPageLoadFrames === 'function') {
            frames.push(...this.getPageLoadFrames());
        } else if (typeof this.getPageLoadFrame === 'function') {
            frames.push(this.getPageLoadFrame());
        } else {
            frames.push(this.page);
        }

        const errors = [];
        for (const frame of frames) {
            try {
                await this.waitForFrameStable(() => frame);
                if (typeof this.getPageLoadLocators === 'function') {
                    const locators = this.getPageLoadLocators(frame) || [];
                    for (const locator of locators) {
                        const resolvedLocator = typeof locator === 'function' ? locator() : locator;
                        await expect(resolvedLocator).toBeVisible({ timeout: TIMEOUTS.COMPONENT_LOAD });
                    }
                }
                return;
            } catch (error) {
                errors.push(error);
            }
        }

        const lastError = errors[errors.length - 1];
        throw lastError || new Error('esperarCarga: no se pudo validar la carga de la página');
    }

    /**
     * Método auxiliar para unificar la lógica de _ensurePageLoad en páginas con frames múltiples.
     * @param {Array<string>} possibleFrames - Lista de selectores de frames a probar
     * @param {Array<Locator>} elementChecks - Elementos a verificar para confirmar carga
     * @param {string} errorMessage - Mensaje de error si no se encuentra frame válido
     * @returns {Promise<void>}
     */
    async _ensurePageLoadForFrames(possibleFrames, elementChecks, errorMessage) {
        const quickTimeout = 1000;
        const pollInterval = 200;

        for (const frameSel of possibleFrames) {
            this.frameSelector = frameSel;

            try {
                await this.waitForFrameStable(this.baseFrame);

                const checks = elementChecks.map(check => {
                    return typeof check === 'function' ? check(this.baseFrame) : check;
                });

                await Promise.race(checks.map(locator => expect(locator).toBeVisible({ timeout: quickTimeout })));
                return;
            } catch {
                // Continuar al siguiente frame
            }
        }

        throw new Error(errorMessage || 'No se pudo detectar un frame válido');
    }
    /**
     * Selecciona una opción en un elemento select.
     * Espera carga de opciones en selects que cargan dinámicamente.
     * @param {Function|Locator} locator - Elemento select
     * @param {string|number} value - Valor a seleccionar
     * @param {Function|Frame|Page} [context=this.page] - Contexto ejecución
     * @throws {Error} Si selección falla
     * @returns {Promise<void>}
     */
    async selectOption(locator, value, context = this.page) {
        await this._executeAction(locator, context, async (el) => {
            const current = await el.inputValue().catch(() => '');
            if (current === value) return;

            // Sincronización para combos que cargan opciones vía AJAX
            await el.evaluate(async (sel) => {
                const start = Date.now();
                while (sel.options.length <= 1 && (Date.now() - start) < 9000) {
                    await new Promise(r => setTimeout(r, 900));
                }
            }).catch(() => {});

            await el.selectOption(value);
            await el.press('Tab');
            await this._waitForProcessingMessage();
        }, { retries: 4, retryDelayMs: 700 });
    }

    /**
     * Completa un campo de entrada con valor.
     * Compara valor actual evitando escrituras si ya existe.
     * @param {Function|Locator} locator - Campo de entrada
     * @param {string|number} value - Valor a completar
     * @param {Function|Frame|Page} [context=this.page] - Contexto ejecución
     * @throws {Error} Si completado del campo falla
     * @returns {Promise<void>}
     */
    async fill(locator, value, context = this.page) {
        await this._executeAction(locator, context, async (el) => {
            const str = value.toString();
            const current = await el.inputValue().catch(() => '');
            if (current === str) return;
            await el.fill(str);
            await el.press('Tab'); 
        }, { retries: 4, retryDelayMs: 500 });
    }

    /**
     * Limpia completamente un campo de entrada.
     * @param {Function|Locator} locator - Campo a limpiar
     * @param {Function|Frame|Page} [context=this.page] - Contexto ejecución
     * @returns {Promise<void>}
     */
    async clear(locator, context = this.page) {
        await this._executeAction(locator, context, async (el) => {
            await el.focus();
            await el.press('Control+A');
            await el.press('Backspace');
            await el.press('Tab');
        });
    }

    /**
     * Completa múltiples campos desde un mapeo de configuración.
     * Mapeo: [{ key: 'tipoPersona', locator: ..., type: 'fill'|'select' }]
     * @param {Array<Object>} mapping - Configuración de campos
     * @param {Object} data - Objeto con datos de negocio
     * @param {Function|Frame|Page} frame - Contexto ejecución
     * @throws {Error} Si algún campo falla
     * @returns {Promise<void>}
     */
    async fillForm(mapping, data, frame) {
        for (const field of mapping) {
            const value = data[field.key];
            if (value === undefined || value === null || value === '') continue;

            if (field.type === 'fill') {
                await this.fill(field.locator, value, frame);
            } else {
                await this.selectOption(field.locator, value, frame);
            }
        };
    }

    /**
     * Hace clic en un elemento con reintentos automáticos.
     * Usa force=true si falla en primer intento.
     * @param {Function|Locator} locator - Elemento a clickear
     * @param {Function|Frame|Page} [context=this.page] - Contexto ejecución
     * @throws {Error} Si click falla después de reintentos
     * @returns {Promise<void>}
     */
    async click(locator, context = this.page) {
        await this._executeAction(locator, context, async (el) => {
            try {
                await el.click({ timeout: TIMEOUTS.MEDIUM });
            } catch {
                await el.click({ force: true, timeout: TIMEOUTS.MEDIUM });
            }
        }, { retries: 4, retryDelayMs: 500 });
    }

    async _waitForOverlay(frame = this.page) {
        const f = typeof frame === 'function' ? frame() : frame;
        // En Bantotal puede existir un div vacío permanente; solo esperar si realmente se vuelve visible/bloqueante.
        const overlay = f.locator('div:empty').first();
        const appearanceTimeout = 1500;
        const hiddenTimeout = Math.min(TIMEOUTS.UI_TRANSITION, 15000);
        try {
            await overlay.waitFor({ state: 'visible', timeout: appearanceTimeout });
            await overlay.waitFor({ state: 'hidden', timeout: hiddenTimeout });
        } catch {
            // Si no aparece o no corresponde a un overlay transitorio, continuar.
        }
    }

    async _waitForProcessingMessage(frame = this.page, timeout = TIMEOUTS.PROCESSING_MAX) {
        const ctx = typeof frame === 'function' ? frame() : frame;

        const processingRegex = /procesando.*espere/i;

        const appearanceWindow = 2000;
        const pollInterval = 200;
        const endAt = Date.now() + appearanceWindow;

        let appearedLocator = null;

        while (Date.now() < endAt && !appearedLocator) {
            for (const f of this.page.frames()) {
                const locator = f.getByText(processingRegex).first();

                const isVisible = await locator.isVisible().catch(() => false);
                if (isVisible) {
                    appearedLocator = locator;
                    break;
                }
            }

            if (!appearedLocator) {
                await this.page.waitForTimeout(pollInterval);
            }
        }

        if (!appearedLocator) return;

        try {
            await appearedLocator.waitFor({ state: 'hidden', timeout });
        } catch {
            // Si no desaparece, no bloqueamos aquí
        }
    }

    /**
     * Espera y espera desaparición de mensaje de procesamiento.
     * Maneja el ciclo completo: aparecer -> desaparecer con buffer UI.
     * @param {Function|Frame|Page} [frame=this.page] - Contexto a esperar
     * @param {number} [timeout=600000] - Timeout en ms
     * @returns {Promise<void>}
     */
    async waitEndProcessingMessage(frame = this.page, timeout = 600000) {
        const f = typeof frame === 'function' ? frame() : frame;
        const loader = f.getByText(/procesando, por favor espere/i);

        const appearanceWindow = 5000;
        const pollInterval = 200;

        let appeared = false;
        const end = Date.now() + appearanceWindow;

        // 1. Esperar a que aparezca
        while (Date.now() < end) {
            const visible = await loader.isVisible().catch(() => false);

            if (visible) {
            appeared = true;
            break;
            }

            await this.page.waitForTimeout(pollInterval);
        }

        // 2. Si apareció, asegurar que desaparezca realmente
        if (appeared) {
            await loader.waitFor({ state: 'hidden', timeout }).catch(() => {});
            await this.page.waitForTimeout(300);
        }
    }

    /**
     * Espera a que un frame sea estable (carga completa y procesamiento finalizado).
     * @param {Function|Frame} frame - Frame a sincronizar
     * @param {Object} [options] - Opciones de timeout
     * @param {number} [options.timeout=TIMEOUTS.COMPONENT_LOAD] - Timeout carga
     * @param {number} [options.processingTimeout=TIMEOUTS.PROCESSING_MAX] - Timeout procesamiento
     * @returns {Promise<void>}
     */
    async waitForFrameStable(frame, options = {}) {
        const timeout = options.timeout ?? TIMEOUTS.COMPONENT_LOAD;
        const processingTimeout = options.processingTimeout ?? TIMEOUTS.PROCESSING_MAX;
        const f = typeof frame === 'function' ? frame() : frame;

        await this._waitForProcessingMessage(f, processingTimeout);
    }

    /**
     * Obtiene el valor actual de un campo de entrada.
     * @param {Locator} locator - Campo de entrada
     * @returns {Promise<string>} Valor del campo
     * @throws {Error} Si elemento no es visible
     */
    async getInputValue(locator) {
        await locator.waitFor({ state: 'visible' });
        return await locator.inputValue();
    }

    /**
     * Obtiene el contenido de texto de un elemento.
     * @param {Locator} locator - Elemento a leer
     * @returns {Promise<string>} Texto trimmed
     * @throws {Error} Si elemento no es visible
     */
    async getText(locator) {
        await locator.waitFor({ state: 'visible' });
        return (await locator.textContent()).trim();
    }

    /**
     * Valida que todos los elementos en lista sean visibles.
     * Aplicable a validaciones de precondiciones (ISTQB).
     * @param {Array<Locator>} [locators=[]] - Elementos a validar
     * @param {number} [timeout=6000000] - Timeout en ms
     * @throws {Error} Si algún elemento no es visible
     * @returns {Promise<void>}
     */
    async validarElementosVisibles(locators = [], timeout = 6000000) {
        for (const locator of locators) {
            await locator.waitFor({ state: 'visible', timeout });
        }
    }

    /**
     * Helper de validación: Verifica visibilidad de elemento.
     * @param {Locator} locator - Elemento a validar
     * @param {Object} [options] - Opciones
     * @throws {AssertionError} Si elemento no es visible
     * @returns {Promise<void>}
     */
    async assertVisible(locator, options = {}) {
        const timeout = options.timeout ?? TIMEOUTS.LONG;
        await expect(locator).toBeVisible({ timeout });
    }

    /**
     * Helper de validación: Verifica invisibilidad de elemento.
     * @param {Locator} locator - Elemento a validar
     * @param {Object} [options] - Opciones
     * @throws {AssertionError} Si elemento es visible
     * @returns {Promise<void>}
     */
    async assertHidden(locator, options = {}) {
        const timeout = options.timeout ?? TIMEOUTS.LONG;
        await expect(locator).toBeHidden({ timeout });
    }

    /**
     * Helper de validación: Verifica igualdad de texto.
     * @param {Locator} locator - Elemento a validar
     * @param {string} expectedText - Texto esperado
     * @throws {AssertionError} Si texto no coincide
     * @returns {Promise<void>}
     */
    async assertTextEquals(locator, expectedText, options = {}) {
        await expect(locator).toHaveText(expectedText, options);
    }

    /**
     * Helper de validación: Verifica que elemento contenga texto.
     * @param {Locator} locator - Elemento a validar
     * @param {string} text - Texto a contener
     * @throws {AssertionError} Si elemento no contiene texto
     * @returns {Promise<void>}
     */
    async assertTextContains(locator, text) {
        await expect(locator).toContainText(text);
    }
}

module.exports = { BasePage };