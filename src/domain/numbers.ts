import type { AttributeValue } from './geojson'

const NUMERIC_TEXT = /^-?\d+(?:[.,]\d+)?$/

/** Número finito a partir de un atributo; acepta texto numérico («5584635»), frecuente en la fuente. */
export function toFiniteNumber(value: AttributeValue | undefined): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'string' && NUMERIC_TEXT.test(value.trim())) return Number(value.trim().replace(',', '.'))
  return null
}
