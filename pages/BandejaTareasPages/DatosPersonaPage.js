const { BasePage } = require('../BasePage');
const { TIMEOUTS, FRAMES } = require('../../utils/constants');
const { BantotalNavigator } = require('../components/BantotalNavigator');

class DatosPersonaPage extends BasePage {
  constructor(page) {
    super(page);
    this.frameSelector = FRAMES.BANDEJA_STEP3;
    this._activeBaseFrame = null;
    this._nav = null;
  }

  get baseFrame() {
    return this._activeBaseFrame || this.mainFrame.frameLocator(this.frameSelector).last();
  }

  get nav() {
    if (!this._nav) {
      this._nav = new BantotalNavigator(this.baseFrame);
    }
    return this._nav;
  }

  get labelInstancia() { return this.baseFrame.getByText('Instancia'); }
  get valorInstancia() { return this.baseFrame.locator('#span_vNUMDOC'); }

  get labelPais() { return this.baseFrame.getByText('País', { exact: true }); }
  get valorPais() { return this.baseFrame.locator('#span_vPANOM'); }

  get labelTipoDocumento() { return this.baseFrame.getByText('Tipo Documento'); }
  
  get labelNroDocumento() { return this.baseFrame.getByText('Nro. Documento'); }
  get valorNroDocumento() { return this.baseFrame.locator('#span_vNUMDOC'); }

  get labelTipoPersona() { return this.baseFrame.getByText('Tipo de Persona'); }
  get valorTipoPersona() { return this.baseFrame.locator('#span_vPPETIPO'); }

  get labelTipoAlta() { return this.baseFrame.getByText('Tipo de Alta'); }
  get selectTipoAlta() { return this.baseFrame.locator('#vALTACOD'); }

  get labelApellidoPaterno() { return this.baseFrame.getByText('Apellido Paterno (*)'); }
  get labelApellidoMaterno() { return this.baseFrame.getByText('Apellido Materno'); }
  get labelPrimerNombre() { return this.baseFrame.getByText('Primer Nombre (*)'); }
  get labelSegundoNombre() { return this.baseFrame.getByText('Segundo Nombre'); }
  get labelSexo() { return this.baseFrame.getByText('Sexo (*)'); }
  get labelFechaNacimiento() { return this.baseFrame.getByText('Fecha Nacimiento (*)'); }
  get labelFechaVencimiento() { return this.baseFrame.getByText('Fecha Vto Documento'); }
  get labelPaisNacimiento() { return this.baseFrame.getByText('País de Nacimiento (*)'); }
  get labelEstadoCivil() { return this.baseFrame.getByText('Estado Civil (*)'); }
  get labelResidencia() { return this.baseFrame.getByText('País de Residencia (*)'); }
  get labelOcupacion() { return this.baseFrame.getByText('Ocupación/Profesión'); } 
  get labelNivelEstudios() { return this.baseFrame.getByText('Nivel de Estudio'); }
  get labelAutorizacion() { return this.baseFrame.getByText('¿Autoriza el uso de sus datos'); } 
  get labelPep() { return this.baseFrame.locator('#HTMLTXTCAPTION53'); }
  get labelFirmaContrato() { return this.baseFrame.getByText('Cliente puede firmar contrato?'); }
  get labelPatrimonio() { return this.baseFrame.getByText('Patrimonio Personal a la fecha'); }
  get labelActividad() { return this.baseFrame.getByText('Otras actividades'); }
  get labelActividadObligado() { return this.baseFrame.getByText('Actividad de Sujeto Obligado'); }
  get labelDependientes() { return this.baseFrame.getByText('Dependientes'); }

  get inputApellidoPaterno() { return this.baseFrame.locator('input[name="vPFAPE1"]'); }
  get inputApellidoMaterno() { return this.baseFrame.locator('input[name="vPFAPE2"]'); }
  get inputPrimerNombre() { return this.baseFrame.locator('input[name="vPFNOM1"]'); }
  get inputSegundoNombre() { return this.baseFrame.locator('input[name="vPFNOM2"]'); }
  get selectSexo() { return this.baseFrame.locator('#vPFCANT'); }
  get inputFechaNacimiento() { return this.baseFrame.locator('#vPFFNAC'); }
  get inputFechaVencimiento() { return this.baseFrame.locator('#vFCHVTODOC'); }
  get selectPaisNacimiento() { return this.baseFrame.locator('#vPFPNAC'); }
  get selectEstadoCivil() { return this.baseFrame.locator('#vPFECIV'); }
  get selectResidencia() { return this.baseFrame.locator('#vPAISADIC'); }

  get inputDependientes() { return this.baseFrame.locator('#vCNTDEP'); }
  get selectOcupacion() { return this.baseFrame.locator('#vPROFCOD'); }
  get selectNivelEstudios() { return this.baseFrame.locator('#vNINSCOD'); }
  get selectAutorizacion() { return this.baseFrame.locator('#vCMBCODAUX1'); }
  get inputPep() { return this.baseFrame.getByRole('checkbox', { name: '_' }); }
  get selectFirmaContrato() { return this.baseFrame.locator('#vCMBCODAUX4'); }
  get selectPatrimonio() { return this.baseFrame.locator('#vCMBCODAUX5'); }
  get selectActividad() { return this.baseFrame.locator('#vCMBCODAUX6'); }
  get selectActividadObligado() { return this.baseFrame.locator('#vCMBCODAUX3'); }

