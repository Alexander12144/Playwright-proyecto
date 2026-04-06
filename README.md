# Bantotal Playwright Suite

Suite de pruebas E2E para el sistema Bantotal usando Playwright.

## Estructura

- `playwright.config.js`: configuración de Playwright y el proyecto `Calidad`.
- `tests/`: pruebas de negocio.
- `pages/`: Page Objects Model para cada pantalla.
- `components/`: elementos reutilizables como el menú de navegación.
- `utils/`: carpeta disponible para helpers adicionales.
- `credenciales.env`: credenciales de prueba cargadas por `dotenv`.

## Comandos

- `npm test`: ejecuta todas las pruebas.
- `npm run test:headed`: ejecuta las pruebas en modo con interfaz visible.
- `npm run test:report`: muestra el reporte HTML generado.
- `npm run test:debug`: ejecuta Playwright en modo depuración.

## Requisitos

1. Instalar dependencias:

```bash
npm install
```

2. Agregar credenciales en `credenciales.env`:

```text
USER=...
PASSWORD=...
```

3. Ejecutar pruebas:

```bash
npm test
```

## Notas

- `headless` está desactivado en la configuración para facilitar la depuración.
- `ignoreHTTPSErrors` está habilitado para entornos con certificados autofirmados.
- Se agregó `pages/BasePage.js` para centralizar comportamiento común de los page objects.
- Se usa `utils/pageActions.js` para acciones repetidas y esperas confiables.
- Si necesitas añadir más pasos comunes, usa `utils/` para helpers compartidos.
