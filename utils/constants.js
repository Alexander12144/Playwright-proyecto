/**
 * Constantes globales del proyecto
 */

// ========== URLs ==========
const URLS = {
    BASE: 'https://azrbttlwsdev01:8067',
    LOGIN: '/mafgx16/servlet/com.dlya.bantotal.hlogin',
    HOME: '/mafgx16/servlet/realIndex.html'
};

// ========== TIMEOUTS ==========
const TIMEOUTS = {
    SHORT: 2000,
    MEDIUM: 5000,
    LONG: 10000,
    VERY_LONG: 20000,
    UI_TRANSITION: 120000,
    PROCESSING_MAX: 600000,
    PAGE_LOAD: 15000,
    COMPONENT_LOAD: 30000
};

// ========== SELECTORES COMUNES ==========
const FRAMES = {
    MAIN: 'iframe[id="1"]',
    BANDEJA_STEP1: 'iframe[name="process1_step1"]',
    BANDEJA_STEP2: 'iframe[name="process1_step2"]',
    BANDEJA_STEP3: 'iframe[name="process1_step3"]',
    BANDEJA_STEP4: 'iframe[name="process1_step4"]',
    // Helper para obtener el último frame de un step específico (el más reciente)
    // Uso: page.frameLocator(getFrameSelector('step2'))
    getFrameSelector: (stepNum) => `iframe[name^="process"][name$="_step${stepNum}"]`
};

// ========== MENSAJES ==========
const MESSAGES = {
    LOGIN_SUCCESS: 'Sesión iniciada',
    INVALID_CREDENTIALS: 'Credenciales inválidas',
    INVALID_PASSWORD: 'Contraseña inválida',
    ERRORS_DATOS_GENERALES: {
        tipoPersona: 'Debe seleccionar Tipo de Persona',
        tipoDoc: 'Debe seleccionar Tipo de Documento',
        numDoc: 'Debe agregar Número de Documento',
        tipoSolicitud: 'Debe seleccionar Tipo de Solicitud',
        sucursal: 'Debe seleccionar Sucursal',
        vendedor: 'Debe seleccionar Vendedor'
    }
};

// ========== TEST DATA ==========
const TEST_DATA = {
    VALID_USER: process.env.USER || 'default_user',
    VALID_PASSWORD: process.env.PASSWORD || 'default_pass'
};

module.exports = {
    URLS,
    TIMEOUTS,
    FRAMES,
    MESSAGES,
    TEST_DATA
};
