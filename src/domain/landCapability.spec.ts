import { describe, expect, it } from 'vitest'
import type { FeatureCollection } from './geojson'
import { areaShareByValue, mainCapabilityClass, withCapabilityClass } from './landCapability'

describe('mainCapabilityClass', () => {
  it.each([
    ['VIIIp', 'VIII'],
    ['VIIp/VIIpr', 'VII'],
    ['VIpe/VIIpeh', 'VI'],
    ['Vph/IVp', 'V'],
    ['IVp', 'IV'],
    ['IIIp/IVpr', 'III'],
    ['I/IIf', 'I'],
    ['VTp', 'V'],
    ['EMB', 'EMB'],
  ])('%s → %s', (code, expected) => {
    expect(mainCapabilityClass(code)).toBe(expected)
  })

  it('returns null for missing or unknown codes', () => {
    expect(mainCapabilityClass(null)).toBeNull()
    expect(mainCapabilityClass('xyz')).toBeNull()
  })
})

const collection: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { CUSO_DEF: 'VIp', AREA1: 300 }, geometry: null },
    { type: 'Feature', properties: { CUSO_DEF: 'VIp/VIIpr', AREA1: 100 }, geometry: null },
    { type: 'Feature', properties: { CUSO_DEF: 'IVp', AREA1: '100' }, geometry: null },
  ],
}

describe('withCapabilityClass + areaShareByValue', () => {
  it('derives the main class and its share of the total area', () => {
    const enriched = withCapabilityClass(collection, 'CUSO_DEF')
    expect(areaShareByValue(enriched, 'CLASE_CU', 'AREA1')).toEqual({ VI: 0.8, IV: 0.2 })
  })

  it('does not mutate the source collection', () => {
    withCapabilityClass(collection, 'CUSO_DEF')
    expect(collection.features[0]?.properties).not.toHaveProperty('CLASE_CU')
  })
})
