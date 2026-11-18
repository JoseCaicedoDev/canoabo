import type { AttributeValue, FeatureProperties } from './geojson'
import { toFiniteNumber } from './numbers'

export interface DepthRange {
  readonly top: number
  /** null = sin límite inferior medido («> 30»). */
  readonly bottom: number | null
}

export interface Horizon {
  readonly name: string
  readonly depth: DepthRange
  readonly texture: string | null
  readonly ph: number | null
  readonly organicMatter: number | null
}

const HORIZON_NAMES = ['H1', 'H2', 'H3', 'H4'] as const
const RANGE_PATTERN = /^(\d+(?:[.,]\d+)?)\s*-\s*(\d+(?:[.,]\d+)?)$/
const OPEN_PATTERN = /^>\s*(\d+(?:[.,]\d+)?)$/

function toNumber(text: string): number {
  return Number(text.replace(',', '.'))
}

/** Interpreta «0 - 12», «6 -25» o «> 30». Devuelve null si el texto no es una profundidad. */
export function parseDepthRange(value: AttributeValue | undefined): DepthRange | null {
  if (typeof value !== 'string') return null
  const text = value.trim()
  const range = RANGE_PATTERN.exec(text)
  if (range?.[1] && range[2]) return { top: toNumber(range[1]), bottom: toNumber(range[2]) }
  const open = OPEN_PATTERN.exec(text)
  if (open?.[1]) return { top: toNumber(open[1]), bottom: null }
  return null
}

/** En la fuente, 0 significa «sin dato» para pH (un pH 0 no existe en suelos). */
function measuredPh(value: AttributeValue | undefined): number | null {
  const ph = toFiniteNumber(value)
  return ph !== null && ph > 0 ? ph : null
}

function text(value: AttributeValue | undefined): string | null {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : null
}

/** Horizontes H1–H4 de un perfil, omitiendo los que no tienen profundidad registrada. */
export function horizonsOf(properties: FeatureProperties): readonly Horizon[] {
  return HORIZON_NAMES.flatMap((name) => {
    const depth = parseDepthRange(properties[`${name}_PROF`])
    if (!depth) return []
    const ph = measuredPh(properties[`${name}_PH`])
    const organicMatter = toFiniteNumber(properties[`${name}_MO`])
    return [
      {
        name,
        depth,
        texture: text(properties[`${name}_TEXT`]),
        ph,
        // Sin pH medido, un 0 de materia orgánica es ausencia de análisis, no un valor.
        organicMatter: organicMatter !== null && (ph !== null || organicMatter > 0) ? organicMatter : null,
      },
    ]
  })
}

/**
 * Extensión solo gráfica del último horizonte abierto («> 30»), que se dibuja desvanecido y sin borde
 * inferior: no es una profundidad medida y no se muestra como cifra.
 */
export const OPEN_HORIZON_EXTENSION_CM = 20

export function drawnBottom(depth: DepthRange): number {
  return depth.bottom ?? depth.top + OPEN_HORIZON_EXTENSION_CM
}
