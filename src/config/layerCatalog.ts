import type { LayerDefinition } from '@/domain/layer'
import { CAPABILITY_CLASS_PROPERTY, withCapabilityClass } from '@/domain/landCapability'
import { CAPABILITY_FALLBACK_COLOR, CAPABILITY_LADDER } from './landCapabilityClasses'

const CAPABILITY_SOURCE_PROPERTY = 'CUSO_DEF'

/**
 * Catálogo de capas, en orden de dibujo (la primera queda debajo).
 * Origen: raw/canoabo-qgis2web, convertido con `npm run data:extract`.
 */
export const LAYER_CATALOG: readonly LayerDefinition[] = [
  {
    id: 'unidades-suelo',
    title: 'Capacidad de uso de la tierra',
    itemLabel: 'Unidad de suelo',
    subtitleField: 'CUSO_DEF',
    description: 'Unidades de suelo coloreadas por su clase principal de capacidad de uso.',
    dataPath: 'data/layers/unidades-suelo.geojson',
    style: {
      kind: 'categorized-fill',
      property: CAPABILITY_CLASS_PROPERTY,
      categories: CAPABILITY_LADDER,
      fallbackColor: CAPABILITY_FALLBACK_COLOR,
      opacity: 0.72,
      outlineColor: 'rgba(28, 26, 23, 0.35)',
    },
    titleField: 'NOMBRE_1',
    enrich: (data) => withCapabilityClass(data, CAPABILITY_SOURCE_PROPERTY),
    focus: { property: CAPABILITY_CLASS_PROPERTY, areaProperty: 'AREA1' },
    fields: [
      { key: 'CUSO_DEF', label: 'Capacidad de uso' },
      { key: 'UT_G2', label: 'Unidad de tierra' },
      { key: 'GEO', label: 'Paisaje (código)' },
      { key: 'VEG', label: 'Vegetación (código)' },
      { key: 'C_PEND_11', label: 'Clase de pendiente' },
      { key: 'ERO', label: 'Erosión (código)' },
      { key: 'TAXO_G1', label: 'Taxonomía' },
      { key: 'ZOVI_DEF2', label: 'Zona de vida' },
      { key: 'PRE_PRO', label: 'Precipitación media', unit: 'mm', format: 'number' },
      { key: 'TEM_PRO', label: 'Temperatura media', unit: '°C', format: 'number' },
      { key: 'ETO_PRO', label: 'Evapotranspiración media', unit: 'mm', format: 'number' },
      { key: 'MESESHU1', label: 'Meses húmedos' },
      { key: 'AREA1', label: 'Superficie', unit: 'ha', format: 'hectares' },
    ],
    visibleByDefault: true,
  },
  {
    id: 'embalse',
    title: 'Embalse',
    itemLabel: 'Embalse',
    description: 'Espejo de agua del embalse de Canoabo.',
    dataPath: 'data/layers/embalse.geojson',
    style: { kind: 'fill', color: '#3a5fd0', opacity: 0.9, outlineColor: '#1c1a17' },
    fields: [
      { key: 'AREA', label: 'Superficie', unit: 'ha', format: 'hectares' },
      { key: 'PERIMETER', label: 'Perímetro', unit: 'm', format: 'number' },
    ],
    visibleByDefault: true,
  },
  {
    id: 'rios',
    title: 'Red hídrica',
    itemLabel: 'Tramo de río',
    description: 'Ríos y quebradas de la cuenca.',
    dataPath: 'data/layers/rios.geojson',
    style: { kind: 'line', color: '#1f3a7a', width: 1, opacity: 0.7 },
    titleField: 'NOMBRE',
    fields: [
      { key: 'NOMBRE', label: 'Nombre' },
      { key: 'LENGTH', label: 'Longitud del tramo', unit: 'm', format: 'number' },
    ],
    visibleByDefault: true,
  },
  {
    id: 'vialidad',
    title: 'Vialidad',
    itemLabel: 'Vía',
    description: 'Red vial. Sin atributos en la fuente.',
    dataPath: 'data/layers/vialidad.geojson',
    style: { kind: 'line', color: '#ffffff', width: 1.5, casingColor: 'rgba(28, 26, 23, 0.75)' },
    fields: [],
    visibleByDefault: true,
  },
  {
    id: 'perfiles-suelo',
    title: 'Perfiles de suelo',
    itemLabel: 'Perfil de suelo',
    subtitleField: 'NUMERO',
    description: 'Puntos de muestreo con descripción y análisis de laboratorio por horizonte.',
    dataPath: 'data/layers/perfiles-suelo.geojson',
    style: { kind: 'circle', color: '#9c3b22', radius: 6, strokeColor: '#efe9df' },
    titleField: 'NOMBRE',
    detailView: 'soil-profile',
    fields: [
      { key: 'CUSO', label: 'Capacidad de uso' },
      { key: 'LOCALIDAD', label: 'Localidad' },
      { key: 'ALTURA', label: 'Altitud', unit: 'm s. n. m.', format: 'number' },
      { key: 'PENDIENTE', label: 'Pendiente', unit: '%', format: 'number' },
      { key: 'USO', label: 'Uso actual' },
      { key: 'VEGETACION', label: 'Vegetación' },
      { key: 'EROSION', label: 'Erosión' },
      { key: 'PROFUNDI', label: 'Profundidad' },
      { key: 'FERTILIDAD', label: 'Limitación por fertilidad' },
      { key: 'TAXO_1', label: 'Taxonomía' },
    ],
    visibleByDefault: true,
  },
]
