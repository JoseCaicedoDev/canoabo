# CLAUDE.md — Esquema del LLM Wiki «canoabo»

Este archivo es el **esquema** del proyecto: define cómo está organizado el wiki, sus convenciones y los flujos de trabajo. Léelo completo al inicio de cada sesión. El usuario y Claude lo hacen evolucionar juntos; cualquier cambio de convención se anota aquí y en `wiki/log.md`.

## 1. Propósito

Base de conocimiento persistente y acumulativa mantenida por el LLM. En lugar de redescubrir la información en cada pregunta (RAG), Claude **compila** cada fuente una sola vez dentro de un wiki de markdown interconectado y lo mantiene al día.

- **El usuario**: selecciona las fuentes, dirige el análisis, hace preguntas y decide qué es importante.
- **Claude**: escribe y mantiene *todo* el wiki (resúmenes, referencias cruzadas, índice, log, detección de contradicciones).

**Plataforma**: sitio estático en **GitHub Pages**, solo frontend, sin backend. Todo procesamiento y análisis corre en el navegador (ver §12, restricción obligatoria).

**Dominio**: geovisor **Canoabo** del estudio de suelos de la cuenca del río Canoabo (capacidad de uso de la tierra, perfiles de suelo, hidrografía, vialidad). El wiki documenta las fuentes, los atributos y el significado de sus códigos. Producto y audiencias en `PRODUCT.md`.

## 2. Arquitectura (tres capas)

```
canoabo/
├── CLAUDE.md          ← esquema (este archivo)
├── raw/               ← FUENTES ORIGINALES. Inmutables. Claude solo lee.
│   └── assets/        ← imágenes y adjuntos descargados
├── PRODUCT.md / DESIGN.md   ← contexto de diseño de Impeccable (ver §11; se crean con /impeccable init y document)
├── .claude/           ← skill, agentes y hooks de Impeccable (no tocar a mano)
├── src/, public/      ← APLICACIÓN FRONTEND (Vue + Tailwind, ver §13–§14)
│   └── public/data/layers/  ← GeoJSON publicado, generado desde raw/ (no editar a mano)
├── scripts/           ← preparación de datos fuera del sitio (§12.8), p. ej. `npm run data:extract`
├── .github/workflows/ ← publicación en GitHub Pages (§12)
└── wiki/              ← CAPA DEL LLM. Claude escribe y mantiene todo.
    ├── index.md       ← catálogo de todas las páginas (por categoría)
    ├── log.md         ← registro cronológico, solo se agrega al final
    ├── overview.md    ← panorama general y tesis actual del wiki
    ├── fuentes/       ← una página resumen por cada fuente ingerida
    ├── entidades/     ← personas, organizaciones, lugares, objetos concretos
    ├── conceptos/     ← ideas, temas, métodos, términos
    └── sintesis/      ← análisis, comparaciones y respuestas archivadas
```

**Reglas inviolables**
1. **Nunca modificar, renombrar ni borrar nada en `raw/`.** Es la fuente de verdad.
2. Toda afirmación del wiki debe poder rastrearse a una fuente de `raw/` (o marcarse como inferencia / conocimiento externo).
3. `wiki/log.md` es *append-only*: nunca se reescriben entradas anteriores.
4. No crear páginas fuera de las carpetas definidas sin actualizar antes este esquema.

## 3. Convenciones de páginas

### Nombres de archivo
- `kebab-case`, sin acentos ni ñ, en minúsculas: `rio-canoabo.md`, `analisis-multicriterio.md`.
- Fuentes: `AAAA-MM-DD-titulo-corto.md` (fecha de la fuente; si no se conoce, la de ingesta).

### Enlaces
- Usar wikilinks de Obsidian: `[[nombre-de-pagina]]` o `[[nombre-de-pagina|texto visible]]`.
- Enlazar con generosidad: la primera mención de una entidad o concepto en cada página va enlazada.
- Un enlace a una página que aún no existe es válido: señala una página pendiente (se revisa en el *lint*).
- Citas a fuentes: `([[2026-11-18-titulo-corto]])` al final de la afirmación.

### Frontmatter YAML (obligatorio en todas las páginas de `wiki/`, excepto index y log)
```yaml
---
titulo: Nombre legible
tipo: fuente | entidad | concepto | sintesis | overview
tags: [tema1, tema2]
fuentes: [2026-11-18-titulo-corto]     # páginas de fuente que respaldan esta página
creado: 2026-11-18
actualizado: 2026-11-18
estado: borrador | estable | en-disputa
---
```
Para páginas `tipo: fuente` añadir además:
```yaml
archivo_raw: raw/nombre-original.pdf
autor: ...
fecha_fuente: AAAA-MM-DD
url: ...            # si aplica
```

