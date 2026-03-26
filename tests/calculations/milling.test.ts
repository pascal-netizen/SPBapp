import { describe, it, expect } from 'vitest'
import { calculateMilling, calculateKeng } from '../../src/calculations/milling'
import type { MillingInputs } from '../../src/calculations/types'

const defaultInputs: MillingInputs = {
  D: 63, z: 4, fz: 0.3, ap: 3, ae: 20, kappa: 90,
  kc11: 2100, mc: 0.25, vc: 180, Keng: 1.7, Pmachine: 8,
}

describe('calculateKeng', () => {
  it('calculates Keng from ae and D', () => {
    const keng = calculateKeng(20, 63)
    expect(keng).toBeGreaterThan(1.0)
    expect(keng).toBeLessThan(3.0)
  })
  it('returns ~2.0 for full slot (ae = D)', () => {
    const keng = calculateKeng(63, 63)
    expect(keng).toBeCloseTo(2.0, 0)
  })
})

describe('calculateMilling', () => {
  it('calculates spindle speed correctly', () => {
    const result = calculateMilling(defaultInputs)
    expect(result.results.n).toBeCloseTo(909.46, 0)
  })
  it('calculates feed rate correctly', () => {
    const result = calculateMilling(defaultInputs)
    expect(result.results.vf).toBeCloseTo(1091.35, 0)
  })
  it('calculates engagement angle', () => {
    const result = calculateMilling(defaultInputs)
    expect(result.results.phiS).toBeCloseTo(68.6, 0)
  })
  it('calculates simultaneously engaged teeth', () => {
    const result = calculateMilling(defaultInputs)
    expect(result.results.ze).toBeCloseTo(0.76, 1)
  })
  it('calculates mean chip thickness', () => {
    const result = calculateMilling(defaultInputs)
    expect(result.results.hm).toBeCloseTo(0.159, 2)
  })
  it('calculates hmax for ae < D/2', () => {
    const result = calculateMilling(defaultInputs)
    expect(result.results.hmax).toBeCloseTo(0.279, 2)
  })
  it('calculates hmax for ae >= D/2', () => {
    const input = { ...defaultInputs, ae: 40 }
    const result = calculateMilling(input)
    expect(result.results.hmax).toBeCloseTo(0.3, 2)
  })
  it('calculates chip width', () => {
    const result = calculateMilling(defaultInputs)
    expect(result.results.b).toBeCloseTo(3, 2)
  })
  it('calculates main cutting force', () => {
    const result = calculateMilling(defaultInputs)
    expect(result.results.Fc).toBeGreaterThan(500)
    expect(result.results.Fc).toBeLessThan(3000)
  })
  it('calculates power and utilization', () => {
    const result = calculateMilling(defaultInputs)
    expect(result.results.P).toBeGreaterThan(0)
    expect(result.results.utilization).toBeGreaterThan(0)
  })
  it('calculates material removal rate', () => {
    const result = calculateMilling(defaultInputs)
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
    expect(result.results.b).toBeCloseTo(4.24, 1)
  })
})
