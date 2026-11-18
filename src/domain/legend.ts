import type { LayerStyle } from './layer'

export interface LegendEntry {
  readonly label: string
  readonly color: string
  readonly symbol: 'area' | 'line' | 'point'
}

const OTHER_CATEGORY_LABEL = 'Otras'

export function legendFor(style: LayerStyle, layerTitle: string): readonly LegendEntry[] {
  switch (style.kind) {
    case 'fill':
      return [{ label: layerTitle, color: style.color, symbol: 'area' }]
    case 'categorized-fill':
      return [
        ...style.categories.map((category) => ({
          label: category.label,
          color: category.color,
          symbol: 'area' as const,
        })),
        { label: OTHER_CATEGORY_LABEL, color: style.fallbackColor, symbol: 'area' },
      ]
    case 'line':
      return [{ label: layerTitle, color: style.color, symbol: 'line' }]
    case 'circle':
      return [{ label: layerTitle, color: style.color, symbol: 'point' }]
  }
}
