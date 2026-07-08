import { describe, expect, it } from 'vitest'
import {
  enhancementProfiles,
  getEnhancementProfile,
  getParameterRows,
  type EnhancementTierId,
} from './audioEnhancement'

const tierIds: EnhancementTierId[] = ['clean', 'studio', 'master', 'hires']

describe('audio enhancement profiles', () => {
  it('exports four reusable enhancement tiers', () => {
    expect(enhancementProfiles.map((profile) => profile.id)).toEqual(tierIds)
    expect(enhancementProfiles).toHaveLength(4)
  })

  it('returns a stable profile and falls back to studio for unknown tier ids', () => {
    expect(getEnhancementProfile('master').id).toBe('master')
    expect(getEnhancementProfile('missing-tier').id).toBe('studio')
  })

  it('keeps every tier displayable through App-compatible before and after rows', () => {
    for (const tierId of tierIds) {
      const profile = getEnhancementProfile(tierId)
      const rows = getParameterRows(tierId)

      expect(profile.eqBands).toEqual([profile.lowShelf, profile.body, profile.presence, profile.air])
      expect(rows.before).toContain('旁路直通 0 dB')
      expect(rows.after.length).toBeGreaterThanOrEqual(12)
      expect(rows.after.some((row) => row.includes('wet mix'))).toBe(true)
      expect(rows.after.some((row) => row.includes('dB'))).toBe(true)
      expect(rows.after.some((row) => row.includes('Hz') || row.includes('kHz'))).toBe(true)
      expect(rows.after.some((row) => row.includes('dBFS'))).toBe(true)
      expect(rows.after.some((row) => row.includes('%'))).toBe(true)
      expect(rows.after.some((row) => row.includes('LUFS'))).toBe(true)
    }
  })

  it('keeps the hifi profiles transparent instead of effect-heavy', () => {
    for (const tierId of tierIds) {
      const profile = getEnhancementProfile(tierId)
      const gains = profile.eqBands.map((band) => Math.abs(band.gainDb))
      const rows = getParameterRows(tierId).after.join(' ')

      expect(Math.max(...gains)).toBeLessThanOrEqual(1.5)
      expect(profile.compressor.ratio).toBeLessThanOrEqual(1.35)
      expect(profile.outputGainDb).toBeLessThanOrEqual(0.8)
      expect(profile.stereoWidthPercent).toBe(100)
      expect(rows).not.toMatch(/软限幅|饱和|混响|空间|扩展|reverb|saturation|widener/i)
    }
  })

  it('documents browser-safe peak protection without claiming source restoration', () => {
    for (const tierId of tierIds) {
      const profile = getEnhancementProfile(tierId)

      expect(profile.peakProtection.truePeakCeilingDbtp).toBeLessThanOrEqual(-1)
      expect(profile.outputCeilingDbtp).toBe(profile.peakProtection.truePeakCeilingDbtp)
      expect(profile.exportTarget.sampleRateHz).toBe(192000)
      expect(profile.exportTarget.mp3BitrateKbps).toBe(320)
      expect(profile.exportTarget.pcmBitDepth).toBe(24)
      expect(profile.notes.join(' ')).not.toMatch(/true lossless|真无损|restore original master/i)
    }
  })
})
