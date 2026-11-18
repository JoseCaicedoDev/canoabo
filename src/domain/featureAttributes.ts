import type { AttributeValue, FeatureProperties } from './geojson'
import type { AttributeField, FieldFormat } from './layer'
import { toFiniteNumber } from './numbers'

export interface AttributeRow {
  readonly key: string
  readonly label: string
  readonly value: string
}

const SQUARE_METERS_PER_HECTARE = 10_000
const numberFormat = new Intl.NumberFormat('es-VE', { maximumFractionDigits: 2 })

function isEmpty(value: AttributeValue | undefined): value is null | undefined {
  return value === null || value === undefined || value === ''
}

function formatValue(value: AttributeValue, format: FieldFormat = 'text'): string {
  const amount = format === 'text' ? null : toFiniteNumber(value)
  if (amount === null) return String(value)
  return numberFormat.format(format === 'hectares' ? amount / SQUARE_METERS_PER_HECTARE : amount)
}

/** Convierte los atributos crudos en filas legibles, en el orden de `fields`, omitiendo vacíos. */
export function toAttributeRows(
  properties: FeatureProperties,
  fields: readonly AttributeField[],
): readonly AttributeRow[] {
  return fields.flatMap((field) => {
    const value = properties[field.key]
    if (isEmpty(value)) return []
    const formatted = formatValue(value, field.format)
    return [{ key: field.key, label: field.label, value: field.unit ? `${formatted} ${field.unit}` : formatted }]
  })
}

export function featureTitle(
  properties: FeatureProperties,
  titleField: string | undefined,
  fallback: string,
): string {
  const value = titleField ? properties[titleField] : undefined
  return isEmpty(value) ? fallback : String(value)
}
