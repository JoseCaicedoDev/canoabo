---
titulo: Capas del geovisor Canoabo (exportación qgis2web)
tipo: fuente
tags: [suelos, capacidad-de-uso, hidrografia, vialidad, sig]
fuentes: []
creado: 2026-11-18
actualizado: 2026-11-18
estado: borrador
archivo_raw: raw/canoabo-qgis2web/
autor: desconocido
fecha_fuente: desconocida
---

# Capas del geovisor Canoabo (exportación qgis2web)

> Visor web exportado desde QGIS con el complemento qgis2web (OpenLayers). Contiene 5 capas vectoriales de la [[cuenca-rio-canoabo]] en WGS84: unidades de suelo con [[capacidad-de-uso-de-la-tierra]], el [[embalse-canoabo]], la red hídrica, la vialidad y 49 [[perfil-de-suelo|perfiles de suelo]].

## Puntos clave
- Extensión: −68,341 a −68,207 de longitud, 10,262 a 10,414 de latitud (unos 14,7 × 16,9 km).
- Las capas están como GeoJSON dentro de archivos JS (`var geojson_x = {...}`); se convierten con `npm run data:extract` a `public/data/layers/`.
- El estilo original solo clasifica la capa de suelos por `CUSO_DEF` (27 clases, rampa verde ordenada alfabéticamente, no por clase).
- El mapa base original (Stamen Terrain) ya no funciona sin clave; el geovisor nuevo usa otros mapas base.

## Datos y cifras relevantes

| Capa (archivo) | Geometría | Elementos | Atributos destacados |
|---|---|---|---|
| Unidades de suelo (`x550.js`, título «x55») | Polígonos | 175 | `CUSO_DEF`, `NOMBRE_1`, `GEO`, `VEG`, `PEN`, `ERO`, `TAXO_G1`, `ZOVI_DEF2`, química por horizonte, clima (`PRE_PRO`, `TEM_PRO`, `ETO_PRO`), `AREA1` (m²) |
| Embalse (`embalse1.js`) | Polígono | 1 | `AREA` 2 335 611 m² (≈ 233,6 ha), `PERIMETER` 18 921 m |
| Red hídrica (`rios22.js`) | Líneas | 1791 | `NOMBRE` («Rio Canoabo» o «Desonocido»), `LENGTH` (m) |
| Vialidad (`vialidad3.js`) | Líneas | 315 | Todos los atributos vacíos |
| Perfiles de suelo (`suelo84.js`) | Puntos | 49 | `NOMBRE`, `NUMERO`, `LOCALIDAD`, `ALTURA`, `USO`, `VEGETACION`, horizontes H1–H4 (profundidad, textura, pH, MO, P, K, Ca, Mg), `TAXO_1`, `CUSO`, `ESTE`/`NORTE` (UTM) |

## Entidades y conceptos mencionados
[[cuenca-rio-canoabo]] · [[embalse-canoabo]] · [[capacidad-de-uso-de-la-tierra]] · [[perfil-de-suelo]] · [[zonas-de-vida-holdridge]] · [[taxonomia-de-suelos]]

## Contradicciones / tensiones con el wiki
Ninguna (primera fuente).

## Calidad de datos detectada
- Errores de tipeo en valores: «Desonocido», «B sque SV Medio Ralo», «Ocri o», «R pido», «Ctricos», «El Gunieo», «Regolito in  itu».
- Textos truncados en la capa de suelos (límite de 25 caracteres del shapefile): «Fila La Media Lun», «Coluvial - Esquistos y Gn».
- Valores 0 que parecen significar «sin dato» en la química (p. ej. `H4_*` = 0).
- Las clases `CUSO` de los perfiles (`VTp`, `VIITp`…) usan una notación distinta de `CUSO_DEF` de las unidades (`Vp`, `VIIp`…).

## Preguntas abiertas
- ¿Autores, institución, año y metodología del estudio?
- ¿Significado oficial de los códigos `GEO`, `VEG`, `PEN`, `ERO`, `NMH` y de los sufijos de clase (`p`, `e`, `h`, `f`, `r`)?
- ¿Sistema de clasificación de capacidad de uso usado (USDA adaptado, COPLANARH)?
- ¿Datum original de `ESTE`/`NORTE` (REGVEN/WGS84 UTM 19N o La Canoa)?
