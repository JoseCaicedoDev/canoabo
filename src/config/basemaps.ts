import type { BasemapDefinition } from '@/domain/layer'

/**
 * Mapas base sin clave de API (CLAUDE.md §12.3). El primero es el predeterminado.
 * Satélite por defecto, a pedido del usuario (2026-11-18); el mapa «Claro» se retiró.
 * CARTO se descartó: desde 2026 sus teselas muestran «API KEY REQUIRED» sin clave.
 */
export const BASEMAPS: readonly BasemapDefinition[] = [
  {
    id: 'satelite',
    title: 'Satélite',
    tileUrls: [
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    ],
    attribution: 'Imágenes © Esri, Maxar, Earthstar Geographics',
    maxZoom: 19,
    opacity: 1,
  },
  {
    id: 'relieve',
    title: 'Relieve',
    tileUrls: ['a', 'b', 'c'].map(
      (subdomain) => `https://${subdomain}.tile.opentopomap.org/{z}/{x}/{y}.png`,
    ),
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · © <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
    maxZoom: 17,
    opacity: 0.85,
  },
]

/** Extensión de la cuenca, de la vista inicial del visor original. */
export const INITIAL_BOUNDS = [-68.3426, 10.2611, -68.2058, 10.4150] as const
