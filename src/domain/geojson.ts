/** Subconjunto de GeoJSON (RFC 7946) que usa el visor. */
export type AttributeValue = string | number | boolean | null

export type FeatureProperties = Record<string, AttributeValue>

export interface Feature {
  readonly type: 'Feature'
  readonly id?: string | number
  readonly properties: FeatureProperties
  readonly geometry: { readonly type: string; readonly coordinates: unknown } | null
}

export interface FeatureCollection {
  readonly type: 'FeatureCollection'
  readonly features: readonly Feature[]
}

/** [oeste, sur, este, norte] en grados. */
export type BoundingBox = readonly [number, number, number, number]
