/**
 * Convierte las capas de una exportación qgis2web (raw/canoabo-qgis2web/layers/*.js)
 * en archivos GeoJSON estándar (RFC 7946) para publicar en public/data/layers/.
 *
 * Los .js de qgis2web tienen la forma `var geojson_x = {...};`. Se leen como texto y se
 * parsean con JSON.parse: nunca se ejecutan.
 *
 * Uso: node scripts/extract-qgis2web.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE_DIR = path.join(ROOT, 'raw', 'canoabo-qgis2web', 'layers')
const OUTPUT_DIR = path.join(ROOT, 'public', 'data', 'layers')

/** 6 decimales en grados ≈ 0,1 m: precisión de sobra para un visor y reduce el peso. */
const COORDINATE_DECIMALS = 6

/** Archivo de origen → nombre publicado. */
const LAYERS = {
  'x550.js': 'unidades-suelo',
  'embalse1.js': 'embalse',
  'rios22.js': 'rios',
  'vialidad3.js': 'vialidad',
  'suelo84.js': 'perfiles-suelo',
}

function parseQgis2webLayer(text) {
  const jsonStart = text.indexOf('{')
  if (jsonStart < 0) throw new Error('No se encontró un objeto GeoJSON')
  return JSON.parse(text.slice(jsonStart).trim().replace(/;\s*$/, ''))
}

function roundCoordinates(coordinates) {
  if (typeof coordinates[0] === 'number') {
    const factor = 10 ** COORDINATE_DECIMALS
    return coordinates.map((value) => Math.round(value * factor) / factor)
  }
  return coordinates.map(roundCoordinates)
}

function cleanValue(value) {
  return typeof value === 'string' ? value.trim() : value
}

function cleanFeature(feature, index) {
  const properties = Object.fromEntries(
    Object.entries(feature.properties ?? {}).map(([key, value]) => [key, cleanValue(value)]),
  )
  return {
    type: 'Feature',
    id: index,
    properties,
    geometry: feature.geometry && {
      type: feature.geometry.type,
      coordinates: roundCoordinates(feature.geometry.coordinates),
    },
  }
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true })

for (const [sourceFile, outputName] of Object.entries(LAYERS)) {
  const source = parseQgis2webLayer(fs.readFileSync(path.join(SOURCE_DIR, sourceFile), 'utf8'))
  const collection = { type: 'FeatureCollection', features: source.features.map(cleanFeature) }
  const outputPath = path.join(OUTPUT_DIR, `${outputName}.geojson`)
  fs.writeFileSync(outputPath, JSON.stringify(collection))
  const sizeKb = (fs.statSync(outputPath).size / 1024).toFixed(0)
  console.log(`${sourceFile} → ${outputName}.geojson (${collection.features.length} elementos, ${sizeKb} KB)`)
}
