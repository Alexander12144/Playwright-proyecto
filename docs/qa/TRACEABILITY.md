# Traceability Matrix (Inicial)

| ID | Requisito / Regla de negocio | Caso automatizado | Estado |
|---|---|---|---|
| BT-LOGIN-01 | Usuario válido inicia sesión | `tests/login.spec.js` - login válido | Activo |
| BT-LOGIN-02 | Usuario inválido debe ser rechazado | `tests/login.spec.js` - usuario inválido | Activo |
| BT-LOGIN-03 | Password inválido debe ser rechazado | `tests/login.spec.js` - password inválido | Activo |
| BT-LOGIN-04 | Credenciales obligatorias | `tests/login.spec.js` - campos vacíos | Activo |
| BT-CRED-01 | Continuar instancia vehicular existente | `tests/instancia.spec.js` - flujo principal | Activo |
| BT-CRED-02 | Datos generales obligatorios | `tests/instancia.spec.js` - validación obligatorios | Activo (inestable en ambiente) |
| BT-CRED-03 | Crear nueva solicitud vehicular | `tests/crear-instancia.spec.js` | Activo |

## Notas
- Esta matriz debe mantenerse al agregar nuevos escenarios.
- Si un caso está inestable por ambiente o datos, registrar incidente y plan de estabilización.
