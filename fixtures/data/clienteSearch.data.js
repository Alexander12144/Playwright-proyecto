/**
 * Datos centralizados para búsqueda y selección de clientes.
 * Utilizados en flujos de selección de cliente y filtrados.
 */

const CLIENTE_SEARCH_PARAMS = Object.freeze({
    pais: '604',              // Perú
    tipoDocumento: '1',       // Tipo documento estándar
    cuenta: '62625',          // Cuenta del cliente de prueba
});

/**
 * Variantes de búsqueda para validar diferentes criterios.
 */
const CLIENTE_SEARCH_VARIANTS = Object.freeze({
    // Búsqueda por país y documento
    POR_DOCUMENTO: {
        pais: '604',
        tipoDocumento: '1',
    },
    // Búsqueda por cuenta (más rápido)
    POR_CUENTA: {
        cuenta: '62625',
    },
    // Búsqueda combinada (más específica)
    COMBINADA: {
        pais: '604',
        tipoDocumento: '1',
        cuenta: '62625',
    },
});

module.exports = {
    CLIENTE_SEARCH_PARAMS,
    CLIENTE_SEARCH_VARIANTS,
};
