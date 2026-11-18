---
name: Canoabo
description: Geovisor de la cuenca del río Canoabo; cada lugar se lee como un perfil de suelo.
colors:
  humus: "#2a1e16"
  humus-raised: "#3a2a1f"
  on-humus: "#efe9df"
  on-humus-soft: "#c9bcab"
  ochre: "#b5772e"
  ochre-wash: "#efe3cf"
  oxide: "#9c3b22"
  gley: "#dce1da"
  gley-rule: "#c6cdc3"
  gley-line: "#b9c1b6"
  paper: "#f4f6f2"
  ink: "#1c1a17"
  ink-soft: "#4b4a43"
  clase-i: "#9ccf6f"
  clase-ii: "#f0cf3a"
  clase-iii: "#d4473a"
  clase-iv: "#3f7cc0"
  clase-v: "#2e6a3a"
  clase-vi: "#e3862d"
  clase-vii: "#85573a"
  clase-viii: "#7a4e9a"
  embalse: "#3a5fd0"
  red-hidrica: "#1f3a7a"
  horizonte-palido: "#d9c4a0"
typography:
  display:
    fontFamily: "Atkinson Hyperlegible Next Variable, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Atkinson Hyperlegible Next Variable, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 800
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Atkinson Hyperlegible Next Variable, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.25
  rung:
    fontFamily: "Atkinson Hyperlegible Next Variable, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 800
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Atkinson Hyperlegible Next Variable, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.375
    fontFeature: "\"tnum\" 1"
  label:
    fontFamily: "Atkinson Hyperlegible Next Variable, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    fontFeature: "\"tnum\" 1"
  caption:
    fontFamily: "Atkinson Hyperlegible Next Variable, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.375
rounded:
  swatch: "2px"
  monolith: "3px"
  segment: "5px"
  control: "6px"
  sheet: "12px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "10px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  section: "28px"
  header: "56px"
  panel-width: "340px"
  sheet-width: "380px"
components:
  topbar:
    backgroundColor: "{colors.humus}"
    textColor: "{colors.on-humus}"
    typography: "{typography.headline}"
    height: "56px"
    padding: "0 24px"
  topbar-button:
    backgroundColor: "{colors.humus-raised}"
    textColor: "{colors.on-humus}"
    rounded: "{rounded.control}"
    height: "40px"
    padding: "0 12px"
  switch-on:
    backgroundColor: "{colors.humus}"
    rounded: "{rounded.pill}"
    width: "40px"
    height: "24px"
  switch-off:
    backgroundColor: "{colors.gley-line}"
    rounded: "{rounded.pill}"
    width: "40px"
    height: "24px"
  basemap-segment:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.segment}"
    height: "36px"
    padding: "0 12px"
  basemap-segment-selected:
    backgroundColor: "{colors.humus}"
    textColor: "{colors.on-humus}"
    rounded: "{rounded.segment}"
  map-control:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    size: "40px"
  capability-rung:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    height: "44px"
  capability-rung-focused:
    backgroundColor: "{colors.ochre-wash}"
    textColor: "{colors.ink}"
  feature-sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    width: "380px"
    padding: "20px 24px"
  notice-example:
    backgroundColor: "{colors.ochre-wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
---

# Design System: Canoabo

## Overview

**Creative North Star: "Perfil de suelo"**

El visor trata cada lugar de la cuenca como un corte de suelo: horizontes apilados, a escala, con sus valores al costado. El chrome es tierra y agua freática: una barra superior húmica casi negra, paneles color gley (el gris verdoso de un horizonte reducido) y tinta cálida. Todo el color saturado está en el mapa y en los datos; la interfaz se limita a enmarcarlos y a señalar el estado con ocre.

La densidad es de herramienta de consulta: tres columnas fijas en escritorio (capas y escalera, mapa, ficha), filas de 44 px como mínimo, cifras tabulares alineadas a la derecha con su unidad. Una sola familia tipográfica, Atkinson Hyperlegible Next, sostiene toda la jerarquía por peso y tamaño. Los rellenos son planos; no hay degradados decorativos, ni brillos, ni cristal.

