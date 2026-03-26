import type { DrillingInputs, DrillingResults, CalculationStep } from './types'

const DEG_TO_RAD = Math.PI / 180

export function calculateDrilling(input: DrillingInputs): {
  results: DrillingResults
  steps: CalculationStep[]
} {
  const steps: CalculationStep[] = []

  // 1. κ = σ / 2
  const kappa = input.sigma / 2
  const kappaRad = kappa * DEG_TO_RAD
  steps.push({ name: 'Halber Spitzenwinkel κ', formula: 'κ = σ / 2', substituted: `κ = ${input.sigma} / 2`, result: `${kappa}°` })

  // 2. n = (vc × 1000) / (π × d)
  const n = (input.vc * 1000) / (Math.PI * input.d)
  steps.push({ name: 'Drehzahl n', formula: 'n = (vc × 1000) / (π × d)', substituted: `n = (${input.vc} × 1000) / (π × ${input.d})`, result: `${n.toFixed(2)} U/min` })

  // 3. fz = f / z
  const fz = input.f / input.z
  steps.push({ name: 'Vorschub pro Schneide fz', formula: 'fz = f / z', substituted: `fz = ${input.f} / ${input.z}`, result: `${fz.toFixed(4)} mm` })

  // 4. vf = f × n
  const vf = input.f * n
  steps.push({ name: 'Vorschubgeschwindigkeit vf', formula: 'vf = f × n', substituted: `vf = ${input.f} × ${n.toFixed(2)}`, result: `${vf.toFixed(2)} mm/min` })

  // 5. h = fz × sin(κ)
  const h = fz * Math.sin(kappaRad)
  steps.push({ name: 'Spanungsdicke h', formula: 'h = fz × sin(κ)', substituted: `h = ${fz.toFixed(4)} × sin(${kappa}°)`, result: `${h.toFixed(4)} mm` })

  // 6. b = d / (2 × sin(κ))
  const b = input.d / (2 * Math.sin(kappaRad))
  steps.push({ name: 'Spanungsbreite b', formula: 'b = d / (2 × sin(κ))', substituted: `b = ${input.d} / (2 × sin(${kappa}°))`, result: `${b.toFixed(4)} mm` })

  // 7. A = b × h
  const A = b * h
  steps.push({ name: 'Spanungsquerschnitt A', formula: 'A = b × h', substituted: `A = ${b.toFixed(4)} × ${h.toFixed(4)}`, result: `${A.toFixed(4)} mm²` })

  // 8. kc = kc1.1 × h^(−mc)
  const kc = input.kc11 * Math.pow(h, -input.mc)
  steps.push({ name: 'Spez. Schnittkraft kc', formula: 'kc = kc1.1 × h^(−mc)', substituted: `kc = ${input.kc11} × ${h.toFixed(4)}^(−${input.mc})`, result: `${kc.toFixed(2)} N/mm²` })

  // 9. Fc = z × kc × A
  const Fc = input.z * kc * A
  steps.push({ name: 'Schnittkraft Fc', formula: 'Fc = z × kc × A', substituted: `Fc = ${input.z} × ${kc.toFixed(2)} × ${A.toFixed(4)}`, result: `${Fc.toFixed(2)} N` })

  // 10. Ff ≈ 0.5 × Fc
  const Ff = 0.5 * Fc
  steps.push({ name: 'Vorschubkraft (axial) Ff', formula: 'Ff ≈ 0.5 × Fc', substituted: `Ff = 0.5 × ${Fc.toFixed(2)}`, result: `${Ff.toFixed(2)} N` })

  // 11. M = Fc × d / 4000
  const torqueM = Fc * input.d / 4000
  steps.push({ name: 'Drehmoment M', formula: 'M = Fc × d / 4000', substituted: `M = ${Fc.toFixed(2)} × ${input.d} / 4000`, result: `${torqueM.toFixed(2)} Nm` })

  // 12. Pc = Fc × vc / 60000
  const Pc = Fc * input.vc / 60000
  steps.push({ name: 'Schnittleistung Pc', formula: 'Pc = Fc × vc / 60000', substituted: `Pc = ${Fc.toFixed(2)} × ${input.vc} / 60000`, result: `${Pc.toFixed(2)} kW` })

  // 13. P = Pc / η
  const P = Pc / input.eta
  steps.push({ name: 'Antriebsleistung P', formula: 'P = Pc / η', substituted: `P = ${Pc.toFixed(2)} / ${input.eta}`, result: `${P.toFixed(2)} kW` })

  // 14. Q = (π × d² × f × n) / 4000
  const Q = (Math.PI * input.d * input.d * input.f * n) / 4000
  steps.push({ name: 'Zeitspanvolumen Q', formula: 'Q = (π × d² × f × n) / 4000', substituted: `Q = (π × ${input.d}² × ${input.f} × ${n.toFixed(2)}) / 4000`, result: `${Q.toFixed(2)} cm³/min` })

  // 15. th = l / vf
  const th = input.l / vf
  steps.push({ name: 'Bearbeitungszeit th', formula: 'th = l / vf', substituted: `th = ${input.l} / ${vf.toFixed(2)}`, result: `${th.toFixed(3)} min` })

  // 16. utilization = P / Pmachine × 100
  const utilization = (P / input.Pmachine) * 100
  steps.push({ name: 'Maschinenauslastung', formula: 'Auslastung = P / P_masch × 100', substituted: `Auslastung = ${P.toFixed(2)} / ${input.Pmachine} × 100`, result: `${utilization.toFixed(1)}%` })

  return { results: { kappa, n, fz, vf, h, b, A, kc, Fc, Ff, M: torqueM, Pc, P, Q, th, utilization }, steps }
}
