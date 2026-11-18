/**
 * Tono de una banda de horizonte según su materia orgánica: más MO, más oscuro,
 * como en el campo (el humus oscurece el suelo). Es una codificación del visor, no un color Munsell medido.
 */
const PALE: readonly [number, number, number] = [217, 196, 160]
const HUMUS: readonly [number, number, number] = [42, 30, 22]
const SATURATION_MO_PERCENT = 6
const DARK_BAND_THRESHOLD = 0.45

export const NO_DATA_TONE = '#c6cdc3'

function mix(from: number, to: number, ratio: number): number {
  return Math.round(from + (to - from) * ratio)
}

function darkness(organicMatter: number): number {
  return Math.min(Math.max(organicMatter / SATURATION_MO_PERCENT, 0), 1)
}

export function horizonTone(organicMatter: number | null): string {
  if (organicMatter === null) return NO_DATA_TONE
  const ratio = darkness(organicMatter)
  const [r, g, b] = PALE.map((channel, index) => mix(channel, HUMUS[index] ?? channel, ratio))
  return `rgb(${r} ${g} ${b})`
}

/** Texto claro sobre bandas oscuras, tinta sobre las claras. */
export function isDarkTone(organicMatter: number | null): boolean {
  return organicMatter !== null && darkness(organicMatter) >= DARK_BAND_THRESHOLD
}