Rechazo confirmado: el geoportal estándar de panel blanco con acento azul y ficha flotante genérica.

**Key Characteristics:**
- Color confinado: el chrome es humus, gley, papel y tinta; los colores vivos pertenecen a las clases de capacidad de uso y a las capas.
- Ocre como única señal de estado (activo, selección, foco, cursor).
- El monolito de perfil dibuja cada horizonte con altura proporcional a su profundidad en cm.
- La escalera I → VIII enfoca una clase y vela el resto del mapa.
- Rellenos planos; profundidad mínima, solo para lo que flota sobre el mapa.

## Colors

Paleta de tierra para la interfaz y convención cartográfica para los datos.

### Primary
- **Humus** (humus): barra superior de 56 px, interruptores encendidos, segmento de mapa base seleccionado. Es la masa oscura que ancla la pantalla.
- **Humus alzado** (humus-raised): botón «Capas» dentro de la barra en móvil, un escalón por encima del humus.
- **Texto sobre humus** (on-humus) y **texto suave sobre humus** (on-humus-soft): título y subtítulo de la cuenca en la barra; también la perilla de los interruptores y las etiquetas de bandas oscuras del monolito.

### Secondary
- **Ocre** (ochre): estado activo de la interfaz. Anillo interior de 2 px del peldaño enfocado, contorno de foco del teclado, cursor y selección de texto.
- **Rojo de selección** (selection, #ff1a1a): el elemento seleccionado en el mapa. Contorno de 3,5 px del polígono sobre halo blanco de 7 px, anillo de 4 px del punto. Más saturado que la clase III (#d4473a) y siempre con halo blanco, para no confundirse con ella.
- **Lavado ocre** (ochre-wash): fondo del peldaño enfocado y del aviso «Perfil de ejemplo».

### Tertiary
- **Óxido** (oxide): puntos de perfiles de suelo en el mapa y mensajes de error por capa («No se pudo cargar»).

### Neutral
- **Gley** (gley): fondo de página, panel de capas y suelo del mapa (el fondo de MapLibre usa el mismo valor y asoma bajo el mapa base de relieve, a 0,85 de opacidad; el satelital, predeterminado, va opaco).
- **Papel** (paper): ficha, escalera y controles flotantes del mapa.
- **Regla gley** (gley-rule): divisores internos entre filas (capas, peldaños, atributos, controles).
- **Línea gley** (gley-line): bordes de contenedores y columnas, interruptor apagado, barra de desplazamiento, color de reserva para clases sin dato.
- **Tinta** (ink) y **tinta suave** (ink-soft): texto principal y secundario (etiquetas de atributos, porcentajes, leyendas).

### Datos
- **Clases de capacidad de uso** (clase-i … clase-viii): convención cartográfica I verde claro, II amarillo, III rojo, IV azul, V verde oscuro, VI naranja, VII marrón, VIII violeta. Se dibujan a 0,72 de opacidad con contorno de tinta al 35 %. **Embalse** (embalse) va aparte de la escalera, a 0,9.
- **Red hídrica** (red-hidrica): líneas de 1 px a 0,7, grosor interpolado por zoom.
- **Vialidad**: blanco con forro de tinta al 75 %.
- **Tono de horizonte**: interpolación de horizonte-palido a humus según la materia orgánica (saturación a 6 % MO); sin dato usa gley-rule. Es una codificación del visor, no un color Munsell.

### Named Rules
**The Color Confinado Rule.** El color saturado solo aparece en el mapa, en la barra de muestra de cada peldaño, en el símbolo de cada capa y en las muestras junto a un código de clase. Ningún botón, título ni fondo de la interfaz usa un color de datos.

**The Two Signal Rule.** El ocre es la señal de estado de la interfaz (activo, enfocado); el rojo vivo con halo blanco es la señal de selección en el mapa. Nada más compite con ellos.

**The Código ↔ Lugar Rule.** Todo código de capacidad de uso que aparece en la ficha lleva al lado su muestra de 24×16 px con el color del peldaño, para que el texto remita al lugar del mapa.

## Typography

**Display Font:** Atkinson Hyperlegible Next Variable (con system-ui, sans-serif)
**Body Font:** la misma familia
**Label/Mono Font:** la misma familia, con cifras tabulares activas en todo el documento

**Character:** Una sola grotesca de alta legibilidad, pensada para lectores con baja visión y para pantallas al sol en campo. La jerarquía sale del peso (400 → 800), nunca de una segunda familia.

### Hierarchy
- **Display** (800, 28px, 1.05, -0.01em): nombre del elemento seleccionado en la ficha, con `text-balance`.
- **Headline** (800, 22px, -0.01em): «Canoabo» en la barra húmica. El estado vacío de la ficha usa 700 a 20px.
- **Title** (700, 15px): títulos de sección del panel («Capas», «Capacidad de uso»). Los nombres de capa usan 600 a 15px.
- **Rung** (800, 17px, apretado): numeral romano de cada peldaño.
- **Body** (400, 14px, 1.375): descripciones de clase, valores y etiquetas de atributos (valores en 600), texto de los controles.
- **Label** (400, 13px): estados de carga y error, pH y MO del monolito, ayudas bajo títulos.
- **Caption** (400, 12px, 1.375): notas de fuente y leyenda del monolito, en tinta suave.

### Named Rules
**The Cifra a la Derecha Rule.** Las cifras van tabulares, alineadas a la derecha y con su unidad («760 m s. n. m.», «MO 4,74 %», «34,8 %»), en formato es-VE. Un dato ausente se escribe «s/d» o «—», nunca se omite la fila.

**The Sin Antetítulo Rule.** Ningún título lleva antetítulo, etiqueta en versalitas ni texto en mayúsculas espaciadas encima. El título es el nombre de la cosa.

## Layout

Escritorio (≥1024 px): barra de 56 px y debajo una rejilla de tres columnas, panel de 340 px, mapa flexible y ficha de 380 px, cada columna con su propio desplazamiento y separadas por una línea gley. El panel tiene 20 px de margen interno y 28 px entre sus secciones; la ficha, 24 px a los lados y 20 px arriba y abajo. Los controles del mapa flotan a 10 px de las esquinas superiores: selector de mapa base a la izquierda, zoom y «Ver toda la cuenca» a la derecha.

Móvil (<1024 px): mapa a pantalla completa bajo la barra. El panel de capas y la ficha se convierten en hojas inferiores de hasta 55 dvh, con esquinas superiores redondeadas, 20 px a los lados, 16 px arriba y 24 px abajo; el panel se abre con el botón «Capas» de la barra y tiene prioridad sobre la ficha. Al seleccionar un punto, el mapa lo recentra en la franja visible por encima de la hoja. El subtítulo de la cuenca aparece desde 640 px.

Los objetivos táctiles miden 40–44 px como mínimo (peldaños 44, cerrar ficha 44, controles 40, botón de capas 40, segmentos 36 de alto con 0,5 de marco).

## Elevation & Depth

El sistema es plano y se ordena por tono: gley detrás, papel delante, humus arriba. Las sombras existen solo para lo que flota sobre el mapa o se desliza sobre él, y son difusas y de tinta, nunca de color ni desplazadas en duro.

### Shadow Vocabulary
- **Flotante** (`box-shadow: 0 1px 3px rgb(28 26 23 / 0.18)`): selector de mapa base, grupo de controles del mapa y controles nativos de MapLibre.
- **Hoja** (`box-shadow: 0 -6px 24px rgb(28 26 23 / 0.18)`): hojas inferiores en móvil; desaparece en escritorio.
- **Perilla** (`box-shadow: 0 1px 2px rgb(28 26 23 / 0.35)`): perilla del interruptor.
- **Anillo de foco** (`box-shadow: inset 0 0 0 2px #b5772e`): peldaño enfocado; no es elevación sino estado.

### Named Rules
**The Plano Sobre Gley Rule.** Paneles, ficha, escalera y filas no llevan sombra. Si un contenedor no flota sobre el mapa, su borde es una línea gley y nada más.

## Shapes

Esquinas apenas suavizadas y bordes de 1 px. Controles y contenedores a 6 px; segmentos internos del selector a 5 px; el monolito a 3 px (solo arriba cuando el último horizonte es abierto); muestras de color a 2 px; hojas móviles a 12 px en las esquinas superiores; interruptores en píldora. El monolito lleva un marco de tinta de 2 px y divisiones de horizonte en tinta al 40 %. La ficha de atributos abre con una regla de tinta de 2 px arriba. Las barras de color de la escalera son celdas rectas de 28 px, a sangre, sin esquinas.

## Components

### Barra superior
Masa húmica de 56 px. Nombre «Canoabo» en headline, subtítulo de la cuenca en texto suave sobre humus. En móvil añade el botón «Capas»/«Cerrar» (humus alzado, icono de 16 px, 600 a 14px, 40 px de alto) con `aria-expanded`.

### Interruptores
- **Forma:** píldora de 40×24 px con perilla de 16 px.
- **Encendido:** humus; **apagado:** línea gley. Transición de color y posición en 200 ms con ease-out-expo.
- **Deshabilitado:** opacidad 0,5 y cursor bloqueado (capa con error).

### Fila de capa
Símbolo de 20 px que reproduce cómo se dibuja la capa (área, rampa de clases, línea con forro, punto), nombre en 600 a 15px, interruptor a la derecha, divisor gley-rule. Debajo del nombre, «Cargando…» con icono giratorio en tinta suave o «No se pudo cargar. Recarga la página.» en óxido con icono de alerta.

### Selector de mapa base
Grupo segmentado sobre papel con borde gley y sombra flotante: Satélite (predeterminado) y Relieve, cada uno con su icono lineal. El seleccionado es humus con texto claro; los demás, tinta con fondo gley al pasar el puntero. Semántica de radiogroup.

### Controles del mapa
Columna de tres botones de 40 px sobre papel (acercar, alejar, ver toda la cuenca), divisores gley-rule, fondo gley al pasar el puntero, `aria-label` y `title` en cada uno.

### Escalera de capacidad de uso (firma)
Lista ordenada sobre papel con borde gley y radio de 6 px. Cada peldaño es una rejilla de cuatro columnas: barra de color de la clase a sangre (28 px), numeral romano en 800 a 17px, descripción de la clase y porcentaje de superficie a la derecha en tinta suave. Solo aparecen las clases presentes en la cuenca, en orden de limitación; el embalse va en una lista aparte debajo. Al tocar un peldaño se enfoca su clase: el peldaño toma lavado ocre con anillo interior ocre de 2 px y `aria-pressed`; en el mapa la clase conserva su opacidad y el resto de la capa cae a 0,12, mientras las demás capas se velan a 0,24. Tocar de nuevo quita el foco. Mientras la capa carga, el porcentaje es «—».

### Monolito de perfil (firma)
Columna de 72 px y 300 px de alto con marco de tinta de 2 px. Cada horizonte es una banda con altura proporcional a su profundidad en cm y tono interpolado por materia orgánica (más MO, más oscuro); la etiqueta H1–H4 va abajo de la banda, en texto claro sobre las bandas oscuras. Un último horizonte sin límite inferior medido se dibuja abierto: sin borde inferior y con el relleno desvanecido. Al lado, una fila de valores por horizonte (nombre · profundidad y textura en 600 a 14px; pH y MO en 13px) alineada con el techo de su banda y empujada hacia abajo cuando dos horizontes son muy finos (separación mínima de 44 px). Al cambiar de perfil las bandas se depositan de arriba abajo (`horizon-settle`, 700 ms, ease-out-expo; sin animación con movimiento reducido). Leyenda en caption debajo. Tiene etiqueta accesible con la profundidad medida.

### Ficha
Título display, subtítulo con tipo y código en tinta suave, botón de cierre de 44 px. Debajo, la vista especializada si la capa la tiene (el monolito) y la lista de atributos: dos columnas, etiqueta en tinta suave a la izquierda y valor en 600 a la derecha, con su muestra de clase cuando corresponde. Estados: «Ningún elemento seleccionado» con indicación de qué tocar; «Este elemento no tiene atributos registrados» cuando la capa no tiene campos; en escritorio abre con un perfil de ejemplo seleccionado, sin texto de aviso.

### Selección en el mapa
Polígono: contorno rojo (#ff1a1a) de 3,5 px sobre halo blanco de 7 px. Línea: roja con 3 px extra. Punto: anillo rojo de 4 px y radio 4 px mayor. El elemento seleccionado se redibuja encima del resto.

## Do's and Don'ts

### Do:
- **Do** dejar el color saturado al mapa y a los datos; la interfaz usa humus, gley, papel y tinta.
- **Do** usar ocre (#b5772e) para el estado activo y el foco de la interfaz, y rojo vivo (#ff1a1a) con halo blanco para la selección en el mapa; solo para eso.
- **Do** dibujar las clases de capacidad de uso con la convención I verde claro, II amarillo, III rojo, IV azul, V verde oscuro, VI naranja, VII marrón, VIII violeta, en orden de limitación.
- **Do** dibujar los horizontes a escala real de profundidad y marcar como abierto el que no tiene límite inferior.
- **Do** alinear las cifras a la derecha, tabulares y con su unidad; escribir «s/d» cuando falta el dato.
- **Do** acompañar cada código de clase con su muestra de color.
- **Do** mantener objetivos táctiles de 40–44 px y prefers-reduced-motion respetado.

### Don't:
- **Don't** usar el geoportal estándar de panel blanco con acento azul y ficha flotante genérica.
- **Don't** usar degradados decorativos, cristal ni brillos; los rellenos son planos. El único desvanecido permitido es el del horizonte abierto, que codifica un dato.
- **Don't** poner antetítulos, etiquetas en mayúsculas espaciadas ni texto sobre el título.
- **Don't** usar bordes laterales de acento en tarjetas o avisos; el estado se marca con lavado y anillo ocre. La barra de color del peldaño es una celda de dato, no un borde.
- **Don't** dar sombra a paneles, filas ni a la ficha en escritorio; solo flota lo que está sobre el mapa.
- **Don't** colorear títulos, botones o fondos con colores de clase.

### Tabla de atributos

Panel en la parte baja de la columna del mapa (42 % de su altura, mínimo 224 px); el mapa se reduce, no queda tapado. Se abre con el botón de tabla (icono `Table2`, 36 px) junto al interruptor de cada capa: en reposo tinta suave, abierto en humus con texto claro (`aria-pressed`); deshabilitado mientras la capa carga o si falló. Cabecera sobre papel con título «Tabla de atributos · capa», conteo de elementos (o «N de M» al buscar), buscador y cierre (también con `Esc`). Tabla con cabecera fija en gley y regla de tinta de 2 px, columnas ordenables (asc → desc → sin orden, `aria-sort`), cifras tabulares a la derecha y texto a la izquierda, vacíos como «—». Fila seleccionada en lavado ocre; al pulsarla se enciende la capa, se selecciona el elemento (contorno rojo en el mapa) y el mapa se acerca a él. Paginación de 50 filas. Columnas: primero los campos curados del catálogo con su etiqueta, luego todos los demás atributos con su nombre original.
