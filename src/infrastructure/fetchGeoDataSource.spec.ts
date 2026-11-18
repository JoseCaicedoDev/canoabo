import { describe, expect, it } from 'vitest'
import { FetchGeoDataSource, GeoDataError } from './fetchGeoDataSource'

function respondWith(body: unknown, status = 200): typeof fetch {
  return async () => new Response(JSON.stringify(body), { status })
}

describe('FetchGeoDataSource', () => {
  const base = 'https://example.org/Canoabo/'

  it('resolves paths against the site base url', async () => {
    let requested = ''
    const source = new FetchGeoDataSource(base, async (input) => {
      requested = String(input)
      return new Response(JSON.stringify({ type: 'FeatureCollection', features: [] }))
    })
    await source.load('data/layers/rios.geojson')
    expect(requested).toBe('https://example.org/Canoabo/data/layers/rios.geojson')
  })

  it('rejects responses that are not a FeatureCollection', async () => {
    const source = new FetchGeoDataSource(base, respondWith({ type: 'Feature' }))
    await expect(source.load('x.geojson')).rejects.toBeInstanceOf(GeoDataError)
  })

  it('rejects HTTP errors', async () => {
    const source = new FetchGeoDataSource(base, respondWith({}, 404))
    await expect(source.load('x.geojson')).rejects.toThrow('Error HTTP 404')
  })
})
