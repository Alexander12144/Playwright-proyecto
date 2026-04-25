// @ts-check
const {
  defineConfig,
  devices
} = require('@playwright/test');
require('dotenv').config({ path: './credenciales.env' });

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false, // 
  forbidOnly: !!process.env.CI,
  retries: 1, 
  workers: 1,

  reporter: [
    ['list'],
    ['html', {
      open: 'never'
    }],
    ['allure-playwright']
  ],

  use: {
    headless: process.env.CI ? true : false, // Mantener en false para debuggear visualmente

    ignoreHTTPSErrors: true, // Salta el error de certificado de azrbttlwsdev01

    launchOptions: {
      args: [
        '--disable-web-security', // Permite leer iframes de distintos orígenes
        '--disable-features=IsolateOrigins,site-per-process' // Obliga a los frames a compartir proceso
      ]
    },

    trace: 'retain-on-failure',
    screenshot: 'on', // Cáptura todo para ver qué pasa en cada paso
    video: 'retain-on-failure',

    locale: 'es-PE',
    timezoneId: 'America/Lima',
    viewport: { width: 1366, height: 1000 },
  },

  projects: [{
      name: 'Calidad',
      use: {
        baseURL: 'https://azrbttlwsdev01:8067',
        ...devices['Desktop Edge'],
        channel: 'msedge',
      },
    }/*,
    {
      name: 'Preprod',
      use: {
        baseURL: 'https://10.1.9.10:8067/',
        ...devices['Desktop Edge'],
        channel: 'msedge',
      },
    },
    {
      name: 'Preprod2',
      use: {
        baseURL: 'https://srvmafdbbttl02:8067/',
        ...devices['Desktop Edge'],
        channel: 'msedge',
      },
    }*/
  ],
});