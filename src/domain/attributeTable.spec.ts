import { describe, expect, it } from 'vitest'
import {
  boundsOf,
  columnsOf,
  filterFeatures,
  nextSort,
  paginate,
  sortFeatures,
} from './attributeTable'
import type { Feature, FeatureCollection } from './geojson'

function feature(id: number, properties: Feature['properties'], coordinates: unknown = [0, 0]): Feature {
  return { type: 'Feature', id, properties, geometry: { type: 'Point', coordinates } }
}

const collection: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    feature(0, { NOMBRE: 'Río Canoabo', AREA1: '300', ZV: 'BsT' }),
    feature(1, { NOMBRE: 'Desonocido', AREA1: '1200', ZV: null }),
    feature(2, { NOMBRE: 'Las Garcitas', AREA1: '45', ZV: 'BhPm' }),
  ],
}

describe('columnsOf', () => {
  it('puts curated fields first with their labels and detects numeric columns', () => {
    const columns = columnsOf(collection, [{ key: 'AREA1', label: 'Superficie' }])
    expect(columns.map((column) => column.label)).toEqual(['Superficie', 'NOMBRE', 'ZV'])
    expect(columns[0]?.numeric).toBe(true)
    expect(columns[1]?.numeric).toBe(false)
  })
})

describe('filterFeatures', () => {
  it('matches any attribute ignoring case and accents', () => {
    expect(filterFeatures(collection.features, 'rio').map((item) => item.id)).toEqual([0])
    expect(filterFeatures(collection.features, '  ')).toHaveLength(3)
  })
})

describe('sortFeatures', () => {
  const columns = columnsOf(collection, [])

  it('sorts numeric text as numbers', () => {
    const sorted = sortFeatures(collection.features, { key: 'AREA1', direction: 'asc' }, columns)
    expect(sorted.map((item) => item.id)).toEqual([2, 0, 1])
  })

  it('keeps empty values last in both directions', () => {
    const descending = sortFeatures(collection.features, { key: 'ZV', direction: 'desc' }, columns)
    expect(descending.at(-1)?.id).toBe(1)
  })
})

describe('nextSort', () => {
  it('cycles asc → desc → none', () => {
    const asc = nextSort(null, 'A')
    const desc = nextSort(asc, 'A')
    expect([asc?.direction, desc?.direction, nextSort(desc, 'A')]).toEqual(['asc', 'desc', null])
  })
})

describe('paginate', () => {
  it('clamps the page into range', () => {
    expect(paginate([1, 2, 3, 4, 5], 9, 2)).toEqual({ items: [5], page: 3, pageCount: 3 })
  })
})

describe('boundsOf', () => {
  it('computes the extent of nested coordinates', () => {
    const polygon = feature(0, {}, [[[1, 2], [3, 5], [-1, 4]]])
    expect(boundsOf(polygon)).toEqual([-1, 2, 3, 5])
  })
})
