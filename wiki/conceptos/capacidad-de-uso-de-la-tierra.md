---
titulo: Capacidad de uso de la tierra
tipo: concepto
tags: [suelos, evaluacion-de-tierras]
fuentes: [2026-11-18-capas-canoabo-qgis2web]
creado: 2026-11-18
actualizado: 2026-11-18
estado: borrador
---

# Capacidad de uso de la tierra

> Clasificación de las tierras según sus limitaciones permanentes para el uso agrícola, en clases de I (sin limitaciones) a VIII (solo protección).

## Descripción
Las clases en números romanos son conocimiento externo (sistema de capacidad de uso del USDA y sus adaptaciones venezolanas). En el estudio de Canoabo el atributo `CUSO_DEF` tiene 27 valores: clases simples (`IIIp`, `IVp`, `Vp`, `VIp`, `VIIp`, `VIIIp`…), asociaciones (`VIp/VIIpr`) y `EMB` para el embalse ([[2026-11-18-capas-canoabo-qgis2web]]). Los sufijos en minúscula parecen indicar el tipo de limitación (`p` pendiente, `e` erosión, `h` humedad, `f` fertilidad, `r` ¿roca/profundidad?): **inferencia, pendiente de confirmar**.

## Relaciones
- Se asigna a las unidades de suelo de la [[cuenca-rio-canoabo]].
- Los [[perfil-de-suelo|perfiles]] tienen su propia clase (`CUSO`) con otra notación.

## Uso en el geovisor
- Cada unidad se colorea por su **clase principal** (primera clase de una asociación: `VIp/VIIpr` → VI), calculada en el navegador (`src/domain/landCapability.ts`).
- Descripciones cortas mostradas (conocimiento externo, sistema USDA): I ligeras, II moderadas, III severas, IV muy severas, V uso restringido (sin laboreo), VI pastos y bosque, VII bosque protector, VIII protección.
- Colores: convención cartográfica habitual (I verde claro, II amarillo, III rojo, IV azul, V verde oscuro, VI naranja, VII marrón, VIII violeta). Sustituir por la leyenda oficial del estudio cuando se consiga.
- Superficie por clase (sobre `AREA1`): I 3,5 %, III 3,1 %, IV 3,5 %, V 29,2 %, VI 34,8 %, VII 15,2 %, VIII 8,6 %, embalse 2,1 %. `AREA1` viene como texto en la fuente.

## Contradicciones y dudas
- Notación distinta entre unidades (`CUSO_DEF`) y perfiles (`CUSO`, p. ej. `VTp`).

## Ver también
[[perfil-de-suelo]]
