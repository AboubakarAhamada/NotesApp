import { Route } from '@playwright/test';

const blockedDomains = [
  'google',
  'ads',
  'doubleclick',
  'googlesyndication',
  'amazon-adsystem',
  'facebook.com/tr',
  'googletagmanager',
  'vignette',
  'aswift'
  // NE PAS bloquer socket.io - c'est une lib critique de l'app
];

export async function blockAds(route: Route): Promise<void> {
  const url = route.request().url();
  const shouldBlock = blockedDomains.some(domain => url.includes(domain));
  if (shouldBlock) {
    await route.abort();
  } else {
    await route.continue();
  }
}