### Plantillas de cuerpo

**Fuente** (`wiki/fuentes/`):
```
# Título
> Resumen en 2–3 líneas.
## Puntos clave
## Datos y cifras relevantes
## Entidades y conceptos mencionados   (lista de [[enlaces]])
## Contradicciones / tensiones con el wiki
## Preguntas abiertas
```

**Entidad / Concepto**:
```
# Nombre
> Definición o descripción en una línea.
## Descripción
## Relaciones          (con otras entidades/conceptos)
## Evidencia por fuente   (qué dice cada fuente, con cita)
## Contradicciones y dudas
## Ver también
```

**Síntesis** (`wiki/sintesis/`): pregunta original, respuesta, tabla/figura si aplica, fuentes citadas, fecha.

### Contradicciones
Cuando una fuente nueva contradice algo existente: **no borrar lo anterior**. Añadir un bloque
```
> [!warning] Contradicción
> [[fuente-a]] afirma X; [[fuente-b]] afirma Y. Pendiente de resolver / criterio aplicado: ...
```
y poner `estado: en-disputa` en el frontmatter.

### Idioma
Español para todo el wiki. Términos técnicos o nombres propios en su idioma original cuando sea lo habitual.

## 4. Operación: INGESTA

Disparador: el usuario coloca un archivo en `raw/` y pide «ingiere X» (o similar).

1. Leer la fuente completa (si tiene imágenes: primero el texto, luego las imágenes relevantes por separado).
2. **Comentar con el usuario** los 3–7 puntos clave y preguntar qué enfatizar (salvo que pida ingesta por lotes sin supervisión).
3. Crear la página en `wiki/fuentes/`.
4. Crear o actualizar las páginas de `entidades/` y `conceptos/` afectadas (una fuente puede tocar 10–15 páginas). Actualizar `actualizado:` y `fuentes:` en cada una.
5. Señalar contradicciones según §3.
6. Revisar si `overview.md` debe cambiar (tesis, panorama).
7. Actualizar `wiki/index.md`.
8. Añadir entrada en `wiki/log.md`.
9. Informar al usuario: páginas creadas, páginas modificadas, contradicciones encontradas.

## 5. Operación: CONSULTA

1. Leer `wiki/index.md` primero para localizar páginas relevantes; luego profundizar en ellas.
2. Ir a `raw/` solo si el wiki no basta o hay que verificar un dato.
3. Responder con citas (`[[pagina]]`). Distinguir claramente lo que dice el wiki de lo que es inferencia o conocimiento externo.
4. Formato según la pregunta: texto, tabla comparativa, gráfico (matplotlib), presentación Marp, canvas.
5. **Si la respuesta tiene valor duradero**, ofrecer archivarla en `wiki/sintesis/` (e indexarla y registrarla). Las buenas respuestas no deben perderse en el chat.
6. Registrar en el log las consultas archivadas.

## 6. Operación: LINT (mantenimiento)

Disparador: el usuario pide «lint» / «revisa el wiki», o sugerirlo cada ~10 ingestas.

Revisar y reportar:
- Contradicciones entre páginas y páginas `en-disputa` sin resolver.
- Afirmaciones obsoletas superadas por fuentes más recientes.
- Páginas huérfanas (sin enlaces entrantes).
- Enlaces a páginas inexistentes → ¿merecen página propia?
- Conceptos mencionados con frecuencia sin página.
- Frontmatter incompleto o desactualizado; entradas faltantes en el índice.
- Vacíos de información que podrían cubrirse con búsqueda web o nuevas fuentes.
- Propuesta de nuevas preguntas y fuentes a investigar.

Aplicar correcciones mecánicas directamente; las de contenido, proponerlas al usuario primero.

## 7. index.md y log.md

**`wiki/index.md`** — catálogo por categoría. Una línea por página:
`- [[nombre]] — resumen en una línea (N fuentes, actualizado AAAA-MM-DD)`
Se actualiza en cada ingesta y cada síntesis archivada.

