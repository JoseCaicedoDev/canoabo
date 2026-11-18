import { describe, expect, it } from 'vitest'
import type { LayerDefinition } from '@/domain/layer'
import { translateLayer } from './styleTranslator'

const base: Omit<LayerDefinition, 'style'> = {
  id: 'suelos',
  title: 'Suelos',
  itemLabel: 'Unidad',
  description: '',
  dataPath: 'x.geojson',
  fields: [],
  visibleByDefault: true,
}

describe('translateLayer', () => {
  it('builds a match expression for categorized fills and an outline', () => {
    const result = translateLayer({
      ...base,
      style: {
        kind: 'categorized-fill',
        property: 'CUSO_DEF',
        categories: [{ value: 'Vp', label: 'Vp', color: '#111' }],
        fallbackColor: '#999',
        opacity: 0.6,
        outlineColor: '#000',
      },
    })
    expect(result.layers.map((layer) => layer.id)).toEqual(['suelos:fill', 'suelos:halo', 'suelos:outline'])
    expect(result.interactiveLayerIds).toEqual(['suelos:fill'])
    const fill = result.layers[0] as { paint: Record<string, unknown> }
    expect(fill.paint['fill-color']).toEqual(['match', ['to-string', ['get', 'CUSO_DEF']], 'Vp', '#111', '#999'])
  })

  it('adds a casing below lines that declare one', () => {
    const result = translateLayer({
      ...base,
      style: { kind: 'line', color: '#fff', width: 1, casingColor: '#000' },
    })
    expect(result.layers.map((layer) => layer.id)).toEqual(['suelos:casing', 'suelos:line'])
  })
})
