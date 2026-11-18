# Log del wiki

Registro cronológico, solo se agrega al final. Últimas entradas: `grep "^## \[" wiki/log.md | tail -5`

## [2026-11-18] esquema | Creación del proyecto
- Creado `CLAUDE.md` con el esquema inicial (arquitectura, convenciones, ingesta, consulta, lint).
- Creada la estructura `raw/` y `wiki/` (fuentes, entidades, conceptos, sintesis).
- Creados `index.md`, `log.md` y `overview.md`.
- Pendiente: definir dominio y parámetros (CLAUDE.md §10).

## [2026-11-18] esquema | Capa visual con Impeccable
- Instalado Impeccable v0.1.24 para Claude Code a nivel de proyecto (skill, 4 agentes, hooks de detección de diseño).
- Añadida la §11 «Capa visual» a `CLAUDE.md`.
- Pendiente: `/impeccable init` para crear `PRODUCT.md`.

## [2026-11-18] esquema | Plataforma: GitHub Pages, solo frontend
- Definido: el proyecto se publica solo como sitio estático en GitHub Pages, sin backend.
- Todo procesamiento y análisis corre en el navegador (JS, Web Workers, WASM).
- Añadida la §12 a `CLAUDE.md` con las reglas (datos estáticos, rutas relativas, sin secretos, límites de Pages, contenido público).
- Pendiente: carpeta publicada y stack del frontend.

## [2026-11-18] esquema | Stack Vue + Tailwind y principios SOLID / Clean Code
- Stack del frontend: Vue 3 (Composition API) + TypeScript strict + Tailwind CSS v4 + Vite + Vue Router (hash) + Pinia + Vitest (§13).
- Publicación: GitHub Actions compila a `dist/` y publica solo esa carpeta (§12).
- Estructura de carpetas por capas: domain / services / infrastructure / UI.
- Principios SOLID aplicados a Vue y reglas de Clean Code (§14).

## [2026-11-18] ingesta | Capas del geovisor Canoabo (exportación qgis2web)
- Copiada la fuente a `raw/canoabo-qgis2web/` y convertida a GeoJSON en `public/data/layers/` (`scripts/extract-qgis2web.mjs`).
- Creadas: [[2026-11-18-capas-canoabo-qgis2web]], [[cuenca-rio-canoabo]], [[embalse-canoabo]], [[capacidad-de-uso-de-la-tierra]], [[perfil-de-suelo]].
- Actualizados: `index.md`, `overview.md`.
- Detectados errores de tipeo y textos truncados en los atributos; sin autoría ni metodología registradas.

## [2026-11-18] esquema | Geovisor Canoabo: dominio, datos y mundo visual
- Dominio definido: geovisor del estudio de suelos de la cuenca del río Canoabo; `PRODUCT.md` creado (audiencias mixtas, explorar y analizar, escritorio y campo).
- Aplicación Vue montada: 5 capas, escalera de capacidad de uso I→VIII con % de superficie calculado en el navegador, foco por clase, ficha con monolito del perfil a escala.
- Mundo visual «Perfil de suelo» elegido en la ronda de Impeccable; mapa base CARTO descartado (exige clave).
- `CLAUDE.md` §1, §2, §10, §11 y §12 actualizados.

## [2026-11-18] esquema | Revisión final del geovisor y DESIGN.md
- Revisión de cierre de Impeccable: 8 arreglos materiales aplicados (perfil de ejemplo, horizonte abierto, selección ocre, velo de enfoque en todas las capas, fondo gley, red hídrica fina, controles unificados, ficha en singular con muestra de clase).
- Veredicto final: ship. `DESIGN.md` y `.impeccable/design.json` generados desde el código construido.

## [2026-11-18] esquema | Mapa base satelital por defecto
- A pedido del usuario: Satélite es el mapa base predeterminado y se retiró «Claro». Quedan Satélite y Relieve.

## [2026-11-18] esquema | Textos de ayuda retirados
- A pedido del usuario se quitaron la nota de la escalera (USDA / leyenda pendiente), el aviso del perfil de ejemplo y la leyenda del monolito.

## [2026-11-18] esquema | Selección en rojo
- A pedido del usuario, el elemento seleccionado en el mapa se resalta en rojo vivo (#ff1a1a, 3,5 px) sobre halo blanco (7 px); el ocre queda para el foco de la interfaz. `DESIGN.md` actualizado.

## [2026-11-18] esquema | Tabla de atributos
- Nueva tabla de atributos en la parte baja del mapa, abierta desde un botón junto al interruptor de cada capa: todas las columnas, búsqueda, orden, paginación; una fila selecciona el elemento y acerca el mapa.
- Lógica en `src/domain/attributeTable.ts` (7 pruebas), estado en `src/composables/useAttributeTable.ts`, vista en `src/components/table/`.

## [2026-11-18] esquema | Escalera de capacidad de uso reorganizada
- Orden I→VIII conservado; filas parejas de una línea, descripciones cortas, encabezado (Clase · Limitación / uso · Sup.) y barra de superficie relativa a la clase más extensa.

## [2026-11-18] esquema | Barra de superficie retirada
- A pedido del usuario se quitó la barra de superficie de la escalera; se mantienen filas parejas y el encabezado.

## [2026-11-18] esquema | Botón para quitar la selección
- Nuevo botón «Quitar selección» (icono goma) al final de la pila de controles del mapa: limpia el elemento seleccionado y los focos de clase sin recargar; deshabilitado cuando no hay nada que limpiar.
