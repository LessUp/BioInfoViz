import { describe, it, expect } from 'vitest'
import { buildDP, traceback } from '../core.js'

describe('DP core', () => {
  it('SW local alignment basic', () => {
    const dp = buildDP('GATTACA', 'GCATGCU', { match: 2, mismatch: -1, gap: -1, mode: 'sw' })
    const tb = traceback(dp, 'sw')
    expect(tb.score).toBeGreaterThan(0)
    expect(tb.path.length).toBeGreaterThan(0)
    expect(tb.alignA.length).toBe(tb.alignB.length)
  })
  it('NW global alignment exact', () => {
    const dp = buildDP('GATTACA', 'GATTACA', { match: 2, mismatch: -1, gap: -1, mode: 'nw' })
    const tb = traceback(dp, 'nw')
    expect(tb.score).toBeGreaterThan(0)
    expect(tb.alignA).toBe('GATTACA')
    expect(tb.alignB).toBe('GATTACA')
  })
  it('empty input handled', () => {
    const dp = buildDP('', '', { match: 1, mismatch: -1, gap: -1, mode: 'nw' })
    const tb = traceback(dp, 'nw')
    expect(tb.score).toBeGreaterThanOrEqual(0)
    expect(tb.path.length).toBe(0)
  })
})