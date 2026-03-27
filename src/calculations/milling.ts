import type { MillingInputs, MillingResults, CalculationStep } from './types'

/**
 * Calculates the engagement factor Keng from ae/D ratio.
 * Uses the half-angle formulation: Keng = 2 × sin(φs/2)
 * where φs is the engagement angle derived from ae/D.
 */
export function calculateKeng(ae: number, D: number): number {
  const ratio = ae / D
  const phiSRad = Math.acos(1 - 2 * ratio)
  return 2 * Math.sin(phiSRad / 2)
}

/**
 * Performs full milling (Fräsen) calculations using the Kienzle model.
 * Returns all results and 16 annotated calculation steps.
 */
export function calculateMilling(input: MillingInputs): { results: MillingResults; steps: CalculationStep[] } {
  const { D, z, fz, ap, ae, kappa, kc11, mc, vc, Pmachine } = input

  const steps: CalculationStep[] = []

  // Step 1: Effektiver Fräserdurchmesser Deff [mm]
  const kappaRad = kappa * (Math.PI / 180)
  const Deff = kappa === 90 ? D : D + (2 * ap) / Math.tan(kappaRad)
  steps.push({
    name: 'Effektiver Fräserdurchmesser Deff',
    formula: kappa === 90
      ? 'Deff = D (κ = 90°, keine Korrektur)'
      : 'Deff = D + (2 × ap) / tan(κ) [mm]',
    substituted: kappa === 90
      ? `Deff = ${D}`
      : `Deff = ${D} + (2 × ${ap}) / tan(${kappa}°)`,
    result: `${Deff.toFixed(2)} mm`,
  })

  // Step 2: Eingriffswinkel φs [°]
  const phiSRad = Math.acos(1 - (2 * ae) / D)
  const phiS = phiSRad * (180 / Math.PI)
  steps.push({
    name: 'Eingriffswinkel φs',
    formula: 'φs = arccos(1 − 2·ae/D) [°]',
    substituted: `φs = arccos(1 − 2·${ae}/${D})`,
    result: `${phiS.toFixed(2)} °`,
  })

  // Step 2: Gleichzeitig schneidende Zähne ze
  const ze = z * (phiS / 360)
  steps.push({
    name: 'Gleichzeitig schneidende Zähne ze',
    formula: 'ze = z × φs / 360',
    substituted: `ze = ${z} × ${phiS.toFixed(2)} / 360`,
    result: `${ze.toFixed(3)}`,
  })

  // Step 3: Drehzahl n [U/min] — basierend auf Deff
  const n = (vc * 1000) / (Math.PI * Deff)
  steps.push({
    name: 'Drehzahl n',
    formula: 'n = (vc × 1000) / (π × Deff) [U/min]',
    substituted: `n = (${vc} × 1000) / (π × ${Deff.toFixed(2)})`,
    result: `${n.toFixed(2)} U/min`,
  })

  // Step 4: Vorschubgeschwindigkeit vf [mm/min]
  const vf = fz * z * n
  steps.push({
    name: 'Vorschubgeschwindigkeit vf',
    formula: 'vf = fz × z × n [mm/min]',
    substituted: `vf = ${fz} × ${z} × ${n.toFixed(2)}`,
    result: `${vf.toFixed(2)} mm/min`,
  })

  // Step 5: Mittlere Spanungsdicke hm [mm]
  const hm = fz * Math.sin(kappaRad) * (360 / (Math.PI * phiS)) * (ae / D)
  steps.push({
    name: 'Mittlere Spanungsdicke hm',
    formula: 'hm = fz × sin(κ) × (360 / (π × φs)) × (ae/D) [mm]',
    substituted: `hm = ${fz} × sin(${kappa}°) × (360 / (π × ${phiS.toFixed(2)})) × (${ae}/${D})`,
    result: `${hm.toFixed(4)} mm`,
  })

  // Step 6: Maximale Spandicke hmax [mm]
  const hmax = ae >= D / 2
    ? fz * Math.sin(kappaRad)
    : fz * Math.sin(kappaRad) * Math.sin(phiSRad)
  steps.push({
    name: 'Maximale Spandicke hmax',
    formula: ae >= D / 2
      ? 'hmax = fz × sin(κ) [ae ≥ D/2]'
      : 'hmax = fz × sin(κ) × sin(φs) [ae < D/2]',
    substituted: ae >= D / 2
      ? `hmax = ${fz} × sin(${kappa}°)`
      : `hmax = ${fz} × sin(${kappa}°) × sin(${phiS.toFixed(2)}°)`,
    result: `${hmax.toFixed(4)} mm`,
  })

  // Step 7: Spanbreite b [mm]
  const b = ap / Math.sin(kappaRad)
  steps.push({
    name: 'Spanbreite b',
    formula: 'b = ap / sin(κ) [mm]',
    substituted: `b = ${ap} / sin(${kappa}°)`,
    result: `${b.toFixed(4)} mm`,
  })

  // Step 8: Spezifische Schnittkraft kc [N/mm²]
  const kc = kc11 * Math.pow(hm, -mc)
  steps.push({
    name: 'Spezifische Schnittkraft kc',
    formula: 'kc = kc1.1 × hm^(−mc) [N/mm²]',
    substituted: `kc = ${kc11} × ${hm.toFixed(4)}^(−${mc})`,
    result: `${kc.toFixed(2)} N/mm²`,
  })

  // Step 9: Hauptschnittkraft Fc [N]
  const Fc = ze * b * kc11 * Math.pow(hm, 1 - mc)
  steps.push({
    name: 'Hauptschnittkraft Fc',
    formula: 'Fc = ze × b × kc1.1 × hm^(1−mc) [N]',
    substituted: `Fc = ${ze.toFixed(3)} × ${b.toFixed(4)} × ${kc11} × ${hm.toFixed(4)}^(${1 - mc})`,
    result: `${Fc.toFixed(2)} N`,
  })

  // Step 10: Vorschubkraft horizontal Ff [N]
  const Ff = Fc * Math.sin(kappaRad)
  steps.push({
    name: 'Vorschubkraft horizontal Ff',
    formula: 'Ff = Fc × sin(κ) [N]',
    substituted: `Ff = ${Fc.toFixed(2)} × sin(${kappa}°)`,
    result: `${Ff.toFixed(2)} N`,
  })

  // Step 11: Vorschubkraft axial Fa [N]
  const Fa = Fc * Math.cos(kappaRad) * 0.4
  steps.push({
    name: 'Vorschubkraft axial Fa',
    formula: 'Fa = Fc × cos(κ) × 0.4 [N]',
    substituted: `Fa = ${Fc.toFixed(2)} × cos(${kappa}°) × 0.4`,
    result: `${Fa.toFixed(2)} N`,
  })

  // Step 12: Mittlere Vorschubkraft FfMean [N]
  const FfMean = Ff * 0.637
  steps.push({
    name: 'Mittlere Vorschubkraft FfMean',
    formula: 'FfMean = Ff × 0.637 [N]',
    substituted: `FfMean = ${Ff.toFixed(2)} × 0.637`,
    result: `${FfMean.toFixed(2)} N`,
  })

  // Step 13: Drehmoment M [Nm]
  const M = Fc * D / 2000
  steps.push({
    name: 'Drehmoment M',
    formula: 'M = Fc × D / 2000 [Nm]',
    substituted: `M = ${Fc.toFixed(2)} × ${D} / 2000`,
    result: `${M.toFixed(4)} Nm`,
  })

  // Step 14: Spindelleistung P [kW]
  const P = Fc * vc / 60000
  steps.push({
    name: 'Spindelleistung P',
    formula: 'P = Fc × vc / 60000 [kW]',
    substituted: `P = ${Fc.toFixed(2)} × ${vc} / 60000`,
    result: `${P.toFixed(4)} kW`,
  })

  // Step 15: Maschinenauslastung [%]
  const utilization = (P / Pmachine) * 100
  steps.push({
    name: 'Maschinenauslastung',
    formula: 'utilization = P / Pmachine × 100 [%]',
    substituted: `utilization = ${P.toFixed(4)} / ${Pmachine} × 100`,
    result: `${utilization.toFixed(2)} %`,
  })

  // Step 16: Zeitspanvolumen Q [cm³/min]
  const Q = (ap * ae * vf) / 1000
  steps.push({
    name: 'Zeitspanvolumen Q',
    formula: 'Q = ap × ae × vf / 1000 [cm³/min]',
    substituted: `Q = ${ap} × ${ae} × ${vf.toFixed(2)} / 1000`,
    result: `${Q.toFixed(2)} cm³/min`,
  })

  const results: MillingResults = {
    Deff,
    phiS,
    ze,
    n,
    vf,
    hm,
    hmax,
    b,
    kc,
    Fc,
    Ff,
    Fa,
    FfMean,
    M,
    P,
    utilization,
    Q,
  }

  return { results, steps }
}
