# SPBapp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a web-based cutting parameter calculator (Schnittdatenparameterberechnung) supporting milling, turning, and drilling using the Kienzle model.

**Architecture:** Pure client-side SPA with React 19 + TypeScript + Vite. Calculation logic is separated from UI in pure TypeScript modules. No backend or database — static files served via Nginx in Docker.

**Tech Stack:** React 19, TypeScript, Vite, TailwindCSS 4, i18next, Vitest, Docker/Nginx

---

## File Structure

```
SPBapp/
├── src/
│   ├── main.tsx                    # React entry point
│   ├── App.tsx                     # Root component: Header + Tabs
│   ├── calculations/
│   │   ├── milling.ts              # Milling formulas (pure functions)
│   │   ├── turning.ts              # Turning formulas (pure functions)
│   │   ├── drilling.ts             # Drilling formulas (pure functions)
│   │   └── types.ts                # Shared types for all calculations
│   ├── data/
│   │   └── materials.ts            # Material database (kc1.1, mc values)
│   ├── components/
│   │   ├── Header.tsx              # App header with logo, language, theme toggle
│   │   ├── TabNavigation.tsx       # Fräsen | Drehen | Bohren tabs
│   │   ├── InputField.tsx          # Reusable number input with label + unit
│   │   ├── MaterialSelect.tsx      # Material dropdown, auto-fills kc1.1/mc
│   │   ├── ResultCard.tsx          # Single result display card
│   │   ├── ResultsPanel.tsx        # Grid of ResultCards
│   │   ├── CalculationSteps.tsx    # Collapsible step-by-step display
│   │   ├── KengInfo.tsx            # Keng reference table tooltip
│   │   ├── MillingTab.tsx          # Milling tab: inputs + results + steps
│   │   ├── TurningTab.tsx          # Turning tab: inputs + results + steps
│   │   └── DrillingTab.tsx         # Drilling tab: inputs + results + steps
│   ├── hooks/
│   │   └── useTheme.ts             # Dark/Light/System theme hook
│   ├── i18n/
│   │   ├── index.ts                # i18next configuration
│   │   ├── de.json                 # German translations
│   │   └── en.json                 # English translations
│   └── index.css                   # Tailwind imports + base styles
├── tests/
│   ├── calculations/
│   │   ├── milling.test.ts         # Milling calculation tests
│   │   ├── turning.test.ts         # Turning calculation tests
│   │   └── drilling.test.ts        # Drilling calculation tests
│   └── data/
│       └── materials.test.ts       # Material database tests
├── public/
│   └── favicon.svg
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── vitest.config.ts
├── Dockerfile
├── nginx.conf
└── .gitignore
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `vitest.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`
- Create: `.gitignore`

- [ ] **Step 1: Initialize project with Vite**

```bash
cd /home/pascal/SPBapp
npm create vite@latest . -- --template react-ts
```

Select: React, TypeScript when prompted. If files already exist, allow overwrite (only docs/ exists).

- [ ] **Step 2: Install dependencies**

```bash
cd /home/pascal/SPBapp
npm install react-i18next i18next
npm install -D tailwindcss @tailwindcss/vite vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Configure Vite with Tailwind**

Replace `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- [ ] **Step 4: Configure Vitest**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
  },
})
```

- [ ] **Step 5: Set up Tailwind CSS**

Replace `src/index.css`:

```css
@import "tailwindcss";

:root {
  --color-primary: #2563eb;
}

.dark {
  color-scheme: dark;
}
```

- [ ] **Step 6: Create minimal App shell**

Replace `src/App.tsx`:

```tsx
function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold p-4">SPBapp</h1>
    </div>
  )
}

export default App
```

Replace `src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 7: Update .gitignore**

Replace `.gitignore`:

```
node_modules
dist
*.local
.DS_Store
```

- [ ] **Step 8: Verify dev server starts**

```bash
cd /home/pascal/SPBapp && npm run dev -- --host 0.0.0.0 &
sleep 3
curl -s http://localhost:5173 | head -5
kill %1
```

Expected: HTML output containing `<div id="root">`.

- [ ] **Step 9: Verify test runner works**

```bash
cd /home/pascal/SPBapp && npx vitest run 2>&1 | tail -5
```

Expected: "No test files found" or similar (no tests yet, but vitest runs).

- [ ] **Step 10: Commit**

```bash
cd /home/pascal/SPBapp
git add -A
git commit -m "feat: scaffold Vite + React + TypeScript + Tailwind project"
```

---

### Task 2: Calculation Types & Material Database

**Files:**
- Create: `src/calculations/types.ts`
- Create: `src/data/materials.ts`
- Create: `tests/data/materials.test.ts`

- [ ] **Step 1: Write material database test**

Create `tests/data/materials.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { materials, getMaterial } from '../../src/data/materials'

describe('materials database', () => {
  it('contains at least 11 materials plus custom', () => {
    expect(materials.length).toBeGreaterThanOrEqual(12)
  })

  it('each material has valid kc11 and mc values', () => {
    for (const m of materials) {
      if (m.id === 'custom') continue
      expect(m.kc11).toBeGreaterThan(0)
      expect(m.mc).toBeGreaterThan(0)
      expect(m.mc).toBeLessThan(1)
    }
  })

  it('custom material has null kc11 and mc', () => {
    const custom = getMaterial('custom')
    expect(custom).toBeDefined()
    expect(custom!.kc11).toBeNull()
    expect(custom!.mc).toBeNull()
  })

  it('getMaterial returns correct material by id', () => {
    const steel = getMaterial('42crmo4')
    expect(steel).toBeDefined()
    expect(steel!.kc11).toBe(2100)
    expect(steel!.mc).toBe(0.25)
  })

  it('getMaterial returns undefined for unknown id', () => {
    expect(getMaterial('nonexistent')).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /home/pascal/SPBapp && npx vitest run tests/data/materials.test.ts 2>&1 | tail -10
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create shared calculation types**

Create `src/calculations/types.ts`:

```typescript
export interface MillingInputs {
  D: number        // Fräserdurchmesser [mm]
  z: number        // Schneidenzahl
  fz: number       // Vorschub pro Zahn [mm]
  ap: number       // Schnitttiefe [mm]
  ae: number       // Eingriffsbreite [mm]
  kappa: number    // Kappawinkel [°]
  kc11: number     // Spez. Schnittkraft kc1.1 [N/mm²]
  mc: number       // Kienzle-Exponent
  vc: number       // Schnittgeschwindigkeit [m/min]
  Keng: number     // Eingriffsfaktor (editierbar)
  Pmachine: number // Maschinenleistung [kW]
}

export interface MillingResults {
  phiS: number     // Eingriffswinkel [°]
  ze: number       // Gleichzeitig schneidende Zähne
  n: number        // Drehzahl [U/min]
  vf: number       // Vorschubgeschwindigkeit [mm/min]
  hm: number       // Mittlere Spanungsdicke [mm]
  hmax: number     // Max. Spandicke [mm]
  b: number        // Spanbreite [mm]
  kc: number       // Spez. Schnittkraft [N/mm²]
  Fc: number       // Hauptschnittkraft [N]
  Ff: number       // Vorschubkraft horizontal [N]
  Fa: number       // Vorschubkraft axial [N]
  FfMean: number   // Mittlere Vorschubkraft [N]
  M: number        // Drehmoment [Nm]
  P: number        // Spindelleistung [kW]
  utilization: number // Maschinenauslastung [%]
  Q: number        // Zeitspanvolumen [cm³/min]
}

export interface TurningInputs {
  d: number        // Werkstückdurchmesser [mm]
  vc: number       // Schnittgeschwindigkeit [m/min]
  f: number        // Vorschub [mm/U]
  ap: number       // Schnitttiefe [mm]
  kappaR: number   // Einstellwinkel [°]
  kc11: number     // Spez. Schnittkraft kc1.1 [N/mm²]
  mc: number       // Kienzle-Exponent
  eta: number      // Wirkungsgrad
  Pmachine: number // Maschinenleistung [kW]
}

export interface TurningResults {
  n: number        // Drehzahl [U/min]
  vf: number       // Vorschubgeschwindigkeit [mm/min]
  h: number        // Spanungsdicke [mm]
  b: number        // Spanungsbreite [mm]
  A: number        // Spanungsquerschnitt [mm²]
  kc: number       // Spez. Schnittkraft [N/mm²]
  Fc: number       // Schnittkraft [N]
  Ff: number       // Vorschubkraft [N]
  Fp: number       // Passivkraft [N]
  Pc: number       // Schnittleistung [kW]
  P: number        // Antriebsleistung [kW]
  M: number        // Drehmoment [Nm]
  Q: number        // Zeitspanvolumen [cm³/min]
  utilization: number // Maschinenauslastung [%]
}

export interface DrillingInputs {
  d: number        // Bohrdurchmesser [mm]
  vc: number       // Schnittgeschwindigkeit [m/min]
  f: number        // Vorschub pro Umdrehung [mm/U]
  z: number        // Schneidenzahl
  sigma: number    // Spitzenwinkel [°]
  l: number        // Bohrtiefe [mm]
  kc11: number     // Spez. Schnittkraft kc1.1 [N/mm²]
  mc: number       // Kienzle-Exponent
  eta: number      // Wirkungsgrad
  Pmachine: number // Maschinenleistung [kW]
}

export interface DrillingResults {
  kappa: number    // Halber Spitzenwinkel [°]
  n: number        // Drehzahl [U/min]
  fz: number       // Vorschub pro Schneide [mm]
  vf: number       // Vorschubgeschwindigkeit [mm/min]
  h: number        // Spanungsdicke [mm]
  b: number        // Spanungsbreite [mm]
  A: number        // Spanungsquerschnitt [mm²]
  kc: number       // Spez. Schnittkraft [N/mm²]
  Fc: number       // Schnittkraft [N]
  Ff: number       // Vorschubkraft axial [N]
  M: number        // Drehmoment [Nm]
  Pc: number       // Schnittleistung [kW]
  P: number        // Antriebsleistung [kW]
  Q: number        // Zeitspanvolumen [cm³/min]
  th: number       // Bearbeitungszeit [min]
  utilization: number // Maschinenauslastung [%]
}

export interface CalculationStep {
  name: string       // e.g. "Drehzahl n"
  formula: string    // e.g. "n = (vc × 1000) / (π × D)"
  substituted: string // e.g. "n = (180 × 1000) / (π × 63)"
  result: string     // e.g. "909.46 U/min"
}
```

- [ ] **Step 4: Create material database**

Create `src/data/materials.ts`:

```typescript
export interface Material {
  id: string
  name: string
  kc11: number | null  // N/mm²
  mc: number | null
}

export const materials: Material[] = [
  { id: 'alu',      name: 'Aluminium (Knetleg.)',     kc11: 700,  mc: 0.23 },
  { id: 's235',     name: 'Baustahl S235',             kc11: 1600, mc: 0.25 },
  { id: 's355',     name: 'Baustahl S355',             kc11: 1780, mc: 0.25 },
  { id: 'c45',      name: 'Vergütungsstahl C45',       kc11: 1900, mc: 0.26 },
  { id: '42crmo4',  name: 'Vergütungsstahl 42CrMo4',   kc11: 2100, mc: 0.25 },
  { id: '1.4301',   name: 'Edelstahl 1.4301',          kc11: 2200, mc: 0.27 },
  { id: '1.4571',   name: 'Edelstahl 1.4571',          kc11: 2500, mc: 0.28 },
  { id: 'gjl250',   name: 'Gusseisen GJL-250',         kc11: 1150, mc: 0.28 },
  { id: 'gjs400',   name: 'Gusseisen GJS-400',         kc11: 1450, mc: 0.27 },
  { id: 'messing',  name: 'Messing',                   kc11: 780,  mc: 0.22 },
  { id: 'titan',    name: 'Titan Ti6Al4V',             kc11: 1500, mc: 0.23 },
  { id: 'custom',   name: 'Benutzerdefiniert',          kc11: null, mc: null },
]

export function getMaterial(id: string): Material | undefined {
  return materials.find(m => m.id === id)
}
```

- [ ] **Step 5: Run tests**

```bash
cd /home/pascal/SPBapp && npx vitest run tests/data/materials.test.ts 2>&1
```

Expected: All 5 tests PASS.

- [ ] **Step 6: Commit**

```bash
cd /home/pascal/SPBapp
git add src/calculations/types.ts src/data/materials.ts tests/data/materials.test.ts
git commit -m "feat: add calculation types and material database"
```

---

### Task 3: Milling Calculations

**Files:**
- Create: `src/calculations/milling.ts`
- Create: `tests/calculations/milling.test.ts`

- [ ] **Step 1: Write milling calculation tests**

Create `tests/calculations/milling.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { calculateMilling, calculateKeng } from '../../src/calculations/milling'
import type { MillingInputs } from '../../src/calculations/types'

const defaultInputs: MillingInputs = {
  D: 63,
  z: 4,
  fz: 0.3,
  ap: 3,
  ae: 20,
  kappa: 90,
  kc11: 2100,
  mc: 0.25,
  vc: 180,
  Keng: 1.7,
  Pmachine: 8,
}

describe('calculateKeng', () => {
  it('calculates Keng from ae and D', () => {
    const keng = calculateKeng(20, 63)
    // ae/D = 20/63 ≈ 0.317, φs = arccos(1 - 2*0.317) ≈ 68.7°
    expect(keng).toBeGreaterThan(1.0)
    expect(keng).toBeLessThan(3.0)
  })

  it('returns ~2.0 for full slot (ae = D)', () => {
    const keng = calculateKeng(63, 63)
    // φs = 180°, ze/z = 0.5, Keng relates to engagement
    expect(keng).toBeCloseTo(2.0, 0)
  })
})

describe('calculateMilling', () => {
  it('calculates spindle speed correctly', () => {
    const result = calculateMilling(defaultInputs)
    // n = (180 * 1000) / (π * 63) = 909.46
    expect(result.results.n).toBeCloseTo(909.46, 0)
  })

  it('calculates feed rate correctly', () => {
    const result = calculateMilling(defaultInputs)
    // vf = 0.3 * 4 * 909.46 = 1091.35
    expect(result.results.vf).toBeCloseTo(1091.35, 0)
  })

  it('calculates engagement angle', () => {
    const result = calculateMilling(defaultInputs)
    // φs = arccos(1 - 2*20/63) = arccos(0.365) ≈ 68.6°
    expect(result.results.phiS).toBeCloseTo(68.6, 0)
  })

  it('calculates simultaneously engaged teeth', () => {
    const result = calculateMilling(defaultInputs)
    // ze = 4 * 68.6/360 ≈ 0.76
    expect(result.results.ze).toBeCloseTo(0.76, 1)
  })

  it('calculates mean chip thickness', () => {
    const result = calculateMilling(defaultInputs)
    // hm = 0.3 * sin(90°) * (360/(π*68.6)) * (20/63)
    // = 0.3 * 1 * 1.670 * 0.317 = 0.159
    expect(result.results.hm).toBeCloseTo(0.159, 2)
  })

  it('calculates hmax for ae < D/2', () => {
    const result = calculateMilling(defaultInputs)
    // ae=20 < D/2=31.5, so hmax = fz * sin(κ) * sin(φs)
    // = 0.3 * 1 * sin(68.6°) = 0.279
    expect(result.results.hmax).toBeCloseTo(0.279, 2)
  })

  it('calculates hmax for ae >= D/2', () => {
    const input = { ...defaultInputs, ae: 40 }
    const result = calculateMilling(input)
    // ae=40 >= D/2=31.5, so hmax = fz * sin(κ) = 0.3
    expect(result.results.hmax).toBeCloseTo(0.3, 2)
  })

  it('calculates chip width', () => {
    const result = calculateMilling(defaultInputs)
    // b = ap / sin(κ) = 3 / sin(90°) = 3
    expect(result.results.b).toBeCloseTo(3, 2)
  })

  it('calculates main cutting force', () => {
    const result = calculateMilling(defaultInputs)
    // kc = 2100 * 0.159^(-0.25) = 2100 / 0.631 = 3327
    // Fc = 0.76 * 3 * 2100 * 0.159^(0.75) = 0.76 * 3 * 2100 * 0.238 = 1139
    expect(result.results.Fc).toBeGreaterThan(500)
    expect(result.results.Fc).toBeLessThan(3000)
  })

  it('calculates power and utilization', () => {
    const result = calculateMilling(defaultInputs)
    // P = Fc * vc / 60000
    expect(result.results.P).toBeGreaterThan(0)
    // utilization = P / 8 * 100
    expect(result.results.utilization).toBeGreaterThan(0)
  })

  it('calculates material removal rate', () => {
    const result = calculateMilling(defaultInputs)
    // Q = ap * ae * vf / 1000 = 3 * 20 * 1091.35 / 1000 = 65.48
    expect(result.results.Q).toBeCloseTo(65.48, 0)
  })

  it('returns calculation steps', () => {
    const result = calculateMilling(defaultInputs)
    expect(result.steps.length).toBe(16)
    expect(result.steps[0].name).toContain('Eingriffswinkel')
  })

  it('handles κ=45° correctly', () => {
    const input = { ...defaultInputs, kappa: 45 }
    const result = calculateMilling(input)
    // b = ap / sin(45°) = 3 / 0.707 = 4.24
    expect(result.results.b).toBeCloseTo(4.24, 1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /home/pascal/SPBapp && npx vitest run tests/calculations/milling.test.ts 2>&1 | tail -10
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement milling calculations**

Create `src/calculations/milling.ts`:

```typescript
import type { MillingInputs, MillingResults, CalculationStep } from './types'

const DEG_TO_RAD = Math.PI / 180

export function calculateKeng(ae: number, D: number): number {
  const ratio = ae / D
  const phiSRad = Math.acos(1 - 2 * ratio)
  const phiSDeg = phiSRad / DEG_TO_RAD
  // Keng = (360 / (π × φs)) × (ae/D) — correction factor for engagement arc
  return (360 / (Math.PI * phiSDeg)) * ratio
}

export function calculateMilling(input: MillingInputs): {
  results: MillingResults
  steps: CalculationStep[]
} {
  const steps: CalculationStep[] = []
  const kappaRad = input.kappa * DEG_TO_RAD

  // 1. Engagement angle
  const aeOverD = input.ae / input.D
  const phiSRad = Math.acos(1 - 2 * aeOverD)
  const phiS = phiSRad / DEG_TO_RAD
  steps.push({
    name: 'Eingriffswinkel φs',
    formula: 'φs = arccos(1 − 2·ae/D)',
    substituted: `φs = arccos(1 − 2·${input.ae}/${input.D})`,
    result: `${phiS.toFixed(2)}°`,
  })

  // 2. Simultaneously engaged teeth
  const ze = input.z * phiS / 360
  steps.push({
    name: 'Gleichzeitig schneidende Zähne ze',
    formula: 'ze = z × φs / 360',
    substituted: `ze = ${input.z} × ${phiS.toFixed(2)} / 360`,
    result: `${ze.toFixed(3)}`,
  })

  // 3. Spindle speed
  const n = (input.vc * 1000) / (Math.PI * input.D)
  steps.push({
    name: 'Drehzahl n',
    formula: 'n = (vc × 1000) / (π × D)',
    substituted: `n = (${input.vc} × 1000) / (π × ${input.D})`,
    result: `${n.toFixed(2)} U/min`,
  })

  // 4. Feed rate
  const vf = input.fz * input.z * n
  steps.push({
    name: 'Vorschubgeschwindigkeit vf',
    formula: 'vf = fz × z × n',
    substituted: `vf = ${input.fz} × ${input.z} × ${n.toFixed(2)}`,
    result: `${vf.toFixed(2)} mm/min`,
  })

  // 5. Mean chip thickness
  const hm = input.fz * Math.sin(kappaRad) * (360 / (Math.PI * phiS)) * aeOverD
  steps.push({
    name: 'Mittlere Spanungsdicke hm',
    formula: 'hm = fz × sin(κ) × (360 / (π × φs)) × (ae/D)',
    substituted: `hm = ${input.fz} × sin(${input.kappa}°) × (360 / (π × ${phiS.toFixed(2)})) × (${input.ae}/${input.D})`,
    result: `${hm.toFixed(4)} mm`,
  })

  // 6. Max chip thickness
  const hmax = input.ae >= input.D / 2
    ? input.fz * Math.sin(kappaRad)
    : input.fz * Math.sin(kappaRad) * Math.sin(phiSRad)
  const hmaxCondition = input.ae >= input.D / 2 ? 'ae ≥ D/2' : 'ae < D/2'
  const hmaxFormula = input.ae >= input.D / 2
    ? 'hmax = fz × sin(κ)'
    : 'hmax = fz × sin(κ) × sin(φs)'
  steps.push({
    name: 'Max. Spandicke hmax',
    formula: `${hmaxFormula}  (${hmaxCondition})`,
    substituted: input.ae >= input.D / 2
      ? `hmax = ${input.fz} × sin(${input.kappa}°)`
      : `hmax = ${input.fz} × sin(${input.kappa}°) × sin(${phiS.toFixed(2)}°)`,
    result: `${hmax.toFixed(4)} mm`,
  })

  // 7. Chip width
  const b = input.ap / Math.sin(kappaRad)
  steps.push({
    name: 'Spanbreite b',
    formula: 'b = ap / sin(κ)',
    substituted: `b = ${input.ap} / sin(${input.kappa}°)`,
    result: `${b.toFixed(2)} mm`,
  })

  // 8. Specific cutting force
  const kc = input.kc11 * Math.pow(hm, -input.mc)
  steps.push({
    name: 'Spez. Schnittkraft kc',
    formula: 'kc = kc1.1 × hm^(−mc)',
    substituted: `kc = ${input.kc11} × ${hm.toFixed(4)}^(−${input.mc})`,
    result: `${kc.toFixed(2)} N/mm²`,
  })

  // 9. Main cutting force
  const Fc = ze * b * input.kc11 * Math.pow(hm, 1 - input.mc)
  steps.push({
    name: 'Hauptschnittkraft Fc',
    formula: 'Fc = ze × b × kc1.1 × hm^(1−mc)',
    substituted: `Fc = ${ze.toFixed(3)} × ${b.toFixed(2)} × ${input.kc11} × ${hm.toFixed(4)}^(1−${input.mc})`,
    result: `${Fc.toFixed(2)} N`,
  })

  // 10. Feed force horizontal
  const Ff = Fc * Math.cos(kappaRad)
  steps.push({
    name: 'Vorschubkraft horizontal Ff',
    formula: 'Ff = Fc × cos(κ)',
    substituted: `Ff = ${Fc.toFixed(2)} × cos(${input.kappa}°)`,
    result: `${Ff.toFixed(2)} N`,
  })

  // 11. Feed force axial
  const Fa = Fc * Math.sin(kappaRad) * 0.4
  steps.push({
    name: 'Vorschubkraft axial Fa',
    formula: 'Fa = Fc × sin(κ) × 0.4',
    substituted: `Fa = ${Fc.toFixed(2)} × sin(${input.kappa}°) × 0.4`,
    result: `${Fa.toFixed(2)} N`,
  })

  // 12. Mean feed force
  const FfMean = Ff * 0.637
  steps.push({
    name: 'Mittlere Vorschubkraft Ff_mean',
    formula: 'Ff_mean = Ff × 2/π ≈ Ff × 0.637',
    substituted: `Ff_mean = ${Ff.toFixed(2)} × 0.637`,
    result: `${FfMean.toFixed(2)} N`,
  })

  // 13. Torque
  const M = Fc * input.D / 2000
  steps.push({
    name: 'Drehmoment M',
    formula: 'M = Fc × D / 2000',
    substituted: `M = ${Fc.toFixed(2)} × ${input.D} / 2000`,
    result: `${M.toFixed(2)} Nm`,
  })

  // 14. Spindle power
  const P = Fc * input.vc / 60000
  steps.push({
    name: 'Spindelleistung P',
    formula: 'P = Fc × vc / 60000',
    substituted: `P = ${Fc.toFixed(2)} × ${input.vc} / 60000`,
    result: `${P.toFixed(2)} kW`,
  })

  // 15. Machine utilization
  const utilization = (P / input.Pmachine) * 100
  steps.push({
    name: 'Maschinenauslastung',
    formula: 'Auslastung = P / P_masch × 100',
    substituted: `Auslastung = ${P.toFixed(2)} / ${input.Pmachine} × 100`,
    result: `${utilization.toFixed(1)}%`,
  })

  // 16. Material removal rate
  const Q = input.ap * input.ae * vf / 1000
  steps.push({
    name: 'Zeitspanvolumen Q',
    formula: 'Q = ap × ae × vf / 1000',
    substituted: `Q = ${input.ap} × ${input.ae} × ${vf.toFixed(2)} / 1000`,
    result: `${Q.toFixed(2)} cm³/min`,
  })

  return {
    results: { phiS, ze, n, vf, hm, hmax, b, kc, Fc, Ff, Fa, FfMean, M, P, utilization, Q },
    steps,
  }
}
```

- [ ] **Step 4: Run tests**

```bash
cd /home/pascal/SPBapp && npx vitest run tests/calculations/milling.test.ts 2>&1
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
cd /home/pascal/SPBapp
git add src/calculations/milling.ts tests/calculations/milling.test.ts
git commit -m "feat: implement milling (Fräsen) calculations with Kienzle model"
```

---

### Task 4: Turning Calculations

**Files:**
- Create: `src/calculations/turning.ts`
- Create: `tests/calculations/turning.test.ts`

- [ ] **Step 1: Write turning calculation tests**

Create `tests/calculations/turning.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { calculateTurning } from '../../src/calculations/turning'
import type { TurningInputs } from '../../src/calculations/types'

const defaultInputs: TurningInputs = {
  d: 50,
  vc: 150,
  f: 0.2,
  ap: 2,
  kappaR: 90,
  kc11: 2100,
  mc: 0.25,
  eta: 0.8,
  Pmachine: 8,
}

describe('calculateTurning', () => {
  it('calculates spindle speed correctly', () => {
    const result = calculateTurning(defaultInputs)
    // n = (150 * 1000) / (π * 50) = 954.93
    expect(result.results.n).toBeCloseTo(954.93, 0)
  })

  it('calculates feed velocity', () => {
    const result = calculateTurning(defaultInputs)
    // vf = 0.2 * 954.93 = 190.99
    expect(result.results.vf).toBeCloseTo(190.99, 0)
  })

  it('calculates chip thickness for κr=90°', () => {
    const result = calculateTurning(defaultInputs)
    // h = f * sin(90°) = 0.2
    expect(result.results.h).toBeCloseTo(0.2, 4)
  })

  it('calculates chip width for κr=90°', () => {
    const result = calculateTurning(defaultInputs)
    // b = ap / sin(90°) = 2
    expect(result.results.b).toBeCloseTo(2, 4)
  })

  it('calculates chip cross section', () => {
    const result = calculateTurning(defaultInputs)
    // A = ap * f = 2 * 0.2 = 0.4
    expect(result.results.A).toBeCloseTo(0.4, 4)
  })

  it('calculates specific cutting force', () => {
    const result = calculateTurning(defaultInputs)
    // kc = 2100 * 0.2^(-0.25) = 2100 / 0.6687 = 3140
    expect(result.results.kc).toBeCloseTo(3140, -1)
  })

  it('calculates cutting force', () => {
    const result = calculateTurning(defaultInputs)
    // Fc = kc * A = 3140 * 0.4 = 1256
    expect(result.results.Fc).toBeCloseTo(1256, -1)
  })

  it('calculates feed force for κr=90°', () => {
    const result = calculateTurning(defaultInputs)
    // Ff = Fc * (0.3 + 0.2 * cos(90°)) = Fc * 0.3
    expect(result.results.Ff).toBeCloseTo(result.results.Fc * 0.3, 0)
  })

  it('calculates passive force for κr=90°', () => {
    const result = calculateTurning(defaultInputs)
    // Fp = Fc * (0.2 + 0.2 * cos(90°)) = Fc * 0.2
    expect(result.results.Fp).toBeCloseTo(result.results.Fc * 0.2, 0)
  })

  it('calculates feed force for κr=45°', () => {
    const input = { ...defaultInputs, kappaR: 45 }
    const result = calculateTurning(input)
    // Ff = Fc * (0.3 + 0.2 * cos(45°)) = Fc * 0.441
    expect(result.results.Ff).toBeCloseTo(result.results.Fc * 0.4414, 0)
  })

  it('calculates cutting power', () => {
    const result = calculateTurning(defaultInputs)
    // Pc = Fc * vc / 60000
    expect(result.results.Pc).toBeCloseTo(result.results.Fc * 150 / 60000, 2)
  })

  it('calculates drive power with efficiency', () => {
    const result = calculateTurning(defaultInputs)
    // P = Pc / η
    expect(result.results.P).toBeCloseTo(result.results.Pc / 0.8, 2)
  })

  it('calculates torque', () => {
    const result = calculateTurning(defaultInputs)
    // M = Fc * d / 2000 = Fc * 50 / 2000
    expect(result.results.M).toBeCloseTo(result.results.Fc * 50 / 2000, 2)
  })

  it('calculates material removal rate', () => {
    const result = calculateTurning(defaultInputs)
    // Q = ap * f * vc = 2 * 0.2 * 150 = 60
    expect(result.results.Q).toBeCloseTo(60, 0)
  })

  it('calculates utilization', () => {
    const result = calculateTurning(defaultInputs)
    expect(result.results.utilization).toBeCloseTo((result.results.P / 8) * 100, 1)
  })

  it('returns 14 calculation steps', () => {
    const result = calculateTurning(defaultInputs)
    expect(result.steps.length).toBe(14)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /home/pascal/SPBapp && npx vitest run tests/calculations/turning.test.ts 2>&1 | tail -10
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement turning calculations**

Create `src/calculations/turning.ts`:

```typescript
import type { TurningInputs, TurningResults, CalculationStep } from './types'

const DEG_TO_RAD = Math.PI / 180

export function calculateTurning(input: TurningInputs): {
  results: TurningResults
  steps: CalculationStep[]
} {
  const steps: CalculationStep[] = []
  const kappaRad = input.kappaR * DEG_TO_RAD

  // 1. Spindle speed
  const n = (input.vc * 1000) / (Math.PI * input.d)
  steps.push({
    name: 'Drehzahl n',
    formula: 'n = (vc × 1000) / (π × d)',
    substituted: `n = (${input.vc} × 1000) / (π × ${input.d})`,
    result: `${n.toFixed(2)} U/min`,
  })

  // 2. Feed velocity
  const vf = input.f * n
  steps.push({
    name: 'Vorschubgeschwindigkeit vf',
    formula: 'vf = f × n',
    substituted: `vf = ${input.f} × ${n.toFixed(2)}`,
    result: `${vf.toFixed(2)} mm/min`,
  })

  // 3. Chip thickness
  const h = input.f * Math.sin(kappaRad)
  steps.push({
    name: 'Spanungsdicke h',
    formula: 'h = f × sin(κr)',
    substituted: `h = ${input.f} × sin(${input.kappaR}°)`,
    result: `${h.toFixed(4)} mm`,
  })

  // 4. Chip width
  const b = input.ap / Math.sin(kappaRad)
  steps.push({
    name: 'Spanungsbreite b',
    formula: 'b = ap / sin(κr)',
    substituted: `b = ${input.ap} / sin(${input.kappaR}°)`,
    result: `${b.toFixed(4)} mm`,
  })

  // 5. Chip cross section
  const A = input.ap * input.f
  steps.push({
    name: 'Spanungsquerschnitt A',
    formula: 'A = ap × f',
    substituted: `A = ${input.ap} × ${input.f}`,
    result: `${A.toFixed(4)} mm²`,
  })

  // 6. Specific cutting force
  const kc = input.kc11 * Math.pow(h, -input.mc)
  steps.push({
    name: 'Spez. Schnittkraft kc',
    formula: 'kc = kc1.1 × h^(−mc)',
    substituted: `kc = ${input.kc11} × ${h.toFixed(4)}^(−${input.mc})`,
    result: `${kc.toFixed(2)} N/mm²`,
  })

  // 7. Cutting force
  const Fc = kc * A
  steps.push({
    name: 'Schnittkraft Fc',
    formula: 'Fc = kc × A',
    substituted: `Fc = ${kc.toFixed(2)} × ${A.toFixed(4)}`,
    result: `${Fc.toFixed(2)} N`,
  })

  // 8. Feed force
  const ffFactor = 0.3 + 0.2 * Math.cos(kappaRad)
  const Ff = Fc * ffFactor
  steps.push({
    name: 'Vorschubkraft Ff',
    formula: 'Ff = Fc × (0.3 + 0.2 × cos(κr))',
    substituted: `Ff = ${Fc.toFixed(2)} × (0.3 + 0.2 × cos(${input.kappaR}°))`,
    result: `${Ff.toFixed(2)} N`,
  })

  // 9. Passive force
  const fpFactor = 0.2 + 0.2 * Math.cos(kappaRad)
  const Fp = Fc * fpFactor
  steps.push({
    name: 'Passivkraft Fp',
    formula: 'Fp = Fc × (0.2 + 0.2 × cos(κr))',
    substituted: `Fp = ${Fc.toFixed(2)} × (0.2 + 0.2 × cos(${input.kappaR}°))`,
    result: `${Fp.toFixed(2)} N`,
  })

  // 10. Cutting power
  const Pc = Fc * input.vc / 60000
  steps.push({
    name: 'Schnittleistung Pc',
    formula: 'Pc = Fc × vc / 60000',
    substituted: `Pc = ${Fc.toFixed(2)} × ${input.vc} / 60000`,
    result: `${Pc.toFixed(2)} kW`,
  })

  // 11. Drive power
  const P = Pc / input.eta
  steps.push({
    name: 'Antriebsleistung P',
    formula: 'P = Pc / η',
    substituted: `P = ${Pc.toFixed(2)} / ${input.eta}`,
    result: `${P.toFixed(2)} kW`,
  })

  // 12. Torque
  const torqueM = Fc * input.d / 2000
  steps.push({
    name: 'Drehmoment M',
    formula: 'M = Fc × d / 2000',
    substituted: `M = ${Fc.toFixed(2)} × ${input.d} / 2000`,
    result: `${torqueM.toFixed(2)} Nm`,
  })

  // 13. Material removal rate
  const Q = input.ap * input.f * input.vc
  steps.push({
    name: 'Zeitspanvolumen Q',
    formula: 'Q = ap × f × vc',
    substituted: `Q = ${input.ap} × ${input.f} × ${input.vc}`,
    result: `${Q.toFixed(2)} cm³/min`,
  })

  // 14. Machine utilization
  const utilization = (P / input.Pmachine) * 100
  steps.push({
    name: 'Maschinenauslastung',
    formula: 'Auslastung = P / P_masch × 100',
    substituted: `Auslastung = ${P.toFixed(2)} / ${input.Pmachine} × 100`,
    result: `${utilization.toFixed(1)}%`,
  })

  return {
    results: { n, vf, h, b, A, kc, Fc, Ff, Fp, Pc, P, M: torqueM, Q, utilization },
    steps,
  }
}
```

- [ ] **Step 4: Run tests**

```bash
cd /home/pascal/SPBapp && npx vitest run tests/calculations/turning.test.ts 2>&1
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
cd /home/pascal/SPBapp
git add src/calculations/turning.ts tests/calculations/turning.test.ts
git commit -m "feat: implement turning (Drehen) calculations with Kienzle model"
```

---

### Task 5: Drilling Calculations

**Files:**
- Create: `src/calculations/drilling.ts`
- Create: `tests/calculations/drilling.test.ts`

- [ ] **Step 1: Write drilling calculation tests**

Create `tests/calculations/drilling.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { calculateDrilling } from '../../src/calculations/drilling'
import type { DrillingInputs } from '../../src/calculations/types'

const defaultInputs: DrillingInputs = {
  d: 10,
  vc: 80,
  f: 0.15,
  z: 2,
  sigma: 118,
  l: 30,
  kc11: 2100,
  mc: 0.25,
  eta: 0.8,
  Pmachine: 8,
}

describe('calculateDrilling', () => {
  it('calculates half point angle', () => {
    const result = calculateDrilling(defaultInputs)
    expect(result.results.kappa).toBe(59)
  })

  it('calculates spindle speed', () => {
    const result = calculateDrilling(defaultInputs)
    // n = (80 * 1000) / (π * 10) = 2546.48
    expect(result.results.n).toBeCloseTo(2546.48, 0)
  })

  it('calculates feed per tooth', () => {
    const result = calculateDrilling(defaultInputs)
    // fz = 0.15 / 2 = 0.075
    expect(result.results.fz).toBeCloseTo(0.075, 4)
  })

  it('calculates feed velocity', () => {
    const result = calculateDrilling(defaultInputs)
    // vf = 0.15 * 2546.48 = 381.97
    expect(result.results.vf).toBeCloseTo(381.97, 0)
  })

  it('calculates chip thickness', () => {
    const result = calculateDrilling(defaultInputs)
    // h = fz * sin(59°) = 0.075 * 0.8572 = 0.0643
    expect(result.results.h).toBeCloseTo(0.0643, 3)
  })

  it('calculates chip width', () => {
    const result = calculateDrilling(defaultInputs)
    // b = d / (2 * sin(59°)) = 10 / (2 * 0.8572) = 5.833
    expect(result.results.b).toBeCloseTo(5.833, 2)
  })

  it('calculates chip cross section', () => {
    const result = calculateDrilling(defaultInputs)
    // A = b * h = 5.833 * 0.0643 = 0.375
    expect(result.results.A).toBeCloseTo(0.375, 2)
  })

  it('calculates cutting force', () => {
    const result = calculateDrilling(defaultInputs)
    // kc = 2100 * 0.0643^(-0.25) = 2100 / 0.5035 = 4170.8
    // Fc = 2 * 4170.8 * 0.375 = 3128
    expect(result.results.Fc).toBeGreaterThan(2000)
    expect(result.results.Fc).toBeLessThan(5000)
  })

  it('calculates thrust force', () => {
    const result = calculateDrilling(defaultInputs)
    // Ff = 0.5 * Fc
    expect(result.results.Ff).toBeCloseTo(result.results.Fc * 0.5, 0)
  })

  it('calculates torque (d/4 for drilling)', () => {
    const result = calculateDrilling(defaultInputs)
    // M = Fc * d / 4000
    expect(result.results.M).toBeCloseTo(result.results.Fc * 10 / 4000, 2)
  })

  it('calculates machining time', () => {
    const result = calculateDrilling(defaultInputs)
    // th = l / vf = 30 / 381.97 = 0.0785
    expect(result.results.th).toBeCloseTo(30 / result.results.vf, 3)
  })

  it('calculates material removal rate', () => {
    const result = calculateDrilling(defaultInputs)
    // Q = (π * d² * f * n) / 4000
    const expectedQ = (Math.PI * 100 * 0.15 * result.results.n) / 4000
    expect(result.results.Q).toBeCloseTo(expectedQ, 1)
  })

  it('calculates utilization', () => {
    const result = calculateDrilling(defaultInputs)
    expect(result.results.utilization).toBeCloseTo((result.results.P / 8) * 100, 1)
  })

  it('returns 16 calculation steps', () => {
    const result = calculateDrilling(defaultInputs)
    expect(result.steps.length).toBe(16)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /home/pascal/SPBapp && npx vitest run tests/calculations/drilling.test.ts 2>&1 | tail -10
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement drilling calculations**

Create `src/calculations/drilling.ts`:

```typescript
import type { DrillingInputs, DrillingResults, CalculationStep } from './types'

const DEG_TO_RAD = Math.PI / 180

export function calculateDrilling(input: DrillingInputs): {
  results: DrillingResults
  steps: CalculationStep[]
} {
  const steps: CalculationStep[] = []

  // 1. Half point angle
  const kappa = input.sigma / 2
  const kappaRad = kappa * DEG_TO_RAD
  steps.push({
    name: 'Halber Spitzenwinkel κ',
    formula: 'κ = σ / 2',
    substituted: `κ = ${input.sigma} / 2`,
    result: `${kappa}°`,
  })

  // 2. Spindle speed
  const n = (input.vc * 1000) / (Math.PI * input.d)
  steps.push({
    name: 'Drehzahl n',
    formula: 'n = (vc × 1000) / (π × d)',
    substituted: `n = (${input.vc} × 1000) / (π × ${input.d})`,
    result: `${n.toFixed(2)} U/min`,
  })

  // 3. Feed per tooth
  const fz = input.f / input.z
  steps.push({
    name: 'Vorschub pro Schneide fz',
    formula: 'fz = f / z',
    substituted: `fz = ${input.f} / ${input.z}`,
    result: `${fz.toFixed(4)} mm`,
  })

  // 4. Feed velocity
  const vf = input.f * n
  steps.push({
    name: 'Vorschubgeschwindigkeit vf',
    formula: 'vf = f × n',
    substituted: `vf = ${input.f} × ${n.toFixed(2)}`,
    result: `${vf.toFixed(2)} mm/min`,
  })

  // 5. Chip thickness
  const h = fz * Math.sin(kappaRad)
  steps.push({
    name: 'Spanungsdicke h',
    formula: 'h = fz × sin(κ)',
    substituted: `h = ${fz.toFixed(4)} × sin(${kappa}°)`,
    result: `${h.toFixed(4)} mm`,
  })

  // 6. Chip width
  const b = input.d / (2 * Math.sin(kappaRad))
  steps.push({
    name: 'Spanungsbreite b',
    formula: 'b = d / (2 × sin(κ))',
    substituted: `b = ${input.d} / (2 × sin(${kappa}°))`,
    result: `${b.toFixed(4)} mm`,
  })

  // 7. Chip cross section
  const A = b * h
  steps.push({
    name: 'Spanungsquerschnitt A',
    formula: 'A = b × h',
    substituted: `A = ${b.toFixed(4)} × ${h.toFixed(4)}`,
    result: `${A.toFixed(4)} mm²`,
  })

  // 8. Specific cutting force
  const kc = input.kc11 * Math.pow(h, -input.mc)
  steps.push({
    name: 'Spez. Schnittkraft kc',
    formula: 'kc = kc1.1 × h^(−mc)',
    substituted: `kc = ${input.kc11} × ${h.toFixed(4)}^(−${input.mc})`,
    result: `${kc.toFixed(2)} N/mm²`,
  })

  // 9. Cutting force
  const Fc = input.z * kc * A
  steps.push({
    name: 'Schnittkraft Fc',
    formula: 'Fc = z × kc × A',
    substituted: `Fc = ${input.z} × ${kc.toFixed(2)} × ${A.toFixed(4)}`,
    result: `${Fc.toFixed(2)} N`,
  })

  // 10. Thrust force (axial)
  const Ff = 0.5 * Fc
  steps.push({
    name: 'Vorschubkraft (axial) Ff',
    formula: 'Ff ≈ 0.5 × Fc',
    substituted: `Ff = 0.5 × ${Fc.toFixed(2)}`,
    result: `${Ff.toFixed(2)} N`,
  })

  // 11. Torque
  const torqueM = Fc * input.d / 4000
  steps.push({
    name: 'Drehmoment M',
    formula: 'M = Fc × d / 4000',
    substituted: `M = ${Fc.toFixed(2)} × ${input.d} / 4000`,
    result: `${torqueM.toFixed(2)} Nm`,
  })

  // 12. Cutting power
  const Pc = Fc * input.vc / 60000
  steps.push({
    name: 'Schnittleistung Pc',
    formula: 'Pc = Fc × vc / 60000',
    substituted: `Pc = ${Fc.toFixed(2)} × ${input.vc} / 60000`,
    result: `${Pc.toFixed(2)} kW`,
  })

  // 13. Drive power
  const P = Pc / input.eta
  steps.push({
    name: 'Antriebsleistung P',
    formula: 'P = Pc / η',
    substituted: `P = ${Pc.toFixed(2)} / ${input.eta}`,
    result: `${P.toFixed(2)} kW`,
  })

  // 14. Material removal rate
  const Q = (Math.PI * input.d * input.d * input.f * n) / 4000
  steps.push({
    name: 'Zeitspanvolumen Q',
    formula: 'Q = (π × d² × f × n) / 4000',
    substituted: `Q = (π × ${input.d}² × ${input.f} × ${n.toFixed(2)}) / 4000`,
    result: `${Q.toFixed(2)} cm³/min`,
  })

  // 15. Machining time
  const th = input.l / vf
  steps.push({
    name: 'Bearbeitungszeit th',
    formula: 'th = l / vf',
    substituted: `th = ${input.l} / ${vf.toFixed(2)}`,
    result: `${th.toFixed(3)} min`,
  })

  // 16. Machine utilization
  const utilization = (P / input.Pmachine) * 100
  steps.push({
    name: 'Maschinenauslastung',
    formula: 'Auslastung = P / P_masch × 100',
    substituted: `Auslastung = ${P.toFixed(2)} / ${input.Pmachine} × 100`,
    result: `${utilization.toFixed(1)}%`,
  })

  return {
    results: { kappa, n, fz, vf, h, b, A, kc, Fc, Ff, M: torqueM, Pc, P, Q, th, utilization },
    steps,
  }
}
```

- [ ] **Step 4: Run tests**

```bash
cd /home/pascal/SPBapp && npx vitest run tests/calculations/drilling.test.ts 2>&1
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
cd /home/pascal/SPBapp
git add src/calculations/drilling.ts tests/calculations/drilling.test.ts
git commit -m "feat: implement drilling (Bohren) calculations with Kienzle model"
```

---

### Task 6: i18n Setup (German + English)

**Files:**
- Create: `src/i18n/index.ts`
- Create: `src/i18n/de.json`
- Create: `src/i18n/en.json`

- [ ] **Step 1: Create i18n configuration**

Create `src/i18n/index.ts`:

```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import de from './de.json'
import en from './en.json'

i18n.use(initReactI18next).init({
  resources: {
    de: { translation: de },
    en: { translation: en },
  },
  lng: 'de',
  fallbackLng: 'de',
  interpolation: { escapeValue: false },
})

export default i18n
```

- [ ] **Step 2: Create German translations**

Create `src/i18n/de.json`:

```json
{
  "app": {
    "title": "SPBapp",
    "subtitle": "Schnittdatenparameterberechnung"
  },
  "tabs": {
    "milling": "Fräsen",
    "turning": "Drehen",
    "drilling": "Bohren"
  },
  "common": {
    "inputs": "Eingabe",
    "results": "Ergebnisse",
    "steps": "Berechnungsschritte",
    "material": "Werkstoff",
    "custom": "Benutzerdefiniert",
    "machinePower": "Maschinenleistung",
    "utilization": "Maschinenauslastung",
    "warning": "Warnung: Maschinenauslastung über 100%!",
    "formula": "Formel",
    "values": "Eingesetzte Werte",
    "result": "Ergebnis",
    "kengInfo": "Keng-Referenztabelle",
    "efficiency": "Wirkungsgrad"
  },
  "milling": {
    "title": "Fräsen (Wendeplattenfräser)",
    "D": "Fräserdurchmesser D",
    "z": "Schneidenzahl z",
    "fz": "Vorschub pro Zahn fz",
    "ap": "Schnitttiefe ap",
    "ae": "Eingriffsbreite ae",
    "kappa": "Kappawinkel κ",
    "kc11": "Spez. Schnittkraft kc1.1",
    "mc": "Exponent mc",
    "vc": "Schnittgeschwindigkeit vc",
    "Keng": "Eingriffsfaktor Keng",
    "phiS": "Eingriffswinkel φs",
    "ze": "Gleichz. schneidende Zähne ze",
    "n": "Drehzahl n",
    "vf": "Vorschubgeschwindigkeit vf",
    "hm": "Mittlere Spanungsdicke hm",
    "hmax": "Max. Spandicke hmax",
    "b": "Spanbreite b",
    "kc": "Spez. Schnittkraft kc",
    "Fc": "Hauptschnittkraft Fc",
    "Ff": "Vorschubkraft horizontal Ff",
    "Fa": "Vorschubkraft axial Fa",
    "FfMean": "Mittl. Vorschubkraft Ff_mean",
    "M": "Drehmoment M",
    "P": "Spindelleistung P",
    "Q": "Zeitspanvolumen Q"
  },
  "turning": {
    "title": "Drehen",
    "d": "Werkstückdurchmesser d",
    "vc": "Schnittgeschwindigkeit vc",
    "f": "Vorschub f",
    "ap": "Schnitttiefe ap",
    "kappaR": "Einstellwinkel κr",
    "kc11": "Spez. Schnittkraft kc1.1",
    "mc": "Exponent mc",
    "n": "Drehzahl n",
    "vf": "Vorschubgeschwindigkeit vf",
    "h": "Spanungsdicke h",
    "b": "Spanungsbreite b",
    "A": "Spanungsquerschnitt A",
    "kc": "Spez. Schnittkraft kc",
    "Fc": "Schnittkraft Fc",
    "Ff": "Vorschubkraft Ff",
    "Fp": "Passivkraft Fp",
    "Pc": "Schnittleistung Pc",
    "P": "Antriebsleistung P",
    "M": "Drehmoment M",
    "Q": "Zeitspanvolumen Q"
  },
  "drilling": {
    "title": "Bohren (Spiralbohrer)",
    "d": "Bohrdurchmesser d",
    "vc": "Schnittgeschwindigkeit vc",
    "f": "Vorschub pro Umdrehung f",
    "z": "Schneidenzahl z",
    "sigma": "Spitzenwinkel σ",
    "l": "Bohrtiefe l",
    "kc11": "Spez. Schnittkraft kc1.1",
    "mc": "Exponent mc",
    "kappa": "Halber Spitzenwinkel κ",
    "n": "Drehzahl n",
    "fz": "Vorschub pro Schneide fz",
    "vf": "Vorschubgeschwindigkeit vf",
    "h": "Spanungsdicke h",
    "b": "Spanungsbreite b",
    "A": "Spanungsquerschnitt A",
    "kc": "Spez. Schnittkraft kc",
    "Fc": "Schnittkraft Fc",
    "Ff": "Vorschubkraft (axial) Ff",
    "M": "Drehmoment M",
    "Pc": "Schnittleistung Pc",
    "P": "Antriebsleistung P",
    "Q": "Zeitspanvolumen Q",
    "th": "Bearbeitungszeit th"
  },
  "units": {
    "mm": "mm",
    "deg": "°",
    "Nmm2": "N/mm²",
    "mmin": "m/min",
    "kW": "kW",
    "N": "N",
    "Nm": "Nm",
    "rpm": "U/min",
    "mmmin": "mm/min",
    "cm3min": "cm³/min",
    "min": "min",
    "percent": "%"
  },
  "kengTable": {
    "title": "Eingriffsfaktor-Referenz",
    "slotting": "Nutfräsen (ae ≈ D)",
    "fifty": "50% Eingriff",
    "thirty": "30% Eingriff",
    "face": "Planfräsen (10–20%)",
    "highFeed": "High Feed Fräsen"
  },
  "theme": {
    "light": "Hell",
    "dark": "Dunkel",
    "system": "System"
  }
}
```

- [ ] **Step 3: Create English translations**

Create `src/i18n/en.json`:

```json
{
  "app": {
    "title": "SPBapp",
    "subtitle": "Cutting Parameter Calculator"
  },
  "tabs": {
    "milling": "Milling",
    "turning": "Turning",
    "drilling": "Drilling"
  },
  "common": {
    "inputs": "Input",
    "results": "Results",
    "steps": "Calculation Steps",
    "material": "Material",
    "custom": "Custom",
    "machinePower": "Machine Power",
    "utilization": "Machine Utilization",
    "warning": "Warning: Machine utilization over 100%!",
    "formula": "Formula",
    "values": "Substituted Values",
    "result": "Result",
    "kengInfo": "Keng Reference Table",
    "efficiency": "Efficiency"
  },
  "milling": {
    "title": "Milling (Indexable Insert)",
    "D": "Cutter Diameter D",
    "z": "Number of Teeth z",
    "fz": "Feed per Tooth fz",
    "ap": "Depth of Cut ap",
    "ae": "Width of Cut ae",
    "kappa": "Lead Angle κ",
    "kc11": "Spec. Cutting Force kc1.1",
    "mc": "Exponent mc",
    "vc": "Cutting Speed vc",
    "Keng": "Engagement Factor Keng",
    "phiS": "Engagement Angle φs",
    "ze": "Simultaneously Engaged Teeth ze",
    "n": "Spindle Speed n",
    "vf": "Feed Rate vf",
    "hm": "Mean Chip Thickness hm",
    "hmax": "Max. Chip Thickness hmax",
    "b": "Chip Width b",
    "kc": "Spec. Cutting Force kc",
    "Fc": "Main Cutting Force Fc",
    "Ff": "Feed Force (horizontal) Ff",
    "Fa": "Feed Force (axial) Fa",
    "FfMean": "Mean Feed Force Ff_mean",
    "M": "Torque M",
    "P": "Spindle Power P",
    "Q": "Material Removal Rate Q"
  },
  "turning": {
    "title": "Turning",
    "d": "Workpiece Diameter d",
    "vc": "Cutting Speed vc",
    "f": "Feed f",
    "ap": "Depth of Cut ap",
    "kappaR": "Tool Cutting Edge Angle κr",
    "kc11": "Spec. Cutting Force kc1.1",
    "mc": "Exponent mc",
    "n": "Spindle Speed n",
    "vf": "Feed Rate vf",
    "h": "Chip Thickness h",
    "b": "Chip Width b",
    "A": "Chip Cross Section A",
    "kc": "Spec. Cutting Force kc",
    "Fc": "Cutting Force Fc",
    "Ff": "Feed Force Ff",
    "Fp": "Passive Force Fp",
    "Pc": "Cutting Power Pc",
    "P": "Drive Power P",
    "M": "Torque M",
    "Q": "Material Removal Rate Q"
  },
  "drilling": {
    "title": "Drilling (Twist Drill)",
    "d": "Drill Diameter d",
    "vc": "Cutting Speed vc",
    "f": "Feed per Revolution f",
    "z": "Number of Cutting Edges z",
    "sigma": "Point Angle σ",
    "l": "Drilling Depth l",
    "kc11": "Spec. Cutting Force kc1.1",
    "mc": "Exponent mc",
    "kappa": "Half Point Angle κ",
    "n": "Spindle Speed n",
    "fz": "Feed per Tooth fz",
    "vf": "Feed Rate vf",
    "h": "Chip Thickness h",
    "b": "Chip Width b",
    "A": "Chip Cross Section A",
    "kc": "Spec. Cutting Force kc",
    "Fc": "Cutting Force Fc",
    "Ff": "Thrust Force (axial) Ff",
    "M": "Torque M",
    "Pc": "Cutting Power Pc",
    "P": "Drive Power P",
    "Q": "Material Removal Rate Q",
    "th": "Machining Time th"
  },
  "units": {
    "mm": "mm",
    "deg": "°",
    "Nmm2": "N/mm²",
    "mmin": "m/min",
    "kW": "kW",
    "N": "N",
    "Nm": "Nm",
    "rpm": "RPM",
    "mmmin": "mm/min",
    "cm3min": "cm³/min",
    "min": "min",
    "percent": "%"
  },
  "kengTable": {
    "title": "Engagement Factor Reference",
    "slotting": "Slotting (ae ≈ D)",
    "fifty": "50% Engagement",
    "thirty": "30% Engagement",
    "face": "Face Milling (10–20%)",
    "highFeed": "High Feed Milling"
  },
  "theme": {
    "light": "Light",
    "dark": "Dark",
    "system": "System"
  }
}
```

- [ ] **Step 4: Add i18n import to main.tsx**

Update `src/main.tsx` — add this import before the App import:

```tsx
import './i18n'
```

Full file:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 5: Verify build works**

```bash
cd /home/pascal/SPBapp && npx tsc --noEmit 2>&1 | tail -10
```

Expected: No errors (or only non-blocking warnings).

- [ ] **Step 6: Commit**

```bash
cd /home/pascal/SPBapp
git add src/i18n/ src/main.tsx
git commit -m "feat: add i18n with German and English translations"
```

---

### Task 7: Theme Hook

**Files:**
- Create: `src/hooks/useTheme.ts`

- [ ] **Step 1: Create theme hook**

Create `src/hooks/useTheme.ts`:

```typescript
import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'system'
  })

  useEffect(() => {
    localStorage.setItem('theme', theme)

    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else if (theme === 'light') {
      root.classList.remove('dark')
    } else {
      // system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  }, [theme])

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  return { theme, setTheme }
}
```

- [ ] **Step 2: Commit**

```bash
cd /home/pascal/SPBapp
git add src/hooks/useTheme.ts
git commit -m "feat: add dark/light/system theme hook"
```

---

### Task 8: Shared UI Components

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/TabNavigation.tsx`
- Create: `src/components/InputField.tsx`
- Create: `src/components/MaterialSelect.tsx`
- Create: `src/components/ResultCard.tsx`
- Create: `src/components/ResultsPanel.tsx`
- Create: `src/components/CalculationSteps.tsx`
- Create: `src/components/KengInfo.tsx`

- [ ] **Step 1: Create Header component**

Create `src/components/Header.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { useTheme } from '../hooks/useTheme'

type Theme = 'light' | 'dark' | 'system'

export function Header() {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()

  const themes: { value: Theme; label: string }[] = [
    { value: 'light', label: t('theme.light') },
    { value: 'dark', label: t('theme.dark') },
    { value: 'system', label: t('theme.system') },
  ]

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">{t('app.title')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('app.subtitle')}</p>
      </div>
      <div className="flex items-center gap-3">
        {/* Language toggle */}
        <div className="flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600">
          <button
            onClick={() => i18n.changeLanguage('de')}
            className={`px-2 py-1 text-sm ${i18n.language === 'de' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            DE
          </button>
          <button
            onClick={() => i18n.changeLanguage('en')}
            className={`px-2 py-1 text-sm ${i18n.language === 'en' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            EN
          </button>
        </div>
        {/* Theme toggle */}
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as Theme)}
          className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
        >
          {themes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Create TabNavigation component**

Create `src/components/TabNavigation.tsx`:

```tsx
import { useTranslation } from 'react-i18next'

export type Tab = 'milling' | 'turning' | 'drilling'

interface TabNavigationProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const { t } = useTranslation()

  const tabs: { id: Tab; label: string }[] = [
    { id: 'milling', label: t('tabs.milling') },
    { id: 'turning', label: t('tabs.turning') },
    { id: 'drilling', label: t('tabs.drilling') },
  ]

  return (
    <nav className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
```

- [ ] **Step 3: Create InputField component**

Create `src/components/InputField.tsx`:

```tsx
interface InputFieldProps {
  label: string
  value: number
  unit: string
  onChange: (value: number) => void
  step?: number
  min?: number
  max?: number
}

export function InputField({ label, value, unit, onChange, step = 1, min, max }: InputFieldProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="flex-1 text-sm text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        step={step}
        min={min}
        max={max}
        className="w-24 px-2 py-1 text-sm text-right border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <span className="w-14 text-sm text-gray-500 dark:text-gray-400">{unit}</span>
    </div>
  )
}
```

- [ ] **Step 4: Create MaterialSelect component**

Create `src/components/MaterialSelect.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { materials } from '../data/materials'

interface MaterialSelectProps {
  selectedId: string
  onSelect: (id: string, kc11: number | null, mc: number | null) => void
}

export function MaterialSelect({ selectedId, onSelect }: MaterialSelectProps) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2">
      <label className="flex-1 text-sm text-gray-700 dark:text-gray-300">{t('common.material')}</label>
      <select
        value={selectedId}
        onChange={(e) => {
          const mat = materials.find((m) => m.id === e.target.value)
          if (mat) onSelect(mat.id, mat.kc11, mat.mc)
        }}
        className="w-52 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      >
        {materials.map((m) => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>
    </div>
  )
}
```

- [ ] **Step 5: Create ResultCard component**

Create `src/components/ResultCard.tsx`:

```tsx
interface ResultCardProps {
  label: string
  value: number
  unit: string
  decimals?: number
  warning?: boolean
}

export function ResultCard({ label, value, unit, decimals = 2, warning = false }: ResultCardProps) {
  return (
    <div className={`p-3 rounded-lg border ${
      warning
        ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
    }`}>
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</div>
      <div className={`text-lg font-semibold ${
        warning ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'
      }`}>
        {value.toFixed(decimals)} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{unit}</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Create ResultsPanel component**

Create `src/components/ResultsPanel.tsx`:

```tsx
import { useTranslation } from 'react-i18next'
import { ResultCard } from './ResultCard'

interface ResultItem {
  labelKey: string
  value: number
  unit: string
  decimals?: number
}

interface ResultsPanelProps {
  results: ResultItem[]
  utilization: number
}

export function ResultsPanel({ results, utilization }: ResultsPanelProps) {
  const { t } = useTranslation()

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{t('common.results')}</h3>
      {utilization > 100 && (
        <div className="mb-3 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm rounded">
          {t('common.warning')}
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        {results.map((r) => (
          <ResultCard
            key={r.labelKey}
            label={t(r.labelKey)}
            value={r.value}
            unit={r.unit}
            decimals={r.decimals ?? 2}
            warning={r.labelKey.includes('utilization') && utilization > 100}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Create CalculationSteps component**

Create `src/components/CalculationSteps.tsx`:

```tsx
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { CalculationStep } from '../calculations/types'

interface CalculationStepsProps {
  steps: CalculationStep[]
}

export function CalculationSteps({ steps }: CalculationStepsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <span>{t('common.steps')}</span>
        <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm">
              <div className="font-medium text-gray-800 dark:text-gray-200">
                {i + 1}. {step.name}
              </div>
              <div className="mt-1 text-gray-500 dark:text-gray-400 font-mono text-xs">
                {t('common.formula')}: {step.formula}
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-mono text-xs">
                {t('common.values')}: {step.substituted}
              </div>
              <div className="text-blue-600 dark:text-blue-400 font-mono text-xs font-semibold">
                = {step.result}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 8: Create KengInfo component**

Create `src/components/KengInfo.tsx`:

```tsx
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const kengData = [
  { key: 'slotting', range: '2.0 – 2.5' },
  { key: 'fifty', range: '1.7 – 2.0' },
  { key: 'thirty', range: '1.4 – 1.7' },
  { key: 'face', range: '1.2 – 1.5' },
  { key: 'highFeed', range: '1.1 – 1.3' },
]

export function KengInfo() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-blue-500 hover:text-blue-700 text-xs ml-1"
        title={t('kengTable.title')}
      >
        ⓘ
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 right-0 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
          <div className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">{t('kengTable.title')}</div>
          <table className="w-full text-xs">
            <tbody>
              {kengData.map((row) => (
                <tr key={row.key} className="border-t border-gray-100 dark:border-gray-700">
                  <td className="py-1 text-gray-600 dark:text-gray-400">{t(`kengTable.${row.key}`)}</td>
                  <td className="py-1 text-right font-mono text-gray-800 dark:text-gray-200">{row.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 9: Commit**

```bash
cd /home/pascal/SPBapp
git add src/components/ src/hooks/
git commit -m "feat: add shared UI components (Header, Tabs, InputField, ResultCard, etc.)"
```

---

### Task 9: Milling Tab

**Files:**
- Create: `src/components/MillingTab.tsx`

- [ ] **Step 1: Create MillingTab component**

Create `src/components/MillingTab.tsx`:

```tsx
import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { InputField } from './InputField'
import { MaterialSelect } from './MaterialSelect'
import { ResultsPanel } from './ResultsPanel'
import { CalculationSteps } from './CalculationSteps'
import { KengInfo } from './KengInfo'
import { calculateMilling, calculateKeng } from '../calculations/milling'
import type { MillingInputs } from '../calculations/types'

export function MillingTab() {
  const { t } = useTranslation()
  const [materialId, setMaterialId] = useState('42crmo4')
  const [inputs, setInputs] = useState<MillingInputs>({
    D: 63, z: 4, fz: 0.3, ap: 3, ae: 20, kappa: 90,
    kc11: 2100, mc: 0.25, vc: 180, Keng: 1.7, Pmachine: 8,
  })

  const update = (key: keyof MillingInputs, value: number) => {
    const newInputs = { ...inputs, [key]: value }
    // Auto-calculate Keng when ae or D changes
    if (key === 'ae' || key === 'D') {
      newInputs.Keng = parseFloat(calculateKeng(newInputs.ae, newInputs.D).toFixed(3))
    }
    setInputs(newInputs)
  }

  const handleMaterial = (id: string, kc11: number | null, mc: number | null) => {
    setMaterialId(id)
    if (kc11 !== null && mc !== null) {
      setInputs((prev) => ({ ...prev, kc11, mc }))
    }
  }

  const { results, steps } = useMemo(() => calculateMilling(inputs), [inputs])

  const resultItems = [
    { labelKey: 'milling.phiS', value: results.phiS, unit: '°' },
    { labelKey: 'milling.ze', value: results.ze, unit: '', decimals: 3 },
    { labelKey: 'milling.n', value: results.n, unit: t('units.rpm') },
    { labelKey: 'milling.vf', value: results.vf, unit: t('units.mmmin') },
    { labelKey: 'milling.hm', value: results.hm, unit: t('units.mm'), decimals: 4 },
    { labelKey: 'milling.hmax', value: results.hmax, unit: t('units.mm'), decimals: 4 },
    { labelKey: 'milling.b', value: results.b, unit: t('units.mm') },
    { labelKey: 'milling.kc', value: results.kc, unit: t('units.Nmm2') },
    { labelKey: 'milling.Fc', value: results.Fc, unit: t('units.N') },
    { labelKey: 'milling.Ff', value: results.Ff, unit: t('units.N') },
    { labelKey: 'milling.Fa', value: results.Fa, unit: t('units.N') },
    { labelKey: 'milling.FfMean', value: results.FfMean, unit: t('units.N') },
    { labelKey: 'milling.M', value: results.M, unit: t('units.Nm') },
    { labelKey: 'milling.P', value: results.P, unit: t('units.kW') },
    { labelKey: 'common.utilization', value: results.utilization, unit: t('units.percent'), decimals: 1 },
    { labelKey: 'milling.Q', value: results.Q, unit: t('units.cm3min') },
  ]

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">{t('milling.title')}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('common.inputs')}</h3>
          <MaterialSelect selectedId={materialId} onSelect={handleMaterial} />
          <InputField label={t('milling.D')} value={inputs.D} unit="mm" onChange={(v) => update('D', v)} step={1} />
          <InputField label={t('milling.z')} value={inputs.z} unit="" onChange={(v) => update('z', v)} step={1} min={1} />
          <InputField label={t('milling.fz')} value={inputs.fz} unit="mm" onChange={(v) => update('fz', v)} step={0.01} />
          <InputField label={t('milling.ap')} value={inputs.ap} unit="mm" onChange={(v) => update('ap', v)} step={0.5} />
          <InputField label={t('milling.ae')} value={inputs.ae} unit="mm" onChange={(v) => update('ae', v)} step={1} />
          <InputField label={t('milling.kappa')} value={inputs.kappa} unit="°" onChange={(v) => update('kappa', v)} step={1} />
          <InputField label={t('milling.kc11')} value={inputs.kc11} unit="N/mm²" onChange={(v) => update('kc11', v)} step={10} />
          <InputField label={t('milling.mc')} value={inputs.mc} unit="" onChange={(v) => update('mc', v)} step={0.01} />
          <InputField label={t('milling.vc')} value={inputs.vc} unit="m/min" onChange={(v) => update('vc', v)} step={5} />
          <div className="flex items-center">
            <div className="flex-1">
              <InputField label={t('milling.Keng')} value={inputs.Keng} unit="" onChange={(v) => update('Keng', v)} step={0.1} />
            </div>
            <KengInfo />
          </div>
          <InputField label={t('common.machinePower')} value={inputs.Pmachine} unit="kW" onChange={(v) => update('Pmachine', v)} step={0.5} />
        </div>
        {/* Results */}
        <ResultsPanel results={resultItems} utilization={results.utilization} />
      </div>
      <CalculationSteps steps={steps} />
    </div>
  )
}
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
cd /home/pascal/SPBapp && npx tsc --noEmit 2>&1 | tail -10
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
cd /home/pascal/SPBapp
git add src/components/MillingTab.tsx
git commit -m "feat: add milling tab UI with inputs, results, and calculation steps"
```

---

### Task 10: Turning Tab

**Files:**
- Create: `src/components/TurningTab.tsx`

- [ ] **Step 1: Create TurningTab component**

Create `src/components/TurningTab.tsx`:

```tsx
import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { InputField } from './InputField'
import { MaterialSelect } from './MaterialSelect'
import { ResultsPanel } from './ResultsPanel'
import { CalculationSteps } from './CalculationSteps'
import { calculateTurning } from '../calculations/turning'
import type { TurningInputs } from '../calculations/types'

export function TurningTab() {
  const { t } = useTranslation()
  const [materialId, setMaterialId] = useState('42crmo4')
  const [inputs, setInputs] = useState<TurningInputs>({
    d: 50, vc: 150, f: 0.2, ap: 2, kappaR: 90,
    kc11: 2100, mc: 0.25, eta: 0.8, Pmachine: 8,
  })

  const update = (key: keyof TurningInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }))
  }

  const handleMaterial = (id: string, kc11: number | null, mc: number | null) => {
    setMaterialId(id)
    if (kc11 !== null && mc !== null) {
      setInputs((prev) => ({ ...prev, kc11, mc }))
    }
  }

  const { results, steps } = useMemo(() => calculateTurning(inputs), [inputs])

  const resultItems = [
    { labelKey: 'turning.n', value: results.n, unit: t('units.rpm') },
    { labelKey: 'turning.vf', value: results.vf, unit: t('units.mmmin') },
    { labelKey: 'turning.h', value: results.h, unit: t('units.mm'), decimals: 4 },
    { labelKey: 'turning.b', value: results.b, unit: t('units.mm') },
    { labelKey: 'turning.A', value: results.A, unit: 'mm²', decimals: 4 },
    { labelKey: 'turning.kc', value: results.kc, unit: t('units.Nmm2') },
    { labelKey: 'turning.Fc', value: results.Fc, unit: t('units.N') },
    { labelKey: 'turning.Ff', value: results.Ff, unit: t('units.N') },
    { labelKey: 'turning.Fp', value: results.Fp, unit: t('units.N') },
    { labelKey: 'turning.Pc', value: results.Pc, unit: t('units.kW') },
    { labelKey: 'turning.P', value: results.P, unit: t('units.kW') },
    { labelKey: 'turning.M', value: results.M, unit: t('units.Nm') },
    { labelKey: 'turning.Q', value: results.Q, unit: t('units.cm3min') },
    { labelKey: 'common.utilization', value: results.utilization, unit: t('units.percent'), decimals: 1 },
  ]

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">{t('turning.title')}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('common.inputs')}</h3>
          <MaterialSelect selectedId={materialId} onSelect={handleMaterial} />
          <InputField label={t('turning.d')} value={inputs.d} unit="mm" onChange={(v) => update('d', v)} step={1} />
          <InputField label={t('turning.vc')} value={inputs.vc} unit="m/min" onChange={(v) => update('vc', v)} step={5} />
          <InputField label={t('turning.f')} value={inputs.f} unit="mm/U" onChange={(v) => update('f', v)} step={0.01} />
          <InputField label={t('turning.ap')} value={inputs.ap} unit="mm" onChange={(v) => update('ap', v)} step={0.5} />
          <InputField label={t('turning.kappaR')} value={inputs.kappaR} unit="°" onChange={(v) => update('kappaR', v)} step={1} />
          <InputField label={t('turning.kc11')} value={inputs.kc11} unit="N/mm²" onChange={(v) => update('kc11', v)} step={10} />
          <InputField label={t('turning.mc')} value={inputs.mc} unit="" onChange={(v) => update('mc', v)} step={0.01} />
          <InputField label={t('common.efficiency')} value={inputs.eta} unit="" onChange={(v) => update('eta', v)} step={0.05} min={0.1} max={1} />
          <InputField label={t('common.machinePower')} value={inputs.Pmachine} unit="kW" onChange={(v) => update('Pmachine', v)} step={0.5} />
        </div>
        <ResultsPanel results={resultItems} utilization={results.utilization} />
      </div>
      <CalculationSteps steps={steps} />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd /home/pascal/SPBapp
git add src/components/TurningTab.tsx
git commit -m "feat: add turning tab UI with inputs, results, and calculation steps"
```

---

### Task 11: Drilling Tab

**Files:**
- Create: `src/components/DrillingTab.tsx`

- [ ] **Step 1: Create DrillingTab component**

Create `src/components/DrillingTab.tsx`:

```tsx
import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { InputField } from './InputField'
import { MaterialSelect } from './MaterialSelect'
import { ResultsPanel } from './ResultsPanel'
import { CalculationSteps } from './CalculationSteps'
import { calculateDrilling } from '../calculations/drilling'
import type { DrillingInputs } from '../calculations/types'

export function DrillingTab() {
  const { t } = useTranslation()
  const [materialId, setMaterialId] = useState('42crmo4')
  const [inputs, setInputs] = useState<DrillingInputs>({
    d: 10, vc: 80, f: 0.15, z: 2, sigma: 118,
    l: 30, kc11: 2100, mc: 0.25, eta: 0.8, Pmachine: 8,
  })

  const update = (key: keyof DrillingInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }))
  }

  const handleMaterial = (id: string, kc11: number | null, mc: number | null) => {
    setMaterialId(id)
    if (kc11 !== null && mc !== null) {
      setInputs((prev) => ({ ...prev, kc11, mc }))
    }
  }

  const { results, steps } = useMemo(() => calculateDrilling(inputs), [inputs])

  const resultItems = [
    { labelKey: 'drilling.kappa', value: results.kappa, unit: '°', decimals: 1 },
    { labelKey: 'drilling.n', value: results.n, unit: t('units.rpm') },
    { labelKey: 'drilling.fz', value: results.fz, unit: t('units.mm'), decimals: 4 },
    { labelKey: 'drilling.vf', value: results.vf, unit: t('units.mmmin') },
    { labelKey: 'drilling.h', value: results.h, unit: t('units.mm'), decimals: 4 },
    { labelKey: 'drilling.b', value: results.b, unit: t('units.mm') },
    { labelKey: 'drilling.A', value: results.A, unit: 'mm²', decimals: 4 },
    { labelKey: 'drilling.kc', value: results.kc, unit: t('units.Nmm2') },
    { labelKey: 'drilling.Fc', value: results.Fc, unit: t('units.N') },
    { labelKey: 'drilling.Ff', value: results.Ff, unit: t('units.N') },
    { labelKey: 'drilling.M', value: results.M, unit: t('units.Nm') },
    { labelKey: 'drilling.Pc', value: results.Pc, unit: t('units.kW') },
    { labelKey: 'drilling.P', value: results.P, unit: t('units.kW') },
    { labelKey: 'drilling.Q', value: results.Q, unit: t('units.cm3min') },
    { labelKey: 'drilling.th', value: results.th, unit: t('units.min'), decimals: 3 },
    { labelKey: 'common.utilization', value: results.utilization, unit: t('units.percent'), decimals: 1 },
  ]

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">{t('drilling.title')}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('common.inputs')}</h3>
          <MaterialSelect selectedId={materialId} onSelect={handleMaterial} />
          <InputField label={t('drilling.d')} value={inputs.d} unit="mm" onChange={(v) => update('d', v)} step={0.5} />
          <InputField label={t('drilling.vc')} value={inputs.vc} unit="m/min" onChange={(v) => update('vc', v)} step={5} />
          <InputField label={t('drilling.f')} value={inputs.f} unit="mm/U" onChange={(v) => update('f', v)} step={0.01} />
          <InputField label={t('drilling.z')} value={inputs.z} unit="" onChange={(v) => update('z', v)} step={1} min={1} />
          <InputField label={t('drilling.sigma')} value={inputs.sigma} unit="°" onChange={(v) => update('sigma', v)} step={1} />
          <InputField label={t('drilling.l')} value={inputs.l} unit="mm" onChange={(v) => update('l', v)} step={1} />
          <InputField label={t('drilling.kc11')} value={inputs.kc11} unit="N/mm²" onChange={(v) => update('kc11', v)} step={10} />
          <InputField label={t('drilling.mc')} value={inputs.mc} unit="" onChange={(v) => update('mc', v)} step={0.01} />
          <InputField label={t('common.efficiency')} value={inputs.eta} unit="" onChange={(v) => update('eta', v)} step={0.05} min={0.1} max={1} />
          <InputField label={t('common.machinePower')} value={inputs.Pmachine} unit="kW" onChange={(v) => update('Pmachine', v)} step={0.5} />
        </div>
        <ResultsPanel results={resultItems} utilization={results.utilization} />
      </div>
      <CalculationSteps steps={steps} />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
cd /home/pascal/SPBapp
git add src/components/DrillingTab.tsx
git commit -m "feat: add drilling tab UI with inputs, results, and calculation steps"
```

---

### Task 12: Wire Up App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Update App.tsx with tabs and routing**

Replace `src/App.tsx`:

```tsx
import { useState } from 'react'
import { Header } from './components/Header'
import { TabNavigation, type Tab } from './components/TabNavigation'
import { MillingTab } from './components/MillingTab'
import { TurningTab } from './components/TurningTab'
import { DrillingTab } from './components/DrillingTab'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('milling')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-6xl mx-auto">
        {activeTab === 'milling' && <MillingTab />}
        {activeTab === 'turning' && <TurningTab />}
        {activeTab === 'drilling' && <DrillingTab />}
      </main>
    </div>
  )
}

export default App
```

- [ ] **Step 2: Verify build**

```bash
cd /home/pascal/SPBapp && npx tsc --noEmit 2>&1 | tail -10
```

Expected: No errors.

- [ ] **Step 3: Verify dev server**

```bash
cd /home/pascal/SPBapp && npm run build 2>&1 | tail -10
```

Expected: Build succeeds, output in `dist/`.

- [ ] **Step 4: Run all tests**

```bash
cd /home/pascal/SPBapp && npx vitest run 2>&1
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
cd /home/pascal/SPBapp
git add src/App.tsx
git commit -m "feat: wire up App with Header, TabNavigation, and all three calculation tabs"
```

---

### Task 13: Dockerfile & Nginx Config

**Files:**
- Create: `Dockerfile`
- Create: `nginx.conf`

- [ ] **Step 1: Create nginx.conf**

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 256;
}
```

- [ ] **Step 2: Create Dockerfile**

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

- [ ] **Step 3: Verify Docker build works**

```bash
cd /home/pascal/SPBapp && docker build -t spbapp:test . 2>&1 | tail -10
```

Expected: Build completes successfully.

- [ ] **Step 4: Commit**

```bash
cd /home/pascal/SPBapp
git add Dockerfile nginx.conf
git commit -m "feat: add Dockerfile (multi-stage Node+Nginx) and nginx config"
```

---

### Task 14: GitHub Repo & Coolify Setup

**Files:** None (infrastructure only)

- [ ] **Step 1: Create GitHub repo**

```bash
cd /home/pascal/SPBapp && gh repo create pascal-netizen/SPBapp --public --source=. --push
```

Expected: Repo created and code pushed.

- [ ] **Step 2: Set up Coolify**

Manual steps in Coolify UI (https://coolify.pascal-schmidt.de or equivalent):

1. Go to Projects → New Project → name it "SPBapp"
2. Add new Resource → Application → GitHub → select `pascal-netizen/SPBapp`
3. Branch: `main`
4. Build Pack: Dockerfile
5. Domains: `spb.pascal-schmidt.de`
6. Enable auto-deploy on push
7. SSL: Traefik auto-generates Let's Encrypt cert
8. Click Deploy

- [ ] **Step 3: Verify deployment**

```bash
curl -s -o /dev/null -w "%{http_code}" https://spb.pascal-schmidt.de
```

Expected: `200`

- [ ] **Step 4: Commit any final adjustments**

If Coolify needs config tweaks, commit them:

```bash
cd /home/pascal/SPBapp
git add -A
git commit -m "chore: deployment config adjustments" --allow-empty
git push
```
