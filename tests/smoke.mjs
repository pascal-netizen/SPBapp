import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = process.env.SMOKE_TEST_URL || 'https://spb.pascal-schmidt.de';
const SCREENSHOTS_DIR = join(__dirname, 'screenshots');
const NAV_TIMEOUT = 10_000;
const ELEMENT_TIMEOUT = 5_000;

// ANSI colors
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

const results = [];
const consoleErrors = [];

function pass(name, ms) {
  const warn = ms > 3000 ? ` ${YELLOW}(slow: ${ms}ms)${RESET}` : ` (${ms}ms)`;
  console.log(`  ${GREEN}PASS${RESET}  ${name}${warn}`);
  results.push({ name, passed: true, ms });
}

function fail(name, ms, err) {
  const elapsed = ms !== null ? ` (${ms}ms)` : '';
  console.log(`  ${RED}FAIL${RESET}  ${name}${elapsed}`);
  console.log(`         ${err}`);
  results.push({ name, passed: false, ms, err });
}

async function screenshot(page, name) {
  const file = join(SCREENSHOTS_DIR, `${name}.png`);
  await page.screenshot({ path: file, fullPage: name === 'calculation' });
}

async function runTest(name, fn) {
  const start = Date.now();
  try {
    await fn();
    const ms = Date.now() - start;
    pass(name, ms);
    if (ms > 3000) {
      console.log(`  ${YELLOW}WARN${RESET}  Response time ${ms}ms exceeds 3000ms threshold`);
    }
  } catch (err) {
    const ms = Date.now() - start;
    fail(name, ms, err.message || String(err));
  }
}

(async () => {
  // Ensure screenshots directory exists
  if (!existsSync(SCREENSHOTS_DIR)) {
    await mkdir(SCREENSHOTS_DIR, { recursive: true });
  }

  console.log('\n=== SPBapp Smoke Test Results ===');
  console.log(`  URL: ${BASE_URL}\n`);

  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  // Capture console errors throughout the session
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[console.error] ${msg.text()}`);
    }
  });
  page.on('pageerror', (err) => {
    consoleErrors.push(`[pageerror] ${err.message}`);
  });

  // ── Test 1: Page Load ────────────────────────────────────────────────────
  await runTest('Page Load', async () => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT });
    // Wait for at least one input field to appear (InputField renders <input type="text">)
    await page.waitForSelector('input[type="text"]', { timeout: ELEMENT_TIMEOUT });
    await screenshot(page, 'page-load');
  });

  // ── Test 2: Tab — Fräsen ────────────────────────────────────────────────
  await runTest('Tab: Fräsen', async () => {
    // The milling tab is active by default; click it explicitly to confirm it responds
    // Tabs render as <button> elements in the nav
    const millingBtn = page.locator('nav button').filter({ hasText: /fräsen/i }).first();
    await millingBtn.waitFor({ state: 'visible', timeout: ELEMENT_TIMEOUT });
    await millingBtn.click();
    // Verify inputs are present in the milling tab
    await page.waitForSelector('input[type="text"]', { timeout: ELEMENT_TIMEOUT });
    await screenshot(page, 'tab-fraesen');
  });

  // ── Test 3: Tab — Drehen ────────────────────────────────────────────────
  await runTest('Tab: Drehen', async () => {
    const turningBtn = page.locator('nav button').filter({ hasText: /drehen/i }).first();
    await turningBtn.waitFor({ state: 'visible', timeout: ELEMENT_TIMEOUT });
    await turningBtn.click();
    await page.waitForSelector('input[type="text"]', { timeout: ELEMENT_TIMEOUT });
    await screenshot(page, 'tab-drehen');
  });

  // ── Test 4: Tab — Bohren ────────────────────────────────────────────────
  await runTest('Tab: Bohren', async () => {
    const drillingBtn = page.locator('nav button').filter({ hasText: /bohren/i }).first();
    await drillingBtn.waitFor({ state: 'visible', timeout: ELEMENT_TIMEOUT });
    await drillingBtn.click();
    await page.waitForSelector('input[type="text"]', { timeout: ELEMENT_TIMEOUT });
    await screenshot(page, 'tab-bohren');
  });

  // ── Test 5: Calculation (Fräsen) ─────────────────────────────────────────
  await runTest('Calculation', async () => {
    const millingBtn = page.locator('nav button').filter({ hasText: /fräsen/i }).first();
    await millingBtn.waitFor({ state: 'visible', timeout: ELEMENT_TIMEOUT });
    await millingBtn.click();

    // The app auto-calculates with default values; ResultCard elements are rendered
    // as div[title] containing "<value> <unit>" — they appear inside ResultsPanel.
    // The outer container has a heading with text matching t('common.results').
    // We look for the result cards which have a specific class pattern (p-3.5 rounded-xl border).
    // Use a broader selector: any div that has a child with font-mono text and a label.
    // The most reliable selector: elements produced by ResultCard have onClick + title attrs.
    await page.waitForSelector('[title]', { timeout: ELEMENT_TIMEOUT });

    // Confirm multiple result cards exist (milling produces many results)
    const cards = page.locator('div[title][class*="rounded-xl"]');
    const count = await cards.count();
    if (count === 0) {
      throw new Error('No result cards found on Fräsen tab');
    }

    await screenshot(page, 'calculation');
  });

  await browser.close();

  // ── Summary ───────────────────────────────────────────────────────────────
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log('');
  console.log(`  ${passed} passed, ${failed} failed`);

  if (consoleErrors.length > 0) {
    console.log(`\n  ${YELLOW}Console errors captured during session:${RESET}`);
    consoleErrors.forEach((e) => console.log(`    ${e}`));
  }

  console.log('');

  process.exit(failed > 0 ? 1 : 0);
})();
