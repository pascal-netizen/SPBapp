# SPBapp — Schnittdatenparameterberechnung

**Datum:** 2026-03-26
**Status:** Approved
**Domain:** spb.pascal-schmidt.de

## Zweck

Web-basiertes Berechnungstool für Zerspanungs-Schnittparameter nach dem Kienzle-Modell. Unterstützt Fräsen (Wendeplattenfräser), Drehen und Bohren (Spiralbohrer). Reine Frontend-Applikation ohne Backend.

## Tech-Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** TailwindCSS 4 mit Dark/Light/System-Theme
- **i18n:** i18next (Deutsch + Englisch)
- **Deployment:** Dockerfile (Multi-Stage: Node Build → Nginx) → Coolify auf `spb.pascal-schmidt.de`
- **Kein Backend, keine Datenbank**

## Projektstruktur

```
SPBapp/
├── src/
│   ├── components/          # UI-Komponenten (Tabs, InputField, ResultCard...)
│   ├── calculations/        # Reine Berechnungslogik
│   │   ├── milling.ts       # Fräsen
│   │   ├── turning.ts       # Drehen
│   │   └── drilling.ts      # Bohren
│   ├── data/
│   │   └── materials.ts     # Werkstoff-Datenbank (kc1.1, mc)
│   ├── i18n/                # Sprachdateien (de.json, en.json)
│   ├── hooks/               # useTheme, useCalculation etc.
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── Dockerfile
├── nginx.conf
└── package.json
```

## UI & Layout

### Header
- Logo/Name "SPBapp"
- Sprachumschalter (DE/EN)
- Theme-Toggle (Hell/Dunkel/System)

### Navigation
- Tab-Leiste: Fräsen | Drehen | Bohren

### Pro Tab — Zweispaltiges Layout
- **Links:** Eingabefelder
  - Werkstoff-Dropdown ganz oben (befüllt kc1.1 und mc automatisch)
  - Parameter-Felder darunter
  - Maschinenleistung unten
- **Rechts:** Ergebnisse als Karten (Drehzahl, Kräfte, Leistung, Auslastung etc.)
- **Unten:** Aufklappbarer Bereich "Berechnungsschritte" — zeigt Formel + eingesetzte Werte

### Responsive
- Mobile: Einspaltig, Eingabe oben, Ergebnisse darunter

### Besondere UI-Logik
- Echtzeit-Berechnung bei jeder Eingabeänderung
- Maschinenauslastung >100%: rot hervorheben als Warnung
- Keng (Fräsen): automatisch aus ae/D berechnet, editierbar, mit Referenztabelle als Tooltip
- kc1.1 / mc: aus Werkstoff-Dropdown befüllt, editierbar

## Berechnungslogik

Alle Verfahren basieren auf dem **Kienzle-Modell**: `kc = kc1.1 × h^(−mc)`

### Fräsen (Wendeplattenfräser)

**Eingaben:**

| Parameter | Symbol | Einheit | Default |
|---|---|---|---|
| Fräserdurchmesser | D | mm | 63 |
| Schneidenzahl | z | — | 4 |
| Vorschub pro Zahn | fz | mm | 0.3 |
| Schnitttiefe | ap | mm | 3 |
| Eingriffsbreite | ae | mm | 20 |
| Kappawinkel | κ | ° | 90 |
| Werkstoff (Dropdown) | — | — | Vergütungsstahl 42CrMo4 |
| Spez. Schnittkraft | kc1.1 | N/mm² | 2100 (aus Werkstoff) |
| Exponent | mc | — | 0.25 (aus Werkstoff) |
| Schnittgeschwindigkeit | vc | m/min | 180 |
| Eingriffsfaktor | Keng | — | auto aus ae/D, editierbar |
| Maschinenleistung | P_masch | kW | 8 |

**Berechnungen:**

