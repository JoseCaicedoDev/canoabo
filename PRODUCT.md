# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vue 3 (Composition API, `<script setup>`) + TypeScript strict + Tailwind CSS v4 + Vite, MapLibre GL para el mapa. Sitio estático en GitHub Pages, sin backend: todo procesamiento corre en el navegador. Detalle en `CLAUDE.md` §12–§14.

## Users

Audiencia mixta, todas confirmadas:
- **Técnicos y planificadores** (SIG, agronomía, ordenación territorial) que consultan suelos y capacidad de uso para decidir sobre el uso de la tierra.
- **Académicos** (docentes, jurado) que revisan el estudio.
- **Productores y comunidad** de la cuenca, sin formación en SIG.
- **Público general** interesado en la cuenca y el embalse.

Uso principal en **escritorio**; también **móvil en campo** durante salidas a la cuenca, con posible señal débil.

## Product Purpose

Canoabo es un geovisor de la cuenca del río Canoabo (Carabobo, Venezuela) para **explorar y analizar** la información de suelos, capacidad de uso, hidrografía y vialidad: ver las capas, consultar sus atributos y, progresivamente, filtrar, comparar y analizar datos directamente en el navegador. Éxito: cualquiera de las audiencias encuentra qué hay en un lugar de la cuenca y por qué, sin instalar software SIG.

## Positioning

Lleva un estudio de suelos detallado de una cuenca concreta (175 unidades con capacidad de uso, 49 perfiles con análisis de laboratorio por horizonte) a un visor web abierto, que funciona sin servidor y sirve tanto al técnico como al productor.

## Operating Context

- Los datos provienen de un proyecto QGIS exportado con qgis2web (`raw/canoabo-qgis2web/`) y se convierten a GeoJSON con `npm run data:extract`.
- Uso típico: abrir el mapa, encender/apagar capas, tocar un polígono o perfil y leer su ficha.
- En campo: pantallas pequeñas, luz solar, conexión intermitente.

## Capabilities and Constraints

- **Capas actuales**: capacidad de uso de la tierra (polígonos, atributo `CUSO_DEF`), embalse, red hídrica, vialidad (sin atributos) y perfiles de suelo (puntos).
- **Restricciones técnicas**: solo frontend; datos estáticos; sin claves de API privadas; mapas base sin clave.
- **Idioma**: interfaz en español.
- **Terminología**: muchos atributos son códigos (p. ej. `GEO`, `VEG`, `ERO`, `ZOVI_DEF2`, clases de capacidad `VIp`, `IVp/Vph`). Falta un glosario oficial de su significado; no inventarlo.
- **Por decidir**: herramientas concretas de análisis (filtros, gráficos, comparación), funcionamiento sin conexión.

## Evidence on Hand

- Datos reales en `public/data/layers/*.geojson` (origen: `raw/canoabo-qgis2web/`).
- No hay autores, institución, fecha ni metodología del estudio registrados: no fabricarlos ni mostrar créditos inventados.

## Product Principles

1. **El dato manda**: el mapa y la ficha muestran la información real del estudio, sin adornos que la oculten.
2. **Legible para no especialistas**: los códigos técnicos se explican cuando exista la fuente; nunca se inventa su significado.
3. **Funciona en campo**: utilizable en un teléfono, con poca señal y a pleno sol.
4. **Sin servidor**: todo cálculo ocurre en el navegador del visitante.

## Accessibility & Inclusion

Audiencia amplia que incluye personas sin formación técnica: contraste suficiente para uso a la intemperie, objetivos táctiles cómodos y leyendas que no dependan solo del color.
