const BASE_CREDITO_VEHICULAR = Object.freeze({
    tipoPersona: 'Natural',
    tipoDoc: 'D.N.I.',
    pais: 'PERU',
    numDoc: '12345678',
    tipoSolicitud: 'Vehicular',
    concesionaria: 'MITSUI',
    sucursal: 'MI-MOLINA EXTERNAS',
    vendedor: 'Administrador',
});

const BASE_DATOS_PERSONA = Object.freeze({
    apellidoPaterno: 'PEREZ',
    apellidoMaterno: 'GOMEZ',
    fechaNacimiento: '01/01/1970',
    fechaVencimiento: '01/01/2030',
    sexo: 'Masculino',
    estadoCivil: 'Soltero/a',
    paisNacimiento: 'PERU',
    residencia: 'PERU',
    dependientes: '0',
    ocupacion: 'Ingeniero',
    nivelEstudios: 'Universidad completa',
    autorizacion: 'Sí',
    firmaContrato: 'Sí',
    patrimonio: 'Sí',
    actividad: 'No',
    tipoAlta: 'Normal'
});

const DATOS_OPERACION_VEICULAR = Object.freeze({
    cuenta: '172022',
    operacion: '2235017',
    estado: 'Aprobada'
});

function buildInstanciaExistente(overrides = {}) {
    const generalOverrides = overrides.datosGenerales ?? {};
    const personaOverrides = overrides.datosPersona ?? {};
    return {
        instancia: {
            nroInstancia: overrides.nroInstancia ?? '918094'
        },
        datosGenerales: {
            ...BASE_CREDITO_VEHICULAR,
            ...generalOverrides
        },
        datosPersona: {
            ...personaOverrides
        }
    };
}

function buildInstanciaExistenteConPersona(overrides = {}) {
    const personaOverrides = overrides.datosPersona ?? {};
    return buildInstanciaExistente({
        ...overrides,
        datosPersona: {
            ...BASE_DATOS_PERSONA,
            ...personaOverrides
        }
    });
}

function buildDatosIncompletos(overrides = {}) {
    const generalOverrides = overrides.datosGenerales ?? {};
    return buildInstanciaExistente({
        ...overrides,
        datosGenerales: {
            ...generalOverrides,
            tipoDoc: undefined,
            numDoc: undefined
        }
    });
}

module.exports = {
    BASE_CREDITO_VEHICULAR,
    BASE_DATOS_PERSONA,
    buildInstanciaExistente,
    buildInstanciaExistenteConPersona,
    buildDatosIncompletos
};
