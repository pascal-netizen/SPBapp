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
