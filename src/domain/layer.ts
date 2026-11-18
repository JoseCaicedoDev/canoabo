import type { FeatureCollection } from './geojson'

/** Definición declarativa de una capa. Agregar una capa = agregar una definición (principio abierto/cerrado). */

export interface Category {
  readonly value: string
  readonly label: string
  readonly color: string
}

export type LayerStyle =
  | {
      readonly kind: 'fill'
      readonly color: string
      readonly opacity: number
      readonly outlineColor: string
    }
  | {
      readonly kind: 'categorized-fill'
      readonly property: string
      readonly categories: readonly Category[]
      readonly fallbackColor: string
      readonly opacity: number
      readonly outlineColor: string
    }
  | {
      readonly kind: 'line'
      readonly color: string
      readonly width: number
      readonly opacity?: number
      readonly casingColor?: string
    }
  | {
      readonly kind: 'circle'
      readonly color: string
      readonly radius: number
      readonly strokeColor: string
    }

/** Vista de detalle especializada para la ficha de un elemento. */
export type DetailView = 'soil-profile'

export type FieldFormat = 'text' | 'number' | 'hectares'

export interface AttributeField {
  readonly key: string
  readonly label: string
  readonly unit?: string
  readonly format?: FieldFormat
}

export interface LayerDefinition {
  readonly id: string
  readonly title: string
  /** Nombre de un elemento en singular, para la ficha («Perfil de suelo»). */
  readonly itemLabel: string
  /** Atributo que acompaña al nombre singular en la ficha («Perfil de suelo · 1-1»). */
  readonly subtitleField?: string
  readonly description: string
  /** Ruta relativa a la raíz publicada del sitio (public/). */
  readonly dataPath: string
  readonly style: LayerStyle
  /** Atributo que da nombre a un elemento en la ficha de detalle. */
  readonly titleField?: string
  /** Campos visibles en la ficha. Vacío = la capa no es consultable. */
  readonly fields: readonly AttributeField[]
  readonly visibleByDefault: boolean
  readonly detailView?: DetailView
  /** Transformación pura aplicada a los datos al cargarlos (p. ej. atributos derivados). */
  readonly enrich?: (data: FeatureCollection) => FeatureCollection
  /** Atributo por el que se puede enfocar la capa y atributo de superficie para calcular proporciones. */
  readonly focus?: { readonly property: string; readonly areaProperty: string }
}

export interface BasemapDefinition {
  readonly id: string
  readonly title: string
  readonly tileUrls: readonly string[]
  readonly attribution: string
  readonly maxZoom: number
  /** Opacidad de las teselas sobre el fondo gley; < 1 integra el mapa base al mundo del visor. */
  readonly opacity: number
}

export function isQueryable(layer: LayerDefinition): boolean {
  return layer.fields.length > 0
}
