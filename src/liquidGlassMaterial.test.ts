import { describe, expect, it } from 'vitest'
import app from './App.tsx?raw'
import css from './index.css?raw'

describe('liquid glass material tokens', () => {
  it('uses a more transparent liquid surface with stronger backdrop optics', () => {
    expect(css).toContain('--lg-fill: rgba(3, 8, 14, 0.24);')
    expect(css).toContain('--glass-fill: rgba(3, 8, 14, 0.22);')
    expect(css).toContain('--blur-panel: 12px;')
    expect(css).toContain('--blur-control: 6px;')
    expect(css).toContain(
      '--glass-backdrop: blur(var(--blur-panel)) saturate(128%) brightness(103%) contrast(104%);',
    )
    expect(css).not.toContain('--blur-panel: 60px;')
    expect(css).not.toContain('--blur-control: 30px;')
    expect(css).toContain('rgba(3, 8, 14, 0.065);')
    expect(css).not.toContain('backdrop: url(#liquid-glass-refraction)')
  })

  it('models edge reflection without colored stroke gradients', () => {
    expect(css).toContain('--lg-edge-reflect: rgba(255, 255, 255, 0.76);')
    expect(css).toContain('--lg-edge-reflect-soft: rgba(255, 255, 255, 0.12);')
    expect(css).toContain('rgba(255, 255, 255, 0.7) 28%')
    expect(css).toContain(`.theme-liquid .site-header-inner {
  position: relative;
  border-color: transparent;`)
    expect(css).toContain(`.theme-liquid .liquid-panel,
.theme-liquid .parameter-panel {
  border: 1px solid transparent;`)
    expect(css).toContain(`.theme-liquid .liquid-surface,
.theme-liquid .module-card,
.theme-liquid .foundation-card,
.theme-liquid .research-card,
.theme-liquid .research-panel {
  border: 1px solid transparent;`)
    expect(css).not.toContain('conic-gradient(from 210deg, rgba(134, 244, 255, 0.22)')
    expect(css).not.toContain('rgba(255, 142, 209, 0.13)')
    expect(css).not.toContain('rgba(88, 255, 178, 0.12)')
    expect(css).not.toContain('mask-composite: exclude')
    expect(css).not.toContain('mix-blend-mode: overlay')
  })

  it('uses short directional reflections instead of full perimeter outlines', () => {
    expect(css).toContain('var(--scroll-sheen-shift) top / 42% 1px no-repeat')
    expect(css).toContain('left top / 1px 26% no-repeat')
    expect(css).toContain('right bottom / 24% 1px no-repeat')
    expect(css).toContain('.theme-liquid .site-header-inner::after')
    expect(css).toContain('calc(var(--lens-x) - 4rem) top / 8rem 1px no-repeat')
  })

  it('keeps selected controls dimmer than primary actions', () => {
    expect(css).toContain('rgba(232, 244, 248, 0.58)')
    expect(css).toContain('rgba(211, 228, 236, 0.28)')
    expect(css).toContain('color: rgba(248, 252, 255, 0.96);')
    expect(css).toContain('scale(0.985, 0.955)')
  })

  it('loads a generated liquid glass audio background behind the hero', () => {
    expect(app).toContain("liquidBackground: assetPath('/generated/liquid-glass-audio-bg-v2.png')")
    expect(app).toContain('className="hero-liquid-image absolute inset-0 h-full w-full scale-[1.04] object-cover"')
    expect(app).toContain('className="hero-liquid-reflection absolute inset-0 h-full w-full object-cover"')
    expect(css).toContain('.hero-liquid-image')
    expect(css).toContain('mix-blend-mode: screen;')
  })

  it('only mounts the legacy hero video for frosted mode', () => {
    expect(app).toContain('<HeroBackdrop glassMode={glassMode} />')
    expect(app).toContain("function HeroBackdrop({ glassMode }: { glassMode: GlassMode })")
    expect(app).toContain("glassMode === 'frosted' ?")
  })

  it('uses deeper liquid refraction without distorting foreground content', () => {
    expect(app).toContain('stdDeviation="1.05"')
    expect(app).toContain('scale="11"')
    expect(app).toContain(
      'values="1.025 0 0 0 0.006  0 1.02 0 0 0.006  0 0 1.035 0 0.01  0 0 0 1 0"',
    )
  })

  it('moves lens reflections with pointer position on interactive surfaces', () => {
    expect(css).toContain('--lens-x: 50%;')
    expect(css).toContain('.theme-liquid .is-lens-active::before')
    expect(app).toContain("'.module-card'")
    expect(app).toContain("'.parameter-panel'")
    expect(app).toContain("pendingSurface.style.setProperty('--lens-x'")
    expect(app).toContain("pendingSurface.style.setProperty('--lens-y'")
    expect(app).toContain("surface.style.removeProperty('--lens-x')")
    expect(app).toContain("surface.style.removeProperty('--lens-y')")
  })

  it('drives scroll reflection from the document scrolling state', () => {
    expect(css).toContain('.scrolling .theme-liquid .liquid-panel::after')
    expect(css).not.toContain('.theme-liquid.scrolling')
    expect(app).toContain("'--scroll-sheen-shift'")
  })

  it('uses shared moving lenses for segmented controls', () => {
    expect(app).toContain('data-active={glassMode}')
    expect(app).toContain('data-active={sourceMode}')
    expect(css).toContain('.theme-liquid .glass-mode-toggle::before')
    expect(css).toContain('.theme-frosted .glass-mode-toggle::before')
    expect(css).toContain('.theme-liquid .source-tabs::before')
    expect(css).toContain('.theme-frosted .glass-mode-toggle[data-active="frosted"]::before')
    expect(css).toContain('.theme-liquid .source-tabs[data-active="platform"]::before')
  })

  it('contains parameter caustics inside each parameter card', () => {
    expect(css).toContain(`.theme-liquid .parameter-stack {
  position: relative;
  isolation: isolate;
  overflow: hidden;`)
  })

  it('keeps the native play button activation path singular', () => {
    expect(app).toContain('onClick={activatePlayer}')
    expect(app).not.toContain('onPointerDown={activatePlayer}')
  })

  it('lets the mobile header wrap instead of pushing content off canvas', () => {
    expect(css).toContain('@media (max-width: 760px)')
    expect(css).toContain('flex-wrap: wrap;')
    expect(css).toContain('width: min(100%, calc(100vw - 2rem));')
  })
})
