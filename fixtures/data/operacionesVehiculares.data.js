const OPERACIONES_VEHICULARES_INVALIDAS = Object.freeze({
    cuenta: '000000',
    operacion: '9999999',
});

const OPERACIONES_VEHICULARES_VALIDAS = Object.freeze({
    cuenta: '17202',
    operacion: '2235017',
    //estado: 'Aprobada',
});

const OPERACIONES_VEHICULARES_DATOS_CLIENTE_VALIDOS = Object.freeze({
    pais: '604',
    tipoDocumento: '1',
    cuenta: 'SOTO QUINDE SAUL JOEL', //Se debe colocar nombre del titular de la cuenta para que el filtro del popup funcione correctamente
    //nroDocumento: '12345678',
});

const OPERACIONES_VEHICULARES_DATOS_CLIENTE_INVALIDOS = Object.freeze({
    pais: '604',
    tipoDocumento: '1',
    cuenta: 'CLIENTE INEXISTENTE', //Se debe colocar nombre del titular de la cuenta para que el filtro del popup funcione correctamente
    //nroDocumento: '12345678',
});

module.exports = {
    OPERACIONES_VEHICULARES_INVALIDAS,
    OPERACIONES_VEHICULARES_VALIDAS,
    OPERACIONES_VEHICULARES_DATOS_CLIENTE_VALIDOS,
    OPERACIONES_VEHICULARES_DATOS_CLIENTE_INVALIDOS
};
