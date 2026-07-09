import { describe, expect, it } from 'vitest'
import app from './App.tsx?raw'
import css from './index.css?raw'

describe('liquid glass material tokens', () => {
  it('uses a denser glass surface instead of high transparency', () => {
    expect(css).toContain('--lg-fill: rgba(12, 17, 25, 0.72);')
    expect(css).toContain('--glass-backdrop: blur(34px) saturate(150%) brightness(104%);')
  })

  it('models edge reflection without colored stroke gradients', () => {
    expect(css).toContain('--lg-edge-reflect: rgba(255, 255, 255, 0.34);')
    expect(css).toContain('--lg-edge-reflect-soft: rgba(255, 255, 255, 0.12);')
    expect(css).not.toContain('conic-gradient(from 210deg, rgba(134, 244, 255, 0.22)')
    expect(css).not.toContain('rgba(255, 142, 209, 0.13)')
    expect(css).not.toContain('rgba(88, 255, 178, 0.12)')
  })

  it('keeps liquid refraction subtle instead of heavy distortion', () => {
    expect(app).toContain('stdDeviation="0.85"')
    expect(app).toContain('scale="8"')
    expect(app).toContain(
      'values="1.025 0 0 0 0.006  0 1.02 0 0 0.006  0 0 1.035 0 0.01  0 0 0 1 0"',
    )
  })

  it('lets the mobile header wrap instead of pushing content off canvas', () => {
    expect(css).toContain('@media (max-width: 760px)')
    expect(css).toContain('flex-wrap: wrap;')
    expect(css).toContain('width: min(100%, calc(100vw - 2rem));')
  })
})
