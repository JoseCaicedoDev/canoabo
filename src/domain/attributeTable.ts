import type { AttributeValue, BoundingBox, Feature, FeatureCollection } from './geojson'
import type { AttributeField } from './layer'
import { toFiniteNumber } from './numbers'

export interface TableColumn {
  readonly key: string
  readonly label: string
  /** Columna mayoritariamente numérica: se alinea a la derecha y se ordena como número. */
  readonly numeric: boolean
}

export type SortDirection = 'asc' | 'desc'

export interface TableSort {
  readonly key: string
  readonly direction: SortDirection
}

/** Muestra para decidir si una columna es numérica sin recorrer miles de filas. */
const NUMERIC_SAMPLE_SIZE = 50
const NUMERIC_SHARE_THRESHOLD = 0.8

function isNumericColumn(features: readonly Feature[], key: string): boolean {
  const values = features
    .slice(0, NUMERIC_SAMPLE_SIZE)
    .map((feature) => feature.properties[key])
    .filter((value) => value !== null && value !== undefined && value !== '')
  if (values.length === 0) return false
  const numeric = values.filter((value) => toFiniteNumber(value) !== null).length
  return numeric / values.length >= NUMERIC_SHARE_THRESHOLD
}

/**
 * Todas las columnas de la capa: primero los campos curados del catálogo (con su etiqueta),
 * luego el resto de atributos en el orden de la fuente, con su nombre original.
 */
export function columnsOf(collection: FeatureCollection, fields: readonly AttributeField[]): readonly TableColumn[] {
  const keys = new Set<string>()
  for (const feature of collection.features) Object.keys(feature.properties).forEach((key) => keys.add(key))
  const curated = fields.filter((field) => keys.has(field.key))
  const curatedKeys = new Set(curated.map((field) => field.key))
  const rest = [...keys].filter((key) => !curatedKeys.has(key))
  return [
    ...curated.map((field) => ({ key: field.key, label: field.label })),
    ...rest.map((key) => ({ key, label: key })),
  ].map((column) => ({ ...column, numeric: isNumericColumn(collection.features, column.key) }))
}

function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/** Filtra por texto en cualquier atributo, sin distinguir mayúsculas ni acentos. */
export function filterFeatures(features: readonly Feature[], query: string): readonly Feature[] {
  const needle = normalize(query.trim())
  if (needle === '') return features
  return features.filter((feature) =>
    Object.values(feature.properties).some((value) => value !== null && normalize(String(value)).includes(needle)),
  )
}

function compareValues(a: AttributeValue | undefined, b: AttributeValue | undefined, numeric: boolean): number {
  const aEmpty = a === null || a === undefined || a === ''
  const bEmpty = b === null || b === undefined || b === ''
  if (aEmpty || bEmpty) return aEmpty === bEmpty ? 0 : aEmpty ? 1 : -1
  if (numeric) {
    const aNumber = toFiniteNumber(a)
    const bNumber = toFiniteNumber(b)
    if (aNumber !== null && bNumber !== null) return aNumber - bNumber
  }
  return String(a).localeCompare(String(b), 'es', { numeric: true, sensitivity: 'base' })
}

/** Ordena sin mutar; los vacíos van siempre al final, en ambos sentidos. */
export function sortFeatures(
  features: readonly Feature[],
  sort: TableSort | null,
  columns: readonly TableColumn[],
): readonly Feature[] {
  if (!sort) return features
  const numeric = columns.find((column) => column.key === sort.key)?.numeric ?? false
  const factor = sort.direction === 'asc' ? 1 : -1
  return [...features].sort((a, b) => {
    const aValue = a.properties[sort.key]
    const bValue = b.properties[sort.key]
    const emptyOrder = compareValues(aValue, bValue, numeric)
    const isEmpty = (value: AttributeValue | undefined) => value === null || value === undefined || value === ''
    return isEmpty(aValue) || isEmpty(bValue) ? emptyOrder : emptyOrder * factor
  })
}

/** Ciclo de ordenación al pulsar una cabecera: ascendente → descendente → sin orden. */
export function nextSort(current: TableSort | null, key: string): TableSort | null {
  if (current?.key !== key) return { key, direction: 'asc' }
  return current.direction === 'asc' ? { key, direction: 'desc' } : null
}

export interface Page<T> {
  readonly items: readonly T[]
  readonly page: number
  readonly pageCount: number
}

export function paginate<T>(items: readonly T[], page: number, pageSize: number): Page<T> {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const current = Math.min(Math.max(page, 1), pageCount)
  return { items: items.slice((current - 1) * pageSize, current * pageSize), page: current, pageCount }
}

/** Extensión [oeste, sur, este, norte] de la geometría de un elemento; null si no tiene. */
export function boundsOf(feature: Feature): BoundingBox | null {
  const box = [Infinity, Infinity, -Infinity, -Infinity]
  const visit = (coordinates: unknown): void => {
    if (!Array.isArray(coordinates)) return
    if (typeof coordinates[0] === 'number' && typeof coordinates[1] === 'number') {
      const [x, y] = coordinates as [number, number]
      box[0] = Math.min(box[0] ?? x, x)
      box[1] = Math.min(box[1] ?? y, y)
      box[2] = Math.max(box[2] ?? x, x)
      box[3] = Math.max(box[3] ?? y, y)
      return
    }
    coordinates.forEach(visit)
  }
  visit(feature.geometry?.coordinates)
  const [west = Infinity, south = Infinity, east = -Infinity, north = -Infinity] = box
  return Number.isFinite(west) ? [west, south, east, north] : null
}