```
1.  Eingriffswinkel:    φs = arccos(1 − 2·ae/D)                          [°]
2.  Gleichz. Zähne:     ze = z × φs / 360
3.  Drehzahl:           n = (vc × 1000) / (π × D)                        [U/min]
4.  Vorschubgeschw.:    vf = fz × z × n                                  [mm/min]
5.  Mittl. Spandicke:   hm = fz × sin(κ) × (360 / (π × φs)) × (ae/D)   [mm]
6.  Max. Spandicke:     hmax = fz × sin(κ)                (bei ae ≥ D/2) [mm]
                        hmax = fz × sin(κ) × sin(φs)      (bei ae < D/2) [mm]
7.  Spanbreite:         b = ap / sin(κ)                                   [mm]
8.  Spez. Schnittkraft: kc = kc1.1 × hm^(−mc)                           [N/mm²]
9.  Hauptschnittkraft:  Fc = ze × b × kc1.1 × hm^(1−mc)                 [N]
10. Vorschubkraft hor.: Ff = Fc × cos(κ)                                 [N]
11. Vorschubkraft ax.:  Fa = Fc × sin(κ) × 0.4                          [N]
12. Mittl. Vorschubkr.: Ff_mean = Ff × 0.637                            [N]
13. Drehmoment:         M = Fc × D / 2000                               [Nm]
14. Spindelleistung:    P = Fc × vc / 60000                             [kW]
15. Maschinenauslast.:  Ausl. = P / P_masch × 100                       [%]
16. Zeitspanvolumen:    Q = ap × ae × vf / 1000                         [cm³/min]
```

### Drehen

**Eingaben:**

| Parameter | Symbol | Einheit | Default |
|---|---|---|---|
| Werkstückdurchmesser | d | mm | 50 |
| Schnittgeschwindigkeit | vc | m/min | 150 |
| Vorschub | f | mm/U | 0.2 |
| Schnitttiefe | ap | mm | 2 |
| Einstellwinkel | κr | ° | 90 |
| Werkstoff (Dropdown) | — | — | Vergütungsstahl 42CrMo4 |
| Spez. Schnittkraft | kc1.1 | N/mm² | 2100 (aus Werkstoff) |
| Exponent | mc | — | 0.25 (aus Werkstoff) |
| Wirkungsgrad | η | — | 0.8 |
| Maschinenleistung | P_masch | kW | 8 |

**Berechnungen:**

```
1.  Drehzahl:           n = (vc × 1000) / (π × d)                       [U/min]
2.  Vorschubgeschw.:    vf = f × n                                       [mm/min]
3.  Spanungsdicke:      h = f × sin(κr)                                  [mm]
4.  Spanungsbreite:     b = ap / sin(κr)                                 [mm]
5.  Spanungsquerschn.:  A = ap × f                                       [mm²]
6.  Spez. Schnittkraft: kc = kc1.1 × h^(−mc)                            [N/mm²]
7.  Schnittkraft:       Fc = kc × A                                      [N]
8.  Vorschubkraft:      Ff ≈ Fc × (0.3 bei κr=90° / 0.5 bei κr=45°)    [N]
                        interpoliert: Ff = Fc × (0.3 + 0.2 × cos(κr))
9.  Passivkraft:        Fp ≈ Fc × (0.2 bei κr=90° / 0.4 bei κr=45°)    [N]
                        interpoliert: Fp = Fc × (0.2 + 0.2 × cos(κr))
10. Schnittleistung:    Pc = Fc × vc / 60000                            [kW]
11. Antriebsleistung:   P = Pc / η                                      [kW]
12. Drehmoment:         M = Fc × d / 2000                               [Nm]
13. Zeitspanvolumen:    Q = ap × f × vc                                  [cm³/min]
14. Maschinenauslast.:  Ausl. = P / P_masch × 100                       [%]
```

### Bohren (Spiralbohrer)

**Eingaben:**

| Parameter | Symbol | Einheit | Default |
|---|---|---|---|
| Bohrdurchmesser | d | mm | 10 |
| Schnittgeschwindigkeit | vc | m/min | 80 |
| Vorschub pro Umdrehung | f | mm/U | 0.15 |
| Schneidenzahl | z | — | 2 |
| Spitzenwinkel | σ | ° | 118 |
| Bohrtiefe | l | mm | 30 |
| Werkstoff (Dropdown) | — | — | Vergütungsstahl 42CrMo4 |
| Spez. Schnittkraft | kc1.1 | N/mm² | 2100 (aus Werkstoff) |
| Exponent | mc | — | 0.25 (aus Werkstoff) |
| Wirkungsgrad | η | — | 0.8 |
| Maschinenleistung | P_masch | kW | 8 |

