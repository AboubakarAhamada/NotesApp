/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Timeout global par test
  timeout: 30 * 1000,

  // Lancer les tests en parallèle
  fullyParallel: false,
  reporter: [
    ['list'],
    ['html', { open: 'on-failure' }]
  ],

  // Configuration de test par défaut
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: 'https://practice.expandtesting.com/notes/app',
    headless: true,
    actionTimeout: 10000, // Timeout pour les actions (click, fill, etc.)
    navigationTimeout: 30000, // Timeout pour les navigations
    ignoreHTTPSErrors: true, // Ignorer les erreurs HTTPS pour les tests
    bypassCSP: true, // Contourner les politiques de sécurité
    extraHTTPHeaders: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  },

  // ✅ Configuration multi-navigateurs
  projects: [
    // Setup project
    { name: 'setup', testMatch: "auth.setup.ts" },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      
      },
      
    },

    // {
    //   name: 'chromium',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     // Use prepared auth state.
    //     storageState: 'playwright/.auth/user.json',
    //   },
    //   dependencies: ['setup'],
    // },

    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     // Use prepared auth state.
    //     storageState: 'playwright/.auth/user.json',
    //   },
    //   dependencies: ['setup'],
    // },
    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     // Use prepared auth state.
    //     storageState: 'playwright/.auth/user.json',
    //   },
    //   dependencies: ['setup'],
    // },

    // ✅ Mobile (facultatif)
    // {
    //   name: 'Mobile Chrome',
    //   use: devices['Pixel 5'],
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: devices['iPhone 12'],
    // },
  ],

  // Dossier où Playwright va stocker les traces, screenshots, vidéos
  outputDir: 'test-results/'
});
