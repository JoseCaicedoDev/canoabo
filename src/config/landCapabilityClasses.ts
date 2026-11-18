import type { Category } from '@/domain/layer'
import type { CapabilityClass } from '@/domain/landCapability'

export interface CapabilityRung extends Category {
  readonly value: CapabilityClass
  readonly description: string
}

/**
 * Escalera de capacidad de uso, de menor a mayor limitación.
 * Colores: convención cartográfica habitual de mapas de capacidad de uso (I verde claro … VIII violeta).
 * Reemplaza la rampa verde alfabética de la exportación de QGIS, que no ordenaba las clases.
 * Descripciones: significado general de las clases del sistema USDA (conocimiento externo; ver
 * wiki/conceptos/capacidad-de-uso-de-la-tierra.md), no la leyenda oficial del estudio.
 */
export const CAPABILITY_LADDER: readonly CapabilityRung[] = [
  { value: 'I', label: 'I', color: '#9ccf6f', description: 'Ligeras' },
  { value: 'II', label: 'II', color: '#f0cf3a', description: 'Moderadas' },
  { value: 'III', label: 'III', color: '#d4473a', description: 'Severas' },
  { value: 'IV', label: 'IV', color: '#3f7cc0', description: 'Muy severas' },
  { value: 'V', label: 'V', color: '#2e6a3a', description: 'Uso restringido' },
  { value: 'VI', label: 'VI', color: '#e3862d', description: 'Pastos y bosque' },
  { value: 'VII', label: 'VII', color: '#85573a', description: 'Bosque protector' },
  { value: 'VIII', label: 'VIII', color: '#7a4e9a', description: 'Protección' },
  { value: 'EMB', label: 'EMB', color: '#3a5fd0', description: 'Embalse' },
]

export const CAPABILITY_FALLBACK_COLOR = '#b9c1b6'

/** Atributos que contienen un código de capacidad de uso (unidades: CUSO_DEF; perfiles: CUSO). */
export const CAPABILITY_ATTRIBUTE_KEYS: readonly string[] = ['CUSO_DEF', 'CUSO']
