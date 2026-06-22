const { expect } = require('@playwright/test');
const { TIMEOUTS, FRAMES } = require('../utils/constants');

/**
 * Clase base para todas las Page Objects.
 * Proporciona funcionalidades comunes: navegación, interacción con elementos,
 * manejo de frames y esperas con reintentos automáticos.
 */
class BasePage {
    constructor(page) {
        this.page = page;
    }

    /**
     * Getter centralizado para el frame principal de Bantotal (MAIN).
     * @returns {FrameLocator} Localizador del frame principal
     */
    get mainFrame() {
        return this.page.frameLocator(FRAMES.MAIN);
    }

    /**
     * Determina si un error se debe a un frame stale o contexto destruido.
     * @param {Error} error
     * @returns {boolean}
     */
    _isFrameRefreshIssue(error) {
        const message = (error && error.message ? error.message : '').toLowerCase();
        return message.includes('target page, context or browser has been closed') ||
            message.includes('execution context was destroyed') ||
            message.includes('frame was detached');
    }

    /**
     * Captura un screenshot al reintentar una acción fallida.
     * @param {number} attempt
     * @returns {Promise<void>}
     */
    async _captureRetryScreenshot(attempt) {
        try {
            const screenshotPath = `./tmp/retry-${Date.now()}-${attempt}.png`;
            await this.page.screenshot({ path: screenshotPath, fullPage: false });
        } catch {
            // No interrumpir si la captura falla.
        }
    }

    /**
     * Resuelve un locator o función que retorna un locator.
     * @param {Function|Locator} locator
     * @returns {Locator}
     */
    _resolveLocator(locator) {
        return typeof locator === 'function' ? locator() : locator;
    }

    /**
     * Resuelve un contexto (frame/page) o función que lo retorna.
     * @param {Function|Frame|Page} context
     * @returns {Frame|Page}
     */
    _resolveContext(context) {
        return typeof context === 'function' ? context() : context;
    }

    /**
     * Ejecuta una acción con reintentos automáticos y espera a que el locator sea visible.
     * @param {Function|Locator} locator
     * @param {Function|Frame|Page} context
     * @param {Function} callback
     * @param {{retries?: number, retryDelayMs?: number}} [options={}] 
     * @returns {Promise<void>}
     */
    async _performAction(locator, context, callback, options = {}) {
        const retries = options.retries ?? 5;
        const retryDelayMs = options.retryDelayMs ?? 500;
        let lastError;

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const frame = this._resolveContext(context);
                const target = this._resolveLocator(locator);
                await target.waitFor({ state: 'visible', timeout: TIMEOUTS.VERY_LONG });
                await callback(target, frame);
                return;
            } catch (error) {
                lastError = error;
                if (!this._isFrameRefreshIssue(error) || attempt === retries) {
                    throw error;
                }
                await this._captureRetryScreenshot(attempt);
                await this.page.waitForTimeout(retryDelayMs);
            }
        }

        throw lastError;
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

        if (this.frameSelector && typeof this.getPageLoadLocators === 'function') {
            return await this._ensurePageLoadForFrames([this.frameSelector], this.getPageLoadLocators(), 'esperarCarga: no se detectó frame activo para selector');
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

        for (const frameSel of possibleFrames) {
            this.frameSelector = frameSel;

            try {
                await this.waitForFrameStable(this.baseFrame);

                const checks = elementChecks.map(check => typeof check === 'function' ? check(this.baseFrame) : check);
                await Promise.race(checks.map(locator => expect(locator).toBeVisible({ timeout: quickTimeout })));
                return;
            } catch {
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
        await this._performAction(locator, context, async (el) => {
            const current = await el.inputValue().catch(() => '');
            if (current === value) return;

            await el.evaluate(async (sel) => {
                const start = Date.now();
                while (sel.options.length <= 1 && Date.now() - start < 9000) {
                    await new Promise((resolve) => setTimeout(resolve, 900));
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
        await this._performAction(locator, context, async (el) => {
            const str = value.toString();
            const current = await el.inputValue().catch(() => '');
            if (current === str) return;
            await el.fill(str);
            await el.press('Tab');
        }, { retries: 4, retryDelayMs: 500 });
    }

    /**
     * Escribe texto en un campo con la particularidad de Bantotal.
     * @param {Locator} locator - Campo de entrada a completar.
     * @param {string|number} valor - Valor a escribir.
     */
    async completarCampo(locator, valor) {
        if (valor == null || valor === '') return;

        await locator.focus();
        await locator.press('Control+a');
        await locator.press('Backspace');
        await locator.type(valor.toString(), { delay: 50 });
        await locator.press('Tab');
        await this.page.waitForTimeout(500);
    }

    /**
     * Limpia completamente un campo de entrada.
     * @param {Function|Locator} locator - Campo a limpiar
     * @param {Function|Frame|Page} [context=this.page] - Contexto ejecución
     * @returns {Promise<void>}
     */
    async clear(locator, context = this.page) {
        await this._performAction(locator, context, async (el) => {
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
        }
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
        await this._performAction(locator, context, async (el) => {
            try {
                await el.click({ timeout: TIMEOUTS.MEDIUM });
            } catch {
                await el.click({ force: true, timeout: TIMEOUTS.MEDIUM });
            }
        }, { retries: 4, retryDelayMs: 500 });
    }

    async _waitForProcessingMessage(frame = this.page, timeout = TIMEOUTS.PROCESSING_MAX) {
        const f = this._resolveContext(frame);
        const processingRegex = /procesando.*espere/i;
        const appearanceWindow = 2000;
        const pollInterval = 200;
        const endAt = Date.now() + appearanceWindow;

        let appearedLocator = null;

        while (Date.now() < endAt && !appearedLocator) {
            for (const frameCandidate of this.page.frames()) {
                const locator = frameCandidate.getByText(processingRegex).first();
                if (await locator.isVisible().catch(() => false)) {
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
        const processingTimeout = options.processingTimeout ?? TIMEOUTS.PROCESSING_MAX;
        const f = this._resolveContext(frame);

        await this._waitForProcessingMessage(f, processingTimeout);
    }

    /**
     * Valida que todos los elementos en lista sean visibles.
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
}

module.exports = { BasePage };