**Berechnungen:**

```
1.  Halber Spitzenwinkel: κ = σ / 2                                      [°]
2.  Drehzahl:             n = (vc × 1000) / (π × d)                     [U/min]
3.  Vorschub pro Schneide: fz = f / z                                    [mm]
4.  Vorschubgeschw.:      vf = f × n                                     [mm/min]
5.  Spanungsdicke:        h = fz × sin(κ)                                [mm]
6.  Spanungsbreite:       b = d / (2 × sin(κ))                           [mm]
7.  Spanungsquerschnitt:  A = b × h                                      [mm²]
8.  Spez. Schnittkraft:   kc = kc1.1 × h^(−mc)                          [N/mm²]
9.  Schnittkraft:         Fc = z × kc × A                                [N]
10. Vorschubkraft (axial): Ff ≈ 0.5 × Fc                                [N]
11. Drehmoment:           M = Fc × d / 4000                              [Nm]
12. Schnittleistung:      Pc = Fc × vc / 60000                           [kW]
13. Antriebsleistung:     P = Pc / η                                     [kW]
14. Zeitspanvolumen:      Q = (π × d² × f × n) / 4000                   [cm³/min]
15. Bearbeitungszeit:     th = l / vf                                     [min]
16. Maschinenauslast.:    Ausl. = P / P_masch × 100                      [%]
```

## Werkstoff-Datenbank

Gemeinsam für alle Verfahren, als Dropdown mit automatischer Befüllung von kc1.1 und mc. Werte bleiben editierbar.

| Werkstoff | kc1.1 (N/mm²) | mc |
|---|---|---|
| Aluminium (Knetleg.) | 700 | 0.23 |
| Baustahl S235 | 1600 | 0.25 |
| Baustahl S355 | 1780 | 0.25 |
| Vergütungsstahl C45 | 1900 | 0.26 |
| Vergütungsstahl 42CrMo4 | 2100 | 0.25 |
| Edelstahl 1.4301 | 2200 | 0.27 |
| Edelstahl 1.4571 | 2500 | 0.28 |
| Gusseisen GJL-250 | 1150 | 0.28 |
| Gusseisen GJS-400 | 1450 | 0.27 |
| Messing | 780 | 0.22 |
| Titan Ti6Al4V | 1500 | 0.23 |
| Benutzerdefiniert | — | — |

## Keng-Referenztabelle (Fräsen)

Wird als Tooltip/Info neben dem Keng-Feld angezeigt:

| Frässtrategie | Eingriffsfaktor |
|---|---|
| Nutfräsen (ae ≈ D) | 2.0 – 2.5 |
| 50% Eingriff | 1.7 – 2.0 |
| 30% Eingriff | 1.4 – 1.7 |
| Planfräsen (10–20%) | 1.2 – 1.5 |
| High Feed Fräsen | 1.1 – 1.3 |

## Deployment

- **Repo:** github.com/pascal-netizen/SPBapp (main branch)
- **Dockerfile:** Multi-Stage Build (Node → Nginx)
- **Coolify:** Neues Projekt anlegen, GitHub-Repo verbinden, Domain `spb.pascal-schmidt.de` zuweisen
- **Auto-Deploy:** Push auf main triggert Build + Deploy
- **SSL:** Automatisch über Traefik/Let's Encrypt (wie FlowERP/ImmoApp)

## Berechnungsschritte-Anzeige

Jeder Tab enthält einen aufklappbaren Bereich "Berechnungsschritte", der für jeden Rechenschritt zeigt:
1. Name des Schritts (z.B. "Drehzahl n")
2. Allgemeine Formel (z.B. `n = (vc × 1000) / (π × D)`)
3. Eingesetzte Werte (z.B. `n = (180 × 1000) / (π × 63)`)
4. Ergebnis mit Einheit (z.B. `= 909.46 U/min`)

Dies dient der Transparenz und Überprüfbarkeit der Berechnungen.
