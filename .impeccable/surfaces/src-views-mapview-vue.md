---
version: 1
slug: "src-views-mapview-vue"
primary_target: "src/views/MapView.vue"
related_targets: ["src/components"]
---

# Geovisor Canoabo — mapa principal

Scope: vista principal `src/views/MapView.vue` y sus componentes (panel de capas, escalera de capacidad de uso, mapa, ficha). Mode: operate.

Audiencia y tarea: técnicos, académicos, productores y público consultan qué hay en un lugar de la cuenca: encender capas, tocar un polígono o perfil y leer su ficha; enfocar una clase de capacidad de uso. Escritorio principal, móvil en campo.

Estados: carga por capa, error por capa, sin selección, capa no consultable (vialidad), valores vacíos.

## Direction contract

THESIS: Cada lugar de la cuenca se lee como un perfil de suelo: horizontes a escala real. Rechaza el geoportal estándar de panel blanco con acento azul y ficha flotante genérica.

OWN-WORLD: Barra superior húmica #2a1e16 con texto #efe9df; panel y fondo gley #dce1da; tinta #1c1a17; ocre #b5772e para estado activo y selección; óxido #9c3b22 para perfiles y errores. Color solo en mapa y datos; el chrome es tinta y gley. Clases de capacidad de uso con la convención cartográfica I verde claro, II amarillo, III rojo, IV azul, V verde oscuro, VI naranja, VII marrón, VIII violeta. Atkinson Hyperlegible Next, cifras tabulares alineadas a la derecha con su unidad. Rellenos planos.

STORY: El visitante ve la cuenca entera coloreada por capacidad de uso, reconoce la escalera I→VIII, enfoca una clase y la ve en el mapa, toca un perfil y lee sus horizontes a escala.

FIRST VIEWPORT: Barra húmica de 56 px con «Canoabo» y la cuenca; columna izquierda de 340 px con Capas (interruptores) y la escalera de capacidad de uso (barra de color a la izquierda, clase, nombre, % de superficie); mapa al centro con controles y selector de mapa base; ficha de 380 px a la derecha con el monolito del perfil seleccionado (bandas H1–H4 con altura proporcional a la profundidad en cm y sus valores al costado). En móvil: mapa a pantalla completa, panel y ficha como hojas inferiores.

FORM: Monolito / diagrama de perfil de suelo, posición 4 de 7 en la lista ordenada. seed:17efc39df7b26cb0. Raises: color confinado (lexicon), código ↔ lugar (doujin), velo de enfoque (ikeda), banda = profundidad exacta (labanotation), cifras tabulares a la derecha (j-card), rellenos planos (zoo).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
