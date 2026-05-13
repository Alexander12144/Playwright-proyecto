# ISTQB QA Automation Checklist

## Objetivo
Checklist operativo para mantener la suite E2E en nivel senior: estable, trazable y auditable.

## 1) Diseño de pruebas
- Cada caso debe mapearse a un objetivo de negocio claro.
- Deben existir casos positivos, negativos y de validaciones obligatorias.
- Los datos deben venir de `fixtures/data/` y no quedar hardcodeados en los tests.

## 2) Estructura POM
- `pages/`: solo locators + acciones de pantalla.
- `flows/`: solo orquestación de negocio.
- `tests/`: intención del caso, sin lógica técnica compleja.
- Reutilizar `BasePage` para sincronización y acciones comunes.

## 3) Estabilidad
- Evitar `wait` fijos; usar esperas por estado visible/oculto.
- Toda validación crítica debe tener timeout controlado.
- Los casos negativos deben iniciarse en un estado conocido.

## 4) Evidencia y reporte
- Mantener screenshot, video y trace en fallos.
- Registrar defectos con: severidad, pasos, resultado actual y esperado.

## 5) Criterios de salida
- No introducir nuevos flaky tests.
- Casos críticos de login y flujo principal deben pasar.
- Cualquier caso inestable debe marcarse y tener plan de corrección.
