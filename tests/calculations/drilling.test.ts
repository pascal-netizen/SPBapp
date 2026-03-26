import { describe, it, expect } from 'vitest'
import { calculateDrilling } from '../../src/calculations/drilling'
import type { DrillingInputs } from '../../src/calculations/types'

const defaultInputs: DrillingInputs = {
  d: 10, vc: 80, f: 0.15, z: 2, sigma: 118,
  l: 30, kc11: 2100, mc: 0.25, eta: 0.8, Pmachine: 8,
}

describe('calculateDrilling', () => {
  it('calculates half point angle', () => {
    const result = calculateDrilling(defaultInputs)
    expect(result.results.kappa).toBe(59)
  })
  it('calculates spindle speed', () => {
    const result = calculateDrilling(defaultInputs)
    expect(result.results.n).toBeCloseTo(2546.48, 0)
  })
  it('calculates feed per tooth', () => {
    const result = calculateDrilling(defaultInputs)
    expect(result.results.fz).toBeCloseTo(0.075, 4)
  })
  it('calculates feed velocity', () => {
    const result = calculateDrilling(defaultInputs)
    expect(result.results.vf).toBeCloseTo(381.97, 0)
  })
  it('calculates chip thickness', () => {
    const result = calculateDrilling(defaultInputs)
    expect(result.results.h).toBeCloseTo(0.0643, 3)
  })
  it('calculates chip width', () => {
    const result = calculateDrilling(defaultInputs)
    expect(result.results.b).toBeCloseTo(5.833, 2)
  })
  it('calculates chip cross section', () => {
    const result = calculateDrilling(defaultInputs)
    expect(result.results.A).toBeCloseTo(0.375, 2)
  })
  it('calculates cutting force', () => {
    const result = calculateDrilling(defaultInputs)
    expect(result.results.Fc).toBeGreaterThan(2000)
    expect(result.results.Fc).toBeLessThan(5000)
  })
  it('calculates thrust force', () => {
    const result = calculateDrilling(defaultInputs)
    expect(result.results.Ff).toBeCloseTo(result.results.Fc * 0.5, 0)
  })
  it('calculates torque (d/4 for drilling)', () => {
    const result = calculateDrilling(defaultInputs)
    expect(result.results.M).toBeCloseTo(result.results.Fc * 10 / 4000, 2)
  })
  it('calculates machining time', () => {
    const result = calculateDrilling(defaultInputs)
    expect(result.results.th).toBeCloseTo(30 / result.results.vf, 3)
  })
  it('calculates material removal rate', () => {
    const result = calculateDrilling(defaultInputs)
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
