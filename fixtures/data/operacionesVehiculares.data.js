const OPERACIONES_VEHICULARES_INVALIDAS = Object.freeze({
    cuenta: '000000',
    operacion: '9999999',
});

const OPERACIONES_VEHICULARES_VALIDAS = Object.freeze({
    cuenta: '17202',
    operacion: '2235017',
    //estado: 'Aprobada',
});

module.exports = {
    OPERACIONES_VEHICULARES_INVALIDAS,
    OPERACIONES_VEHICULARES_VALIDAS,
};