**`wiki/log.md`** — cronológico, solo agregar al final. Prefijo fijo para poder filtrarlo:
```
## [AAAA-MM-DD] ingesta | Título de la fuente
## [AAAA-MM-DD] consulta | Pregunta resumida
## [AAAA-MM-DD] lint | Resumen
## [AAAA-MM-DD] esquema | Cambio en CLAUDE.md
```
Seguido de 1–5 viñetas con lo hecho (páginas creadas/modificadas).
Ver últimas entradas: `grep "^## \[" wiki/log.md | tail -5`

## 8. Arranque de cada sesión

1. Leer este `CLAUDE.md`.
2. Leer las últimas ~5 entradas de `wiki/log.md` para saber qué se hizo recientemente.
3. Leer `wiki/index.md` (y `overview.md` si la tarea es de síntesis).
4. Revisar si hay archivos en `raw/` sin página en `wiki/fuentes/` y avisar al usuario.

## 9. Herramientas

- **Obsidian** como visor (abrir la carpeta `canoabo/` como vault). Ajustes recomendados:
  - *Archivos y enlaces → Carpeta de adjuntos*: `raw/assets/`
  - Atajo para «Download attachments for current file» (p. ej. Ctrl+Shift+D).
  - Plugins útiles: Dataview (consultas sobre el frontmatter), Marp (presentaciones), vista de grafo.
- **Obsidian Web Clipper** para convertir artículos web a markdown en `raw/`.
- **Búsqueda**: a esta escala basta `index.md` + Grep. Si el wiki crece a cientos de páginas, evaluar `qmd` (BM25 + vectores, local) o un script propio.
- **Git** recomendado para historial y versiones (`git init` en la raíz).

## 10. Parámetros a definir con el usuario (pendientes)

- [x] Dominio: geovisor Canoabo del estudio de suelos de la cuenca (§1, `PRODUCT.md`). Definido el 2026-11-18.
- [ ] Categorías específicas del dominio (pueden sustituir o ampliar `entidades/` y `conceptos/`).
- [ ] Modo de ingesta por defecto: una a una con discusión (actual) o por lotes.
- [ ] Tipos de salida preferidos para consultas.
- [ ] Si se permite búsqueda web para llenar vacíos durante el lint.
- [x] Plataforma: GitHub Pages, solo frontend, procesamiento en el navegador (§12). Definido el 2026-11-18.
- [x] Stack del frontend: Vue 3 + TypeScript + Tailwind CSS v4 + Vite, publicado con GitHub Actions (§12, §13). Definido el 2026-11-18.
- [x] Principios de código: SOLID y Clean Code (§14). Definido el 2026-11-18.

Cuando se defina un parámetro, actualizar esta sección y registrar el cambio en el log como `esquema`.

## 11. Capa visual — Impeccable

