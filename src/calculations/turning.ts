import type { TurningInputs, TurningResults, CalculationStep } from './types'

const DEG_TO_RAD = Math.PI / 180

export function calculateTurning(input: TurningInputs): {
  results: TurningResults
  steps: CalculationStep[]
} {
  const steps: CalculationStep[] = []
  const kappaRad = input.kappaR * DEG_TO_RAD

  // 1. n = (vc × 1000) / (π × d)
  const n = (input.vc * 1000) / (Math.PI * input.d)
  steps.push({ name: 'Drehzahl n', formula: 'n = (vc × 1000) / (π × d)', substituted: `n = (${input.vc} × 1000) / (π × ${input.d})`, result: `${n.toFixed(2)} U/min` })

  // 2. vf = f × n
  const vf = input.f * n
  steps.push({ name: 'Vorschubgeschwindigkeit vf', formula: 'vf = f × n', substituted: `vf = ${input.f} × ${n.toFixed(2)}`, result: `${vf.toFixed(2)} mm/min` })

  // 3. h = f × sin(κr)
  const h = input.f * Math.sin(kappaRad)
  steps.push({ name: 'Spanungsdicke h', formula: 'h = f × sin(κr)', substituted: `h = ${input.f} × sin(${input.kappaR}°)`, result: `${h.toFixed(4)} mm` })

  // 4. b = ap / sin(κr)
  const b = input.ap / Math.sin(kappaRad)
  steps.push({ name: 'Spanungsbreite b', formula: 'b = ap / sin(κr)', substituted: `b = ${input.ap} / sin(${input.kappaR}°)`, result: `${b.toFixed(4)} mm` })

  // 5. A = ap × f
  const A = input.ap * input.f
  steps.push({ name: 'Spanungsquerschnitt A', formula: 'A = ap × f', substituted: `A = ${input.ap} × ${input.f}`, result: `${A.toFixed(4)} mm²` })

  // 6. kc = kc1.1 × h^(−mc)
  const kc = input.kc11 * Math.pow(h, -input.mc)
  steps.push({ name: 'Spez. Schnittkraft kc', formula: 'kc = kc1.1 × h^(−mc)', substituted: `kc = ${input.kc11} × ${h.toFixed(4)}^(−${input.mc})`, result: `${kc.toFixed(2)} N/mm²` })

  // 7. Fc = kc × A
  const Fc = kc * A
  steps.push({ name: 'Schnittkraft Fc', formula: 'Fc = kc × A', substituted: `Fc = ${kc.toFixed(2)} × ${A.toFixed(4)}`, result: `${Fc.toFixed(2)} N` })

  // 8. Ff = Fc × (0.3 + 0.2 × cos(κr))
  const Ff = Fc * (0.3 + 0.2 * Math.cos(kappaRad))
  steps.push({ name: 'Vorschubkraft Ff', formula: 'Ff = Fc × (0.3 + 0.2 × cos(κr))', substituted: `Ff = ${Fc.toFixed(2)} × (0.3 + 0.2 × cos(${input.kappaR}°))`, result: `${Ff.toFixed(2)} N` })

  // 9. Fp = Fc × (0.2 + 0.2 × cos(κr))
  const Fp = Fc * (0.2 + 0.2 * Math.cos(kappaRad))
  steps.push({ name: 'Passivkraft Fp', formula: 'Fp = Fc × (0.2 + 0.2 × cos(κr))', substituted: `Fp = ${Fc.toFixed(2)} × (0.2 + 0.2 × cos(${input.kappaR}°))`, result: `${Fp.toFixed(2)} N` })

  // 10. Pc = Fc × vc / 60000
  const Pc = Fc * input.vc / 60000
  steps.push({ name: 'Schnittleistung Pc', formula: 'Pc = Fc × vc / 60000', substituted: `Pc = ${Fc.toFixed(2)} × ${input.vc} / 60000`, result: `${Pc.toFixed(2)} kW` })

  // 11. P = Pc / η
  const P = Pc / input.eta
  steps.push({ name: 'Antriebsleistung P', formula: 'P = Pc / η', substituted: `P = ${Pc.toFixed(2)} / ${input.eta}`, result: `${P.toFixed(2)} kW` })

  // 12. M = Fc × d / 2000
  const torqueM = Fc * input.d / 2000
  steps.push({ name: 'Drehmoment M', formula: 'M = Fc × d / 2000', substituted: `M = ${Fc.toFixed(2)} × ${input.d} / 2000`, result: `${torqueM.toFixed(2)} Nm` })

  // 13. Q = ap × f × vc
  const Q = input.ap * input.f * input.vc
  steps.push({ name: 'Zeitspanvolumen Q', formula: 'Q = ap × f × vc', substituted: `Q = ${input.ap} × ${input.f} × ${input.vc}`, result: `${Q.toFixed(2)} cm³/min` })

  // 14. utilization = P / Pmachine × 100
  const utilization = (P / input.Pmachine) * 100
  steps.push({ name: 'Maschinenauslastung', formula: 'Auslastung = P / P_masch × 100', substituted: `Auslastung = ${P.toFixed(2)} / ${input.Pmachine} × 100`, result: `${utilization.toFixed(1)}%` })

  return { results: { n, vf, h, b, A, kc, Fc, Ff, Fp, Pc, P, M: torqueM, Q, utilization }, steps }
}
