# NotesApp - Automatisation de tests UI et API avec CI/CD

## Présentation

Ce projet contient une suite de tests automatisés pour une application de gestion de notes. Il combine des tests end-to-end UI et des tests API, avec une architecture pensée pour l’intégration continue (CI) et le déploiement continu (CD).

## Technologies

- Node.js
- Playwright Test (`@playwright/test`)
- TypeScript
- dotenv

## Structure du projet

- `playwright.config.ts` : configuration principale de Playwright.
- `package.json` : dépendances et métadonnées du projet.
- `tests/` : dossiers de tests UI et API.
  - `tests/ui/` : tests de l’application par l’interface utilisateur.
  - `tests/api/` : tests d’API pour les fonctionnalités de notes.
  - `tests/playwright/` : configuration et setup Playwright.
- `pages/` : classes Page Object Model (POM) pour encapsuler les interactions UI.
- `fixtures/` : fonctions utilitaires et données de test partagées.
- `utils/` : utilitaires généraux, par exemple le blocage de publicités.
- `playwright-report/` : rapport HTML généré par Playwright.
- `test-results/` : résultats de test, captures d’écran et vidéos.

## Installation

1. Installer les dépendances :

```bash
npm install
```

2. Installer les navigateurs Playwright (requis pour l’exécution des tests) :

```bash
npx playwright install
```

3. Si un fichier `.env` est utilisé, ajoutez-le à la racine du projet. Le projet charge automatiquement les variables d’environnement via `dotenv`.

## Exécution des tests

### Lancer tous les tests

```bash
npx playwright test
```

### Lancer les tests UI uniquement

```bash
npx playwright test tests/ui
```

### Lancer les tests API uniquement

```bash
npx playwright test tests/api
```

### Lancer un test spécifique

```bash
npx playwright test tests/ui/home.spec.ts
```

### Voir le rapport HTML

Après exécution des tests, ouvrir le rapport Playwright :

```bash
npx playwright show-report
```

## Configuration Playwright

La configuration du projet se trouve dans `playwright.config.ts` :

- `testDir: './tests'` : répertoire des tests.
- `timeout: 30000` : durée maximale globale par test.
- `fullyParallel: false` : exécution non entièrement parallèle.
- `retries` et `workers` ajustés pour l’intégration CI.
- Rapports configurés en mode `list` et `html`.
- `use` définit des options par défaut : `headless`, capture de trace, captures d’écran et vidéo en cas d’échec.
- `baseURL` est configuré sur `https://practice.expandtesting.com`.
- `outputDir: 'test-results/'` pour les artefacts de test.

## CI/CD et intégration continue

Ce projet est conçu pour s’intégrer facilement dans une pipeline CI/CD :

- les tests Playwright peuvent s’exécuter automatiquement sur `npm install` et `npx playwright test`.
- la configuration gère `retries` et `workers` pour fiabiliser l’exécution dans un environnement CI.
- les rapports HTML et les artefacts (`playwright-report/`, `test-results/`) peuvent être publiés depuis la pipeline.
- ajouter un workflow GitHub Actions ou un équivalent Jenkins/GitLab CI permet de lancer les tests à chaque push ou PR.

## Gestion des secrets

- Utiliser un fichier `.env` local pour stocker les secrets et les variables d’environnement sensibles.
- Ne jamais versionner `.env` dans le dépôt Git.
- Utiliser les variables d’environnement de la plateforme CI (`GitHub Secrets`, `GitLab CI/CD Variables`, `Azure DevOps Pipelines`, etc.) pour fournir les valeurs sensibles en production.
- Dans le code, `dotenv` charge automatiquement les variables définies dans `.env`, ce qui permet de séparer la configuration et les secrets du code source.

## Bonnes pratiques

- Bloquer les publicités et popups dans les tests UI pour réduire les flakiness.
- Vérifier que l’URL cible est correctement résolue avant les assertions de navigation.
- Nettoyer les données créées lors des tests API pour éviter les effets de bord.

## Points importants

- Les tests UI utilisent le modèle de pages (`pages/`) pour rendre le code plus maintenable.
- Les tests API utilisent des fixtures pour la gestion de l’authentification et des en-têtes.
- Les rapports et résultats se trouvent dans `playwright-report/` et `test-results/`.

## Suggestions pour GitHub

- Ajouter `README.md` à la racine du dépôt.
- Versionner `package.json` et `playwright.config.ts`.
- Ajouter potentiellement des scripts npm utiles (`test`, `test:ui`, `test:api`, `report`).

## Contribution

Les contributions sont les bienvenues. Pour ajouter de nouveaux tests ou des améliorations :

1. Créer une branche dédiée.
2. Ajouter ou modifier des tests dans `tests/ui/` ou `tests/api/`.
3. Vérifier le fonctionnement avec `npx playwright test`.
4. Soumettre une Pull Request.

## Licence

Ce projet peut être adapté pour être publié avec la licence de votre choix. Actuellement, aucun fichier de licence n’est inclus dans le dépôt.
