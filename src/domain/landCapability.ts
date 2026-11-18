import type { AttributeValue, Feature, FeatureCollection } from './geojson'
import { toFiniteNumber } from './numbers'

/** Clase principal de capacidad de uso. `EMB` = embalse. */
export type CapabilityClass = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII' | 'VIII' | 'EMB'

/** Propiedad derivada que se agrega a cada unidad de suelo al cargarla. */
export const CAPABILITY_CLASS_PROPERTY = 'CLASE_CU'

// El orden importa: VIII antes que VII y VI, IV antes que V, III antes que II e I.
const MAIN_CLASS_PATTERN = /^(VIII|VII|VI|IV|V|III|II|I)(?![IVX])/

/** Extrae la clase principal de un código como «VIp/VIIpr» → «VI». Asociaciones: manda la primera. */
export function mainCapabilityClass(code: AttributeValue | undefined): CapabilityClass | null {
  if (typeof code !== 'string') return null
  const normalized = code.trim()
  if (normalized === 'EMB') return 'EMB'
  const match = MAIN_CLASS_PATTERN.exec(normalized)
  return (match?.[1] as CapabilityClass | undefined) ?? null
}

function withClass(feature: Feature, sourceProperty: string): Feature {
  const capabilityClass = mainCapabilityClass(feature.properties[sourceProperty])
  return { ...feature, properties: { ...feature.properties, [CAPABILITY_CLASS_PROPERTY]: capabilityClass } }
}

/** Devuelve una colección nueva con la clase principal calculada en cada elemento. */
export function withCapabilityClass(collection: FeatureCollection, sourceProperty: string): FeatureCollection {
  return { ...collection, features: collection.features.map((feature) => withClass(feature, sourceProperty)) }
}

/** Fracción (0–1) de la superficie total que ocupa cada valor de `property`. */
export function areaShareByValue(
  collection: FeatureCollection,
  property: string,
  areaProperty: string,
): Readonly<Record<string, number>> {
  const totals = new Map<string, number>()
  let grandTotal = 0
  for (const { properties } of collection.features) {
    const value = properties[property]
    const area = toFiniteNumber(properties[areaProperty])
    if (value === null || value === undefined || area === null) continue
    totals.set(String(value), (totals.get(String(value)) ?? 0) + area)
    grandTotal += area
  }
  if (grandTotal === 0) return {}
  return Object.fromEntries([...totals].map(([value, area]) => [value, area / grandTotal]))
}