  get seccionIdentificacion() {
    return [
      this.labelInstancia,
      this.valorInstancia,
      this.labelPais,
      this.valorPais,
      this.labelTipoDocumento,
      this.labelNroDocumento,
      this.valorNroDocumento,
      this.labelTipoPersona,
      this.valorTipoPersona
    ];
  }

  get seccionDatosPersonales() {
    return [
      this.inputApellidoPaterno,
      this.inputFechaNacimiento,
      this.selectEstadoCivil,
      this.selectTipoAlta,
      this.inputApellidoMaterno,
      this.inputPrimerNombre,
      this.inputSegundoNombre,
      this.selectSexo,
      this.inputFechaNacimiento,
      this.inputFechaVencimiento,
      this.selectPaisNacimiento,
      this.selectEstadoCivil,
      this.selectResidencia,
      this.inputDependientes,
      this.selectOcupacion,
      this.selectNivelEstudios,
      this.selectAutorizacion,
      this.inputPep,
      this.selectFirmaContrato,
      this.selectPatrimonio,
      this.selectActividad,
      this.selectActividadObligado
    ];
  }

  async _ensurePageLoad() {
    const timeout = TIMEOUTS.MEDIUM;
    const candidateFrames = this.page.frames().filter(frame => /process.*_step/i.test(frame.name()));

    for (const candidate of candidateFrames) {
      try {
        await this.waitForFrameStable(() => candidate);
        const header = candidate.getByText('Instancia').first();
        await expect(header).toBeVisible({ timeout });
        this._activeBaseFrame = candidate;
        return;
      } catch {
      }
    }

    await this._ensurePageLoadForFrames(
      [FRAMES.BANDEJA_STEP1, FRAMES.BANDEJA_STEP2, FRAMES.BANDEJA_STEP3, FRAMES.BANDEJA_STEP4],
      [this.labelInstancia, this.inputApellidoPaterno],
      'No se pudo detectar un frame válido para DatosPersonaPage'
    );
  }

  get linkAnterior() { return this.nav.btnAnterior; }
  get linkSiguiente() { return this.nav.btnSiguiente; }

  /**
   * @param {{ apellidoPaterno?: string, fechaNacimiento?: string, estadoCivil?: string, tipoAlta?: string }} data
   */
  async completarDatosPersona(data = {}) {
    const mapping = [
      { key: 'apellidoPaterno', locator: () => this.inputApellidoPaterno, type: 'fill' },
      { key: 'apellidoMaterno', locator: () => this.inputApellidoMaterno, type: 'fill' },
      { key: 'primerNombre', locator: () => this.inputPrimerNombre, type: 'fill' },
      { key: 'segundoNombre', locator: () => this.inputSegundoNombre, type: 'fill' },
      { key: 'sexo', locator: () => this.selectSexo, type: 'select' },
      { key: 'fechaNacimiento', locator: () => this.inputFechaNacimiento, type: 'fill' },
      { key: 'fechaVencimiento', locator: () => this.inputFechaVencimiento, type: 'fill' },
      { key: 'paisNacimiento', locator: () => this.selectPaisNacimiento, type: 'select' },
      { key: 'estadoCivil', locator: () => this.selectEstadoCivil, type: 'select' },
      { key: 'residencia', locator: () => this.selectResidencia, type: 'select' },
      { key: 'tipoAlta', locator: () => this.selectTipoAlta, type: 'select' },
      { key: 'dependientes', locator: () => this.inputDependientes, type: 'fill' },
      { key: 'ocupacion', locator: () => this.selectOcupacion, type: 'select' },
      { key: 'nivelEstudios', locator: () => this.selectNivelEstudios, type: 'select' },
      { key: 'autorizacion', locator: () => this.selectAutorizacion, type: 'select' },
      { key: 'firmaContrato', locator: () => this.selectFirmaContrato, type: 'select' },
      { key: 'patrimonio', locator: () => this.selectPatrimonio, type: 'select' },
      { key: 'actividad', locator: () => this.selectActividad, type: 'select' },
    ];

    await this.fillForm(mapping, data, this.baseFrame);

    if (data.pep !== undefined) {
      const isChecked = await this.inputPep.isChecked();
      if (data.pep && !isChecked) {
        await this.inputPep.check();
      } else if (!data.pep && isChecked) {
        await this.inputPep.uncheck();
      }
    }
  }

  async validarIdentificacion() {
    await this.validarElementosVisibles(this.seccionIdentificacion);
  }

  async validarDatosPersonales() {
    await this.validarElementosVisibles(this.seccionDatosPersonales);
  }
}

module.exports = { DatosPersonaPage };