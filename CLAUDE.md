# SPBapp – Schnittdatenparameterberechnung

## Was ist das?
Web-basierter Schnittdatenrechner nach dem Kienzle-Modell.
Deployed als Docker-Container (Node Build → Nginx static) via Coolify auf https://spb.pascal-schmidt.de.

## Repository
- **GitHub:** https://github.com/pascal-netizen/SPBapp
- **Branch:** `main`

## Tech Stack
- React 19, TypeScript, Vite, TailwindCSS 4, i18next (DE+EN), Vitest
- **Kein Backend, keine Datenbank** – reine Client-Side SPA

## Commands
```bash
npm run dev      # Vite Dev-Server
npm run build    # tsc -b && vite build
npm run lint     # ESLint
npm run preview  # Vite Preview (Build testen)
```

## Projektstruktur
```
SPBapp/src/
├── App.tsx                  # Haupt-App mit Tab-Navigation
├── main.tsx                 # React Entry Point
├── index.css                # Globale Styles (Tailwind @theme Tokens)
├── declarations.d.ts        # Type Declarations
├── calculations/
│   ├── milling.ts           # Fräsen (16+ Schritte)
│   ├── turning.ts           # Drehen (14+ Schritte)
│   ├── drilling.ts          # Bohren (16+ Schritte)
│   └── types.ts             # Shared Calculation Types
├── components/
│   ├── MillingTab.tsx        # Fräsen-Tab
│   ├── TurningTab.tsx        # Drehen-Tab
│   ├── DrillingTab.tsx       # Bohren-Tab
│   ├── InputField.tsx        # Eingabefeld-Komponente
│   ├─��� InputGroupLabel.tsx   # Gruppen-Label
│   ├── MaterialSelect.tsx    # Material-Dropdown (11 + Custom)
│   ├── ResultsPanel.tsx      # Ergebnis-Anzeige (gruppiert)
│   ��── ResultCard.tsx        # Einzel-Ergebnis-Karte
│   ├─��� CalculationSteps.tsx  # Aufklappbare Berechnungsschritte
│   ├── ComparisonSection.tsx # SOLL-IST Vergleich
│   ├── ActionBar.tsx         # IST/SOLL Save Buttons
│   ├── HistoryDrawer.tsx     # Historie-Drawer (localStorage, max 20)
│   ├── KengInfo.tsx          # Keng Referenztabelle
│   ├── Header.tsx            # Sticky Header mit Glassmorphism
│   └── TabNavigation.tsx     # Tab-Umschalter
├── data/
│   └── materials.ts          # Materialdatenbank (kc1.1, mc)
├─�� hooks/
│   ├── useHistory.ts         # localStorage Historie
│   ├── useTheme.ts           # Dark/Light/System Theme
│   └── useUrlState.ts        # URL State Persistence
├── utils/
│   └── export.ts             # PDF + XLSX Export
└── i18n/                     # Übersetzungen (DE/EN)
```

## Features
- Drei Bearbeitungsarten: Fr��sen, Drehen, Bohren
- Kienzle-Modell mit aufklappbaren Berechnungsschritten (Formel + Substitution + Ergebnis)
- Materialdatenbank (11 Materialien + Custom) mit Auto-Fill kc1.1/mc
- Keng Auto-Berechnung aus ae/D mit editierbarem Override
- SOLL-IST Vergleich (farbcodiert: grün/rot je nach Semantik)
- History (localStorage, max 20), URL State Sharing, PDF/XLSX Export
- Dark/Light/System Theme, DE+EN, Mobile-responsive

## UI Design
- Inter Font + JetBrains Mono für numerische Werte
- Custom Tokens: `surface-*` und `primary-*` in `@theme` Block (index.css)
- Glassmorphism Header, SVG Icons (Heroicons-style), keine Emojis
- Ergebnisse gruppiert: Geometrie, Kinematik, Kräfte, Leistung & Auslastung

## Gotchas
- **Deff-Formel:** Für Wendeplattenfräser gilt `Deff = D + 2*ap/tan(κ)` (PLUS, nicht Minus!). Bei κ < 90° ist der effektive Schnittdurchmesser GRÖSSER als D → Drehzahl geht RUNTER. Ein AI-Audit hatte fälschlich das Vorzeichen umgedreht.
- **html2canvas:** Nicht verwenden – Tailwind v4 lab() Farben brechen es. Stattdessen `html-to-image`.