[Impeccable](https://github.com/pbakaus/impeccable) (v0.1.24, instalado a nivel de proyecto) es el vocabulario de diseño para toda salida visual del proyecto: páginas HTML, dashboards, mapas web, presentaciones, artifacts, o un futuro sitio/visor del wiki.

**Instalación** (ya hecha): `npx impeccable install --providers=claude --scope=project -y`
- Skill: `.claude/skills/impeccable/` · Agentes: `.claude/agents/impeccable-*.md`
- Hooks en `.claude/settings.local.json`: revisión rápida tras cada Edit/Write en archivos de UI y revisión profunda al terminar cada turno.
- Actualizar: `npx impeccable install --providers=claude --scope=project -y --force`

**Reglas**
1. Antes de crear o modificar cualquier interfaz, usar la skill `impeccable`; respeta `PRODUCT.md` y `DESIGN.md`.
2. `PRODUCT.md` (qué es el producto, para quién) se crea con `/impeccable init`; `DESIGN.md` (sistema visual: color, tipografía, espaciado) con `/impeccable document`. Ambos viven en la raíz y forman parte del proyecto. Son el contexto de diseño, no páginas del wiki: no van en `wiki/`.
3. Las advertencias de los hooks de Impeccable se corrigen, no se ignoran.
4. Las salidas visuales que tengan valor duradero se archivan como síntesis (§5) con enlace al archivo generado.

**Comandos** (`/impeccable <comando> <objetivo>`):
- Planificar: `shape`, `init`, `document`, `extract`
- Ajustar estilo: `bolder`, `quieter`, `distill`, `colorize`, `typeset`, `layout`, `animate`, `delight`, `overdrive`
- Revisar: `critique` (revisión UX con puntaje), `audit` (calidad técnica)
- Terminar: `polish`, `harden`, `clarify`, `adapt`, `optimize`, `onboard`
- Iterar en vivo: `live`, `generate`

Hecho: `PRODUCT.md` creado con `/impeccable init`; mundo visual «Perfil de suelo» elegido el 2026-11-18 (contrato en `.impeccable/surfaces/`). `DESIGN.md` y `.impeccable/design.json` escritos tras la revisión final (veredicto: ship).

## 12. Plataforma: GitHub Pages, solo frontend (restricción obligatoria)

El proyecto se publica **únicamente** como sitio estático en GitHub Pages. **No hay backend**: ni servidor, ni base de datos, ni API propia, ni funciones serverless. Toda propuesta técnica debe cumplir esto; si algo solo es posible con backend, decirlo y ofrecer la alternativa en el navegador antes de seguir.

**Reglas**
1. **Todo el procesamiento y análisis corre en el navegador**: JavaScript/TypeScript, Web Workers para cálculos pesados (para no bloquear la interfaz) y WebAssembly cuando haga falta.
2. **Los datos son archivos estáticos** del repositorio: JSON, CSV, GeoJSON, Markdown, imágenes, y para datos grandes formatos optimizados para la web (por ejemplo Parquet, GeoTIFF optimizado/COG, PMTiles). Se cargan con `fetch` usando **rutas relativas**, nunca absolutas a `/`, porque el sitio se sirve bajo `/<nombre-del-repo>/`.
3. **Nada de secretos en el código**: todo lo publicado es visible. No incluir claves de API privadas. Solo servicios externos que funcionen desde el navegador con claves públicas o sin clave, y con CORS habilitado.
4. **La persistencia del usuario** va en el navegador (`localStorage` o IndexedDB), o en archivos que el usuario descarga y vuelve a cargar.
5. **La navegación** debe funcionar sin servidor: rutas con `#` (hash) o un `404.html` que redirija, porque GitHub Pages no reescribe URLs.
6. **Límites de GitHub Pages**: sitio de 1 GB como máximo, archivos de menos de 100 MB y unos 100 GB/mes de tráfico (límite blando). Los datos pesados se recortan, se simplifican o se dividen en teselas antes de publicarse.
7. **Todo el repositorio publicado es público**, incluido `raw/` si está dentro de la carpeta del sitio. Antes de publicar, decidir qué carpetas se exponen y no subir fuentes con derechos o datos sensibles.
8. **Herramientas de escritorio** (ArcGIS Pro/arcpy, Python local): se pueden usar *fuera* del sitio para **preparar** datos estáticos, pero el sitio no depende de ellas. Si se usan, documentar el proceso en el wiki para que sea reproducible. Equivalentes en el navegador: turf.js (análisis vectorial), geotiff.js (ráster), gdal3.js (GDAL en WASM), DuckDB-WASM (consultas SQL), Pyodide (Python en el navegador), y MapLibre o Leaflet (mapas).
9. Las librerías externas se cargan con versión fija (CDN o empaquetadas) para que el sitio no se rompa si cambian.

**Publicación**: Vite compila a `dist/` y un workflow de GitHub Actions (`.github/workflows/deploy.yml`) publica solo esa carpeta en Pages. Así `raw/` y `wiki/` no se exponen salvo que se copien explícitamente a `public/`.

**Por definir**: si el sitio será también un visor del propio wiki.

**Datos**: los GeoJSON de `public/data/layers/` se regeneran desde `raw/` con `npm run data:extract`; nunca se editan a mano. Las capas se declaran en `src/config/layerCatalog.ts` (agregar una capa = agregar una entrada).

## 13. Stack del frontend

| Pieza | Elección | Nota |
|---|---|---|
| Framework | **Vue 3**, Composition API con `<script setup>` | No usar Options API |
| Lenguaje | **TypeScript** en modo `strict` | Tipos explícitos en la frontera de cada módulo |
| Estilos | **Tailwind CSS v4** (`@tailwindcss/vite`) | Los tokens de `DESIGN.md` se definen en `@theme` de `src/styles/main.css` |
| Compilación | **Vite** | `base` = `'/<nombre-del-repo>/'` (o `'./'`) |
| Rutas | **Vue Router** con `createWebHashHistory()` | Obligatorio en GitHub Pages (§12.5) |
| Estado global | **Pinia**, solo para estado realmente compartido | El estado local se queda en el componente |
| Pruebas | **Vitest** + Vue Test Utils | |
| Calidad | ESLint (`eslint-plugin-vue`, `typescript-eslint`) + Prettier | Sin errores de lint ni de tipos antes de dar algo por terminado |
| Gestor de paquetes | npm | Versiones fijadas en `package-lock.json` |

**Estructura de carpetas** (capas: las de arriba dependen de las de abajo, nunca al revés):
```
src/
├── main.ts, App.vue
├── app/             ← arranque: router, Pinia, inyección de dependencias (provide)
├── views/           ← una vista por ruta; compone componentes, sin lógica de negocio
├── components/
│   ├── base/        ← componentes genéricos de UI (BaseButton, BaseCard…), sin lógica de dominio
│   └── <feature>/   ← componentes de una funcionalidad concreta
├── composables/     ← lógica reactiva reutilizable (useXxx)
├── stores/          ← stores de Pinia
├── domain/          ← tipos, entidades y reglas puras en TS. Sin Vue, sin fetch, sin DOM
├── services/        ← casos de uso: orquestan dominio + infraestructura a través de interfaces
├── infrastructure/  ← implementaciones concretas: carga de archivos estáticos, localStorage/IndexedDB, librerías externas
├── workers/         ← Web Workers para procesamiento pesado
└── styles/main.css  ← Tailwind + tokens de diseño
public/data/         ← datos estáticos publicados (§12.2)
tests/               ← pruebas (o archivos *.spec.ts junto al código)
```
Dirección de dependencias: `views → components → composables/stores → services → domain`. `infrastructure` implementa las interfaces que define `domain` o `services`. `domain` no importa nada del resto.

## 14. Principios de código: SOLID y Clean Code

**SOLID aplicado a Vue**
- **S — Responsabilidad única**: cada componente, composable o servicio hace una sola cosa. Los componentes se encargan de presentar; la lógica va en composables o servicios. Señal de alarma: un `.vue` de más de ~200 líneas o con `fetch` y cálculos dentro.
- **O — Abierto/cerrado**: extender sin modificar. Usar props, slots y registros de estrategias (por ejemplo, un mapa `tipo → componente` o `formato → cargador`) en lugar de cadenas de `if/switch` que crecen.
- **L — Sustitución de Liskov**: las implementaciones de una misma interfaz son intercambiables (por ejemplo, `GeoJsonLoader` y `CsvLoader` cumplen el mismo `DataLoader` sin casos especiales).
- **I — Segregación de interfaces**: props y contratos pequeños y específicos. Mejor varios composables enfocados que uno gigante.
- **D — Inversión de dependencias**: componentes y servicios dependen de interfaces, no de implementaciones concretas. Las dependencias se inyectan con `provide/inject` (configurado en `src/app/`) o por parámetro. Esto permite probar con dobles y cambiar la infraestructura sin tocar el dominio.

**Clean Code**
- **Nombres** que revelan intención; sin abreviaturas crípticas. Funciones con verbo (`loadParcels`), booleanos con `is/has/can`.
- **Idioma**: identificadores de código en **inglés**; textos de interfaz, documentación y wiki en **español**.
- **Convenciones**: componentes en `PascalCase.vue` (los base con prefijo `Base`), composables `useXxx.ts`, el resto de archivos `camelCase.ts`, tipos e interfaces en `PascalCase`.
- **Funciones** cortas, un solo nivel de abstracción, idealmente 3 parámetros o menos (si son más, un objeto tipado).
- **Sin duplicación** (DRY), pero sin abstraer antes de tiempo: abstraer cuando el patrón aparece la tercera vez.
- **Sin números ni textos mágicos**: constantes con nombre.
- **Sin `any`**: usar `unknown` y validar. Los datos externos se validan al cargarse, en `infrastructure`.
- **Errores** explícitos y manejados: estados de carga, error y vacío en la UI; nunca un `catch` vacío.
- **Comentarios** para explicar el *porqué*, no el *qué*. El código se explica solo.
- **Inmutabilidad** por defecto en `domain` (funciones puras que devuelven valores nuevos).
- **Pruebas**: todo `domain` y `services` lleva pruebas unitarias; los componentes con lógica, pruebas de componente.
- **Tailwind**: clases utilitarias en la plantilla; si un conjunto de clases se repite, extraer un componente base, no un `@apply` global. Colores, tipografía y espaciado salen de los tokens de `@theme`, nunca valores sueltos (`text-[#3a7]`).

**Antes de dar una tarea de código por terminada**: `npm run lint`, `npm run type-check`, `npm run test` y `npm run build` sin errores, y revisión visual con Impeccable si hubo cambios de UI (§11).
