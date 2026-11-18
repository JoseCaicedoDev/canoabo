/** Ancho desde el que se usa la disposición de tres columnas (Tailwind `lg`). */
export const WIDE_LAYOUT_QUERY = '(min-width: 1024px)'

/** Altura máxima de las hojas inferiores en móvil; debe coincidir con `max-h-[55dvh]` de MapView.vue. */
export const MOBILE_SHEET_HEIGHT_RATIO = 0.55

export function isWideLayout(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(WIDE_LAYOUT_QUERY).matches
}
