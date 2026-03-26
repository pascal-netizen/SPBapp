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
