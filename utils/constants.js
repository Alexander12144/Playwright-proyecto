/**
 * Constantes globales del proyecto
 */

// ========== URLs ==========
const URLS = {
    LOGIN: '/mafgx16/servlet/com.dlya.bantotal.hlogin',
    HOME: '/mafgx16/servlet/realIndex.html'
};

// ========== TIMEOUTS ==========
const TIMEOUTS = {
    SHORT: 2000,
    MEDIUM: 5000,
    LONG: 10000,
    VERY_LONG: 20000,
    PAGE_LOAD: 15000,
    COMPONENT_LOAD: 30000
};

// ========== SELECTORES COMUNES ==========
const FRAMES = {
    MAIN: 'iframe[id="1"]',
    BANDEJA_STEP1: 'iframe[name="process1_step1"]',
    BANDEJA_STEP2: 'iframe[name="process1_step2"]',
    BANDEJA_STEP4: 'iframe[name="process1_step4"]'
};

// ========== MENSAJES ==========
const MESSAGES = {
    LOGIN_SUCCESS: 'Sesión iniciada',
    INVALID_CREDENTIALS: 'Credenciales inválidas',
    INVALID_PASSWORD: 'Contraseña inválida'
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
