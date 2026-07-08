import { describe, expect, it } from 'vitest'
import {
  createSoftLimiterCurve,
  dbToGain,
  enhancementProfiles,
  getEnhancementProfile,
  getParameterRows,
} from './audioEnhancement'

describe('audio enhancement profiles', () => {
  it('exposes concrete before and after parameters for Studio Bloom', () => {
    const studio = getEnhancementProfile('studio')
    const rows = getParameterRows('studio')

    expect(studio.dspName).toBe('Studio Bloom DSP')
    expect(rows.before).toContain('旁路直通 0 dB')
    expect(rows.after).toEqual(expect.arrayContaining([
      '低频架 +6.0 dB @ 88 Hz',
      '低中频清理 -3.4 dB @ 410 Hz',
      '存在感 +5.0 dB @ 2.5 kHz',
      '压缩 -30 dB / 4.2:1',
      '输出 +5.6 dB / 峰值 -1.0 dBTP',
      '声场宽度 122%',
    ]))
  })

  it('keeps every enhanced profile under the published true-peak ceiling', () => {
    for (const profile of Object.values(enhancementProfiles)) {
      expect(profile.outputCeilingDbtp).toBeLessThanOrEqual(-1)
      expect(profile.outputGainDb).toBeGreaterThan(0)
    }
  })

  it('makes higher tiers audibly stronger than the default studio profile', () => {
    const studio = getEnhancementProfile('studio')
    const master = getEnhancementProfile('master')
    const hires = getEnhancementProfile('hires')

    expect(master.lowShelf.gainDb).toBeGreaterThan(studio.lowShelf.gainDb)
    expect(master.compressor.ratio).toBeGreaterThan(studio.compressor.ratio)
    expect(hires.air.gainDb).toBeGreaterThan(studio.air.gainDb)
    expect(hires.outputGainDb).toBeGreaterThan(studio.outputGainDb)
  })

  it('creates a soft limiter curve that respects the published true-peak ceiling', () => {
    const studio = getEnhancementProfile('studio')
    const ceilingGain = dbToGain(studio.outputCeilingDbtp)
    const curve = createSoftLimiterCurve(studio.limiterDrive, ceilingGain, 257)
    const maxSample = Math.max(...Array.from(curve))
    const minSample = Math.min(...Array.from(curve))

    expect(maxSample).toBeLessThanOrEqual(ceilingGain)
    expect(minSample).toBeGreaterThanOrEqual(-ceilingGain)
    expect(curve[128]).toBeCloseTo(0, 5)
  })
})
