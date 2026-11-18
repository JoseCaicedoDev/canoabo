import { describe, expect, it } from 'vitest'
import { featureTitle, toAttributeRows } from './featureAttributes'

describe('toAttributeRows', () => {
  it('keeps field order, skips empty values and appends units', () => {
    const rows = toAttributeRows({ B: null, A: 760, C: '' }, [
      { key: 'A', label: 'Altitud', unit: 'm', format: 'number' },
      { key: 'B', label: 'Vacío' },
      { key: 'C', label: 'Texto vacío' },
    ])
    expect(rows).toEqual([{ key: 'A', label: 'Altitud', value: '760 m' }])
  })

  it('converts square meters to hectares', () => {
    const [row] = toAttributeRows({ AREA: 2_335_610.75 }, [
      { key: 'AREA', label: 'Superficie', unit: 'ha', format: 'hectares' },
    ])
    expect(row?.value).toBe('233,56 ha')
  })
})

describe('featureTitle', () => {
  it('uses the title field when present', () => {
    expect(featureTitle({ NOMBRE: 'Valle Hondo' }, 'NOMBRE', 'Perfil')).toBe('Valle Hondo')
  })

  it('falls back when the title field is missing or empty', () => {
    expect(featureTitle({ NOMBRE: null }, 'NOMBRE', 'Perfil')).toBe('Perfil')
    expect(featureTitle({}, undefined, 'Embalse')).toBe('Embalse')
  })
})
