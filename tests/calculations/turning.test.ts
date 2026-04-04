import { describe, it, expect } from 'vitest'
import { calculateTurning } from '../../src/calculations/turning'
import type { TurningInputs } from '../../src/calculations/types'

const defaultInputs: TurningInputs = {
  d: 50, vc: 150, f: 0.2, ap: 2, kappaR: 90,
  kc11: 2100, mc: 0.25, eta: 0.8, Pmachine: 8,
}

describe('calculateTurning', () => {
  it('calculates spindle speed correctly', () => {
    const result = calculateTurning(defaultInputs)
    expect(result.results.n).toBeCloseTo(954.93, 0)
  })
  it('calculates feed velocity', () => {
    const result = calculateTurning(defaultInputs)
    expect(result.results.vf).toBeCloseTo(190.99, 0)
  })
  it('calculates chip thickness for κr=90°', () => {
    const result = calculateTurning(defaultInputs)
    expect(result.results.h).toBeCloseTo(0.2, 4)
  })
  it('calculates chip width for κr=90°', () => {
    const result = calculateTurning(defaultInputs)
    expect(result.results.b).toBeCloseTo(2, 4)
  })
  it('calculates chip cross section', () => {
    const result = calculateTurning(defaultInputs)
    expect(result.results.A).toBeCloseTo(0.4, 4)
  })
  it('calculates specific cutting force', () => {
    const result = calculateTurning(defaultInputs)
    expect(result.results.kc).toBeCloseTo(3140, -1)
  })
  it('calculates cutting force', () => {
    const result = calculateTurning(defaultInputs)
    expect(result.results.Fc).toBeCloseTo(1256, -1)
  })
  it('calculates feed force for κr=90°', () => {
    const result = calculateTurning(defaultInputs)
    expect(result.results.Ff).toBeCloseTo(result.results.Fc * 0.3, 0)
  })
  it('calculates passive force for κr=90°', () => {
    const result = calculateTurning(defaultInputs)
    expect(result.results.Fp).toBeCloseTo(result.results.Fc * 0.2, 0)
  })
  it('calculates feed force for κr=45°', () => {
    const input = { ...defaultInputs, kappaR: 45 }
    const result = calculateTurning(input)
    expect(result.results.Ff).toBeCloseTo(result.results.Fc * 0.4414, 0)
  })
  it('calculates cutting power', () => {
    const result = calculateTurning(defaultInputs)
    expect(result.results.Pc).toBeCloseTo(result.results.Fc * 150 / 60000, 2)
  })
  it('calculates drive power with efficiency', () => {
    const result = calculateTurning(defaultInputs)
    expect(result.results.P).toBeCloseTo(result.results.Pc / 0.8, 2)
  })
  it('calculates torque', () => {
    const result = calculateTurning(defaultInputs)
    expect(result.results.M).toBeCloseTo(result.results.Fc * 50 / 2000, 2)
  })
  it('calculates material removal rate', () => {
    const result = calculateTurning(defaultInputs)
    expect(result.results.Q).toBeCloseTo(60, 0)
  })
  it('calculates utilization', () => {
    const result = calculateTurning(defaultInputs)
    expect(result.results.utilization).toBeCloseTo((result.results.P / 8) * 100, 1)
  })
  it('returns 14 calculation steps', () => {
    const result = calculateTurning(defaultInputs)
    expect(result.steps.length).toBe(15)
  })
})
