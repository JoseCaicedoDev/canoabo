import { describe, expect, it } from 'vitest'
import { horizonsOf, parseDepthRange } from './soilProfile'

describe('parseDepthRange', () => {
  it.each([
    ['0 - 12', { top: 0, bottom: 12 }],
    ['6 -25', { top: 6, bottom: 25 }],
    ['> 30', { top: 30, bottom: null }],
  ])('%s', (text, expected) => {
    expect(parseDepthRange(text)).toEqual(expected)
  })

  it('rejects non-depth values', () => {
    expect(parseDepthRange(null)).toBeNull()
    expect(parseDepthRange('sin dato')).toBeNull()
  })
})

describe('horizonsOf', () => {
  it('reads horizons with depth and treats pH 0 as missing', () => {
    const horizons = horizonsOf({
      H1_PROF: '0 - 12', H1_TEXT: 'FAa', H1_PH: 5.87, H1_MO: 4.74,
      H2_PROF: '> 12', H2_TEXT: null, H2_PH: 0, H2_MO: 0,
      H3_PROF: null,
    })
    expect(horizons).toEqual([
      { name: 'H1', depth: { top: 0, bottom: 12 }, texture: 'FAa', ph: 5.87, organicMatter: 4.74 },
      { name: 'H2', depth: { top: 12, bottom: null }, texture: null, ph: null, organicMatter: null },
    ])
  })
})
