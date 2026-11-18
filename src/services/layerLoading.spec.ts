import { describe, expect, it, vi } from 'vitest'
import type { FeatureCollection } from '@/domain/geojson'
import type { LayerDefinition } from '@/domain/layer'
import { loadLayersInOrder } from './layerLoading'
import type { GeoDataSource } from './ports'

const EMPTY: FeatureCollection = { type: 'FeatureCollection', features: [] }

function layer(id: string): LayerDefinition {
  return {
    id,
    title: id,
    itemLabel: id,
    description: '',
    dataPath: `${id}.geojson`,
    style: { kind: 'line', color: '#000', width: 1 },
    fields: [],
    visibleByDefault: true,
  }
}

describe('loadLayersInOrder', () => {
  it('delivers results in catalog order and isolates failures', async () => {
    const source: GeoDataSource = {
      load: (path) =>
        path === 'b.geojson' ? Promise.reject(new Error('404')) : Promise.resolve(EMPTY),
    }
    const loaded: string[] = []
    const onFailed = vi.fn()

    await loadLayersInOrder([layer('a'), layer('b'), layer('c')], source, {
      onLoaded: (definition) => loaded.push(definition.id),
      onFailed,
    })

    expect(loaded).toEqual(['a', 'c'])
    expect(onFailed).toHaveBeenCalledWith(expect.objectContaining({ id: 'b' }), new Error('404'))
  })
})
