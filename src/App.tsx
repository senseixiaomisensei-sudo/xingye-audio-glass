import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity,
  AudioLines,
  Cable,
  CircleDot,
  Download,
  Gauge,
  Layers3,
  Link2,
  ListMusic,
  Pause,
  Play,
  Radio,
  ShieldCheck,
  SlidersHorizontal,
  UploadCloud,
  WandSparkles,
  Waves,
} from 'lucide-react'
import {
  dbToGain,
  getEnhancementProfile,
  getParameterRows,
  type EnhancementProfile,
  type EnhancementTierId,
  type EqBand,
} from './audioEnhancement'

type SourceMode = 'upload' | 'platform'
type PreviewMode = 'before' | 'after'
type GlassMode = 'liquid' | 'frosted'
type TierId = EnhancementTierId
type AudioSource = {
  kind: 'demo' | 'upload'
  title: string
  artist: string
  previewUrl: string
  sourceLabel: string
  ariaLabel: string
  collection?: string
  sourceUrl?: string
}

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const heroMedia = {
  liquidBackground: assetPath('/generated/liquid-glass-audio-bg-v2.png'),
  poster: assetPath('/motion-sites/audio-showcase.webp'),
  video: assetPath('/motion-sites/audio-showcase.mp4'),
}

const defaultAudioSource: AudioSource = {
  kind: 'demo',
  title: 'Unwelcome School',
  artist: 'Mitsukiyo',
  collection: 'Blue Archive 3rd Anniversary (Original Soundtrack)',
  sourceLabel: 'Apple Music 官方预览',
  sourceUrl: 'https://music.apple.com/us/album/unwelcome-school/1783092895?i=1783092896&uo=4',
  previewUrl:
    'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/4b/1f/07/4b1f0740-8d7c-45e2-cce3-d12cb8e66f15/mzaf_14400797571439858173.plus.aac.p.m4a',
  ariaLabel: '蔚蓝档案默认试听源',
}

const specs = ['MP3', 'FLAC', 'WAV', 'AAC', 'OGG', 'M4A', 'AIFF', '192kHz', '320kbps', '24-bit 位深']

const tiers: Array<{
  id: TierId
  name: string
  short: string
  description: string
  meter: number
}> = [
  {
    id: 'clean',
    name: 'Clean Lift',
    short: '去噪 / 齿音 / 响度整理',
    description: '轻量清洁模式，适合语音、Demo、小样和低噪现场录音。',
    meter: 46,
  },
  {
    id: 'studio',
    name: 'Studio Bloom',
    short: '动态 / 清晰 / 稳定响度',
    description: '默认音乐增强档，保持原声场并提升清晰度、响度稳定性和峰值安全。',
    meter: 68,
  },
  {
    id: 'master',
    name: 'Master Air',
    short: '频谱 / 宽度 / 母带平衡',
    description: '面向成品发布的母带外壳，后续接响度、频谱和立体声处理。',
    meter: 82,
  },
  {
    id: 'hires',
    name: 'Hi-Res Vault',
    short: '192kHz / 24-bit / 高解析导出',
    description: '高解析归档路径，保留 24-bit 位深和 192kHz 展示位。',
    meter: 94,
  },
]

const pipeline = [
  {
    stage: '01',
    title: 'Import',
    icon: UploadCloud,
    signal: 'local picker / URL queue',
    body: '本地文件与平台链接入口先就位，真实上传、授权和解析后续接入。',
  },
  {
    stage: '02',
    title: 'Analyze',
    icon: Activity,
    signal: 'format / loudness / spectrum',
    body: '预留频谱、响度、采样率、动态范围和文件格式检查模块。',
  },
  {
    stage: '03',
    title: 'Enhance',
    icon: SlidersHorizontal,
    signal: 'A/B preview / tier state',
    body: 'Clean、Studio、Master、Hi-Res 四档已在 UI 和状态层建模。',
  },
  {
    stage: '04',
    title: 'Export',
    icon: Download,
    signal: 'queued download shell',
    body: '为 MP3、FLAC、WAV 等导出策略预留队列、状态和下载入口。',
  },
]

const foundation = [
  {
    title: 'Figma-ready tokens',
    icon: Layers3,
    signal: 'tokens / components',
    body: '颜色、玻璃、阴影、半径、间距和组件命名按后续 Figma 迁移整理。',
  },
  {
    title: 'RunComfy video asset route',
    icon: WandSparkles,
    signal: 'video / motion route',
    body: '复用 video-edit 开源 skill 的路由逻辑，后续可接 Hero 视频重绘、背景替换或动效素材生成。',
  },
  {
    title: 'Platform adapters',
    icon: Cable,
    signal: 'music source adapters',
    body: '网易云、QQ 音乐、Apple Music、Spotify 等入口先占位，不做抓取。',
  },
]

const researchPhases = [
  {
    title: '导入与解码',
    signal: 'File API / AudioContext',
    body: '本地选择音频文件，读取时长、声道和采样率，并稳定截取 15-30 秒预览片段。',
  },
  {
    title: '分析与 A/B 基线',
    signal: 'Peak / RMS / preview cache',
    body: '先建立原音预览和峰值、RMS、简易响度分析，确保增强前后可同位对比。',
  },
  {
    title: 'MVP DSP 链',
    signal: 'EQ / compressor / limiter',
    body: '用保守母带整理路线做响度、EQ、轻压缩和限幅，避免削波和过度染色。',
  },
  {
    title: 'WAV 导出与稳定性',
    signal: 'WAV encoder / worker-ready',
    body: '先导出增强后的 WAV 预览片段，并为大文件处理、错误提示和后台渲染预留边界。',
  },
]

const mvpModules = [
  'features/audio-lab',
  'audio/decode',
  'audio/analyze',
  'audio/dsp',
  'audio/export',
  'workers/audioPreview',
]

const guardrails = [
  '禁止抓取平台受保护音频、绕过 DRM 或宣传低码率恢复真无损。',
  '192kHz / 24-bit 只能作为导出规格，不能承诺恢复原始母带信息。',
  'MP3、FLAC、AAC 等完整多格式导出后置到 FFmpeg 或后端任务队列。',
]

const barsBefore = [26, 38, 31, 46, 35, 52, 44, 58, 39, 48, 34, 43]
const barsAfter = [45, 66, 54, 78, 61, 88, 72, 94, 58, 81, 64, 74]

type EnhancementNodes = {
  inputTrim: GainNode
  highPass: BiquadFilterNode
  lowShelf: BiquadFilterNode
  body: BiquadFilterNode
  presence: BiquadFilterNode
  air: BiquadFilterNode
  compressor: DynamicsCompressorNode
  makeupGain: GainNode
  peakGuard: DynamicsCompressorNode
}

function App() {
  const [sourceMode, setSourceMode] = useState<SourceMode>('upload')
  const [previewMode, setPreviewMode] = useState<PreviewMode>('after')
  const [glassMode, setGlassMode] = useState<GlassMode>(() => getInitialGlassMode())
  const [selectedTier, setSelectedTier] = useState<TierId>('hires')
  const [uploadedSource, setUploadedSource] = useState<AudioSource | null>(null)
  const [platformUrl, setPlatformUrl] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [exportStatus, setExportStatus] = useState('')
  const uploadedUrlRef = useRef<string | null>(null)

  const activeTier = useMemo(
    () => tiers.find((tier) => tier.id === selectedTier) ?? tiers[3],
    [selectedTier],
  )

  const audioSource = uploadedSource ?? defaultAudioSource
  const fileName = uploadedSource?.title ?? ''

  const handleFileSelected = useCallback((file: File | null) => {
    if (uploadedUrlRef.current) {
      globalThis.URL.revokeObjectURL(uploadedUrlRef.current)
      uploadedUrlRef.current = null
    }

    if (!file) {
      setUploadedSource(null)
      setIsPlaying(false)
      return
    }

    const previewUrl = createObjectAudioUrl(file)
    uploadedUrlRef.current = previewUrl || null
    setUploadedSource({
      kind: 'upload',
      title: file.name,
      artist: '本地文件',
      previewUrl,
      sourceLabel: '本地上传预览',
      ariaLabel: '上传音频预览源',
    })
    setSourceMode('upload')
    setIsPlaying(false)
  }, [])

  useEffect(() => {
    return () => {
      if (uploadedUrlRef.current) {
        globalThis.URL.revokeObjectURL(uploadedUrlRef.current)
      }
    }
  }, [])

  // ponytail: 滚动交互 - 液态玻璃边缘反光动画
  useEffect(() => {
    if (glassMode !== 'liquid') return

    let rafId = 0
    let scrollTimeout: number | null = null

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0

      document.documentElement.style.setProperty('--scroll-progress', String(progress))
      document.documentElement.classList.add('scrolling')

      if (scrollTimeout) clearTimeout(scrollTimeout)
      scrollTimeout = window.setTimeout(() => {
        document.documentElement.classList.remove('scrolling')
      }, 150)
    }

    const handleScroll = () => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        updateScrollProgress()
        rafId = 0
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('touchmove', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchmove', handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
      if (scrollTimeout) clearTimeout(scrollTimeout)
    }
  }, [glassMode])

  useEffect(() => {
    if (glassMode !== 'liquid') return

    const lensSelector = [
      '.site-header-inner',
      '.liquid-panel',
      '.liquid-surface',
      '.glass-button',
      '.glass-mode-toggle',
      '.tab-button',
      '.tier-button',
      '.preview-button',
      '.play-button',
      '.export-button',
      '.upload-zone',
      '.track-card',
      '.live-waveform',
      '.glass-input',
      '.parameter-stack',
    ].join(', ')

    let activeSurface: HTMLElement | null = null
    let pendingSurface: HTMLElement | null = null
    let pendingX = 50
    let pendingY = 12
    let frameId = 0

    const applyLensPosition = () => {
      if (pendingSurface) {
        pendingSurface.style.setProperty('--lens-x', `${pendingX}%`)
        pendingSurface.style.setProperty('--lens-y', `${pendingY}%`)
      }
      frameId = 0
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || !(event.target instanceof Element)) return

      const surface = event.target.closest<HTMLElement>(lensSelector)
      if (!surface) return

      if (activeSurface !== surface) {
        activeSurface?.classList.remove('is-lens-active')
        activeSurface = surface
        activeSurface.classList.add('is-lens-active')
      }

      const bounds = surface.getBoundingClientRect()
      pendingSurface = surface
      pendingX = Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100))
      pendingY = Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100))

      if (!frameId) {
        frameId = window.requestAnimationFrame(applyLensPosition)
      }
    }

    const handlePointerOut = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) return

      const surface = event.target.closest<HTMLElement>(lensSelector)
      if (!surface) return
      if (event.relatedTarget instanceof Node && surface.contains(event.relatedTarget)) return

      surface.classList.remove('is-lens-active')
      if (activeSurface === surface) activeSurface = null
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerout', handlePointerOut, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerout', handlePointerOut)
      activeSurface?.classList.remove('is-lens-active')
      if (frameId) window.cancelAnimationFrame(frameId)
    }
  }, [glassMode])

  return (
    <main
      className={`glass-mode-shell theme-${glassMode} min-h-screen overflow-x-hidden bg-[#050507] text-slate-50`}
      data-liquid-ui="ios26"
      data-glass-mode={glassMode}
    >
      <GlassFilterDefs />
      <Hero
        activeTier={activeTier}
        audioSource={audioSource}
        exportStatus={exportStatus}
        fileName={fileName}
        isPlaying={isPlaying}
        platformUrl={platformUrl}
        previewMode={previewMode}
        selectedTier={selectedTier}
        sourceMode={sourceMode}
        glassMode={glassMode}
        onExportRequest={() => setExportStatus(`${activeTier.name} 已加入本地导出队列`)}
        onFileSelected={handleFileSelected}
        onGlassModeChange={setGlassMode}
        onPlatformUrlChange={setPlatformUrl}
        onPlayingChange={setIsPlaying}
        onPreviewModeChange={setPreviewMode}
        onSourceModeChange={setSourceMode}
        onTierChange={setSelectedTier}
      />
      <SpecRail />
      <PipelineSection />
      <FoundationSection />
      <ResearchPlanSection />
      <Footer />
    </main>
  )
}

function Hero({
  activeTier,
  audioSource,
  exportStatus,
  fileName,
  isPlaying,
  platformUrl,
  previewMode,
  selectedTier,
  sourceMode,
  glassMode,
  onExportRequest,
  onFileSelected,
  onGlassModeChange,
  onPlatformUrlChange,
  onPlayingChange,
  onPreviewModeChange,
  onSourceModeChange,
  onTierChange,
}: {
  activeTier: (typeof tiers)[number]
  audioSource: AudioSource
  exportStatus: string
  fileName: string
  isPlaying: boolean
  platformUrl: string
  previewMode: PreviewMode
  selectedTier: TierId
  sourceMode: SourceMode
  glassMode: GlassMode
  onExportRequest: () => void
  onFileSelected: (file: File | null) => void
  onGlassModeChange: (value: GlassMode) => void
  onPlatformUrlChange: (value: string) => void
  onPlayingChange: (value: boolean) => void
  onPreviewModeChange: (value: PreviewMode) => void
  onSourceModeChange: (value: SourceMode) => void
  onTierChange: (value: TierId) => void
}) {
  const activeProfile = useMemo(() => getEnhancementProfile(selectedTier), [selectedTier])
  const parameterRows = useMemo(() => getParameterRows(selectedTier), [selectedTier])

  return (
    <section className="relative overflow-hidden" aria-labelledby="home-heading">
      <HeroBackdrop />
      <Header glassMode={glassMode} onGlassModeChange={onGlassModeChange} />

      <div className="hero-shell relative z-10 mx-auto grid w-full max-w-[1440px] gap-6 px-4 pb-8 pt-24 sm:px-6 lg:px-8 min-[1200px]:min-h-[calc(100svh-104px)] min-[1200px]:grid-cols-[0.86fr_1.14fr] min-[1200px]:items-center min-[1200px]:gap-6 min-[1200px]:pb-8 min-[1200px]:pt-[5.5rem] xl:gap-8">
        <div className="hero-copy max-w-3xl">
          <div className="glass-chip mb-5 inline-flex items-center gap-2 min-[1200px]:mb-6">
            <CircleDot size={15} />
            <span>local-first audio enhancement shell</span>
          </div>
          <h1
            id="home-heading"
            className="text-4xl font-semibold leading-[1.2] tracking-normal sm:text-6xl min-[1200px]:text-7xl"
          >
            星野的mp3
          </h1>
          <p className="mt-4 max-w-2xl text-2xl font-light leading-tight text-white sm:text-4xl min-[1200px]:mt-6">
            把任意音乐推到清澈高解析。
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68 sm:text-lg min-[1200px]:mt-5 min-[1200px]:text-base min-[1200px]:leading-8">
            上传自己的音频，或先把音乐平台链接放进待处理队列。首版只做本机交互和页面基础，
            后续再接音质增强、授权解析、队列、导出和账号体系。
          </p>

          <div className="metric-grid mt-6 grid max-w-2xl grid-cols-3 gap-2 sm:gap-3 min-[1200px]:mt-7">
            <Metric value="192kHz" label="最高采样率" />
            <Metric value="320kbps" label="目标比特率" />
            <Metric value="24-bit 位深" label="高解析导出" />
          </div>
        </div>

        <div className="panel-dock hero-panels grid gap-4 min-[1200px]:grid-cols-[minmax(0,0.95fr)_minmax(260px,0.72fr)] min-[1200px]:items-stretch xl:gap-4">
          <ImportConsole
            activeTier={activeTier}
            fileName={fileName}
            platformUrl={platformUrl}
            selectedTier={selectedTier}
            sourceMode={sourceMode}
            onFileSelected={onFileSelected}
            onPlatformUrlChange={onPlatformUrlChange}
            onSourceModeChange={onSourceModeChange}
            onTierChange={onTierChange}
          />
          <PlayerPanel
            activeTier={activeTier}
            audioSource={audioSource}
            exportStatus={exportStatus}
            isPlaying={isPlaying}
            previewMode={previewMode}
            onExportRequest={onExportRequest}
            onPlayingChange={onPlayingChange}
            onPreviewModeChange={onPreviewModeChange}
          />
          <ParameterPanel
            className="min-[1200px]:col-span-2"
            profile={activeProfile}
            rows={parameterRows}
          />
        </div>
      </div>
    </section>
  )
}

function HeroBackdrop() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#050507]">
      <div
        aria-label="Liquid Glass 声场背景"
        className="liquid-material-field absolute inset-0"
        data-glass-depth="ambient"
      />
      <img
        alt=""
        aria-hidden="true"
        className="hero-liquid-image absolute inset-0 h-full w-full scale-[1.04] object-cover"
        src={heroMedia.liquidBackground}
      />
      <video
        aria-hidden="true"
        autoPlay
        className="hero-video absolute inset-0 h-full w-full scale-[1.08] object-cover"
        loop
        muted
        playsInline
        poster={heroMedia.poster}
        src={heroMedia.video}
      />
      <img
        alt=""
        aria-hidden="true"
        className="hero-poster absolute inset-0 h-full w-full scale-[1.08] object-cover mix-blend-screen"
        src={heroMedia.poster}
      />
      <div className="hero-gradient absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,rgba(5,5,7,0),#050507)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(218,238,255,0.045)_0%,transparent_50%)] mix-blend-soft-light" />
      <div className="spectrum-orbit spectrum-field" aria-hidden="true">
        {Array.from({ length: 30 }, (_, index) => (
          <span key={index} style={{ animationDelay: `${index * 55}ms` }} />
        ))}
      </div>
    </div>
  )
}

function getInitialGlassMode(): GlassMode {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'liquid'
  }

  return window.matchMedia('(max-width: 767px)').matches ? 'frosted' : 'liquid'
}

function GlassFilterDefs() {
  return (
    <svg
      aria-hidden="true"
      className="liquid-glass-filter-defs"
      focusable="false"
      height="0"
      width="0"
    >
      <filter id="liquid-glass-refraction" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence
          baseFrequency="0.014 0.034"
          numOctaves="2"
          result="liquidNoise"
          seed="17"
          type="fractalNoise"
        />
        <feGaussianBlur in="liquidNoise" result="liquidMap" stdDeviation="1.05" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="liquidMap"
          result="liquidShift"
          scale="11"
          xChannelSelector="R"
          yChannelSelector="G"
        />
        <feColorMatrix
          in="liquidShift"
          result="liquidGlass"
          type="matrix"
          values="1.025 0 0 0 0.006  0 1.02 0 0 0.006  0 0 1.035 0 0.01  0 0 0 1 0"
        />
      </filter>
      <filter id="frosted-glass-grain" x="-8%" y="-8%" width="116%" height="116%">
        <feTurbulence baseFrequency="0.88" numOctaves="1" result="grain" seed="9" type="fractalNoise" />
        <feColorMatrix in="grain" result="softGrain" type="saturate" values="0" />
        <feBlend in="SourceGraphic" in2="softGrain" mode="soft-light" />
      </filter>
    </svg>
  )
}

function Header({
  glassMode,
  onGlassModeChange,
}: {
  glassMode: GlassMode
  onGlassModeChange: (value: GlassMode) => void
}) {
  return (
    <header className="absolute inset-x-0 top-0 z-20" data-glass-depth="navigation">
      <div className="site-header-inner mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-5 sm:px-6 lg:px-8">
        <a className="flex items-center gap-3" href="#home-heading" aria-label="星野的mp3">
          <span className="logo-mark">
            <AudioLines size={18} strokeWidth={2.4} />
          </span>
          <span className="text-base font-medium">星野的mp3</span>
        </a>
        <nav className="hidden items-center gap-6 text-sm text-white/66 md:flex" aria-label="主页导航">
          <a className="transition hover:text-white" href="#pipeline">
            模块
          </a>
          <a className="transition hover:text-white" href="#foundation">
            扩展
          </a>
          <a className="transition hover:text-white" href="#research-plan">
            计划
          </a>
          <a className="transition hover:text-white" href="#specs">
            规格
          </a>
        </nav>
        <GlassModeToggle glassMode={glassMode} onGlassModeChange={onGlassModeChange} />
        <a className="glass-button" href="#import">
          <ListMusic size={16} />
          <span>打开控制台</span>
        </a>
      </div>
    </header>
  )
}

function GlassModeToggle({
  glassMode,
  onGlassModeChange,
}: {
  glassMode: GlassMode
  onGlassModeChange: (value: GlassMode) => void
}) {
  return (
    <div className="glass-mode-toggle" role="group" aria-label="玻璃材质模式">
      <button
        aria-pressed={glassMode === 'liquid'}
        className={`glass-mode-option ${glassMode === 'liquid' ? 'is-active' : ''}`}
        type="button"
        onClick={() => onGlassModeChange('liquid')}
      >
        液态玻璃
      </button>
      <button
        aria-pressed={glassMode === 'frosted'}
        className={`glass-mode-option ${glassMode === 'frosted' ? 'is-active' : ''}`}
        type="button"
        onClick={() => onGlassModeChange('frosted')}
      >
        毛玻璃
      </button>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="liquid-surface rounded-lg px-3 py-3 sm:px-4">
      <p className="text-sm font-medium text-white">{value}</p>
      <p className="mt-1 text-xs text-white/52">{label}</p>
    </div>
  )
}

function ImportConsole({
  activeTier,
  fileName,
  platformUrl,
  selectedTier,
  sourceMode,
  onFileSelected,
  onPlatformUrlChange,
  onSourceModeChange,
  onTierChange,
}: {
  activeTier: (typeof tiers)[number]
  fileName: string
  platformUrl: string
  selectedTier: TierId
  sourceMode: SourceMode
  onFileSelected: (file: File | null) => void
  onPlatformUrlChange: (value: string) => void
  onSourceModeChange: (value: SourceMode) => void
  onTierChange: (value: TierId) => void
}) {
  return (
    <section id="import" className="liquid-panel glass-pane import-console p-4 transition-transform duration-300 hover:translate-y-[-2px]" aria-label="Pulse console">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-cyan-100/72">Pulse console</p>
          <h2 className="mt-1 text-xl font-medium text-white">导入和增强档位</h2>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-white to-cyan-50 text-slate-950 shadow-lg shadow-cyan-400/30 transition-transform duration-200 hover:scale-105">
          <Gauge size={21} />
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 rounded-2xl bg-black/24 p-1" role="tablist" aria-label="导入来源">
        <button
          aria-selected={sourceMode === 'upload'}
          aria-controls="upload-panel"
          className={`tab-button ${sourceMode === 'upload' ? 'is-active' : ''}`}
          id="upload-tab"
          role="tab"
          type="button"
          onClick={() => onSourceModeChange('upload')}
        >
          上传音频
        </button>
        <button
          aria-selected={sourceMode === 'platform'}
          aria-controls="platform-panel"
          className={`tab-button ${sourceMode === 'platform' ? 'is-active' : ''}`}
          id="platform-tab"
          role="tab"
          type="button"
          onClick={() => onSourceModeChange('platform')}
        >
          平台链接
        </button>
      </div>

      <div className="mt-3">
        {sourceMode === 'upload' ? (
          <label
            aria-labelledby="upload-tab"
            className="upload-zone group"
            id="upload-panel"
            role="tabpanel"
          >
            <input
              aria-label="选择音频文件"
              className="sr-only"
              type="file"
              accept=".mp3,.flac,.wav,.aac,.ogg,.m4a,.aiff,audio/*"
              onChange={(event) => onFileSelected(event.currentTarget.files?.[0] ?? null)}
            />
            <UploadCloud size={24} className="transition-transform duration-200 group-hover:scale-110" />
            <span className="mt-2 text-sm text-white transition-colors duration-200 group-hover:text-cyan-100">{fileName || '拖入或选择 MP3 / FLAC / WAV'}</span>
            <span className="mt-1 text-xs text-white/54">支持 MP3 / FLAC / WAV / AAC / OGG / M4A / AIFF</span>
          </label>
        ) : (
          <label aria-labelledby="platform-tab" className="block" id="platform-panel" role="tabpanel">
            <span className="mb-2 flex items-center gap-2 text-sm text-white/62">
              <Link2 size={16} />
              音乐平台 URL
            </span>
            <input
              className="glass-input"
              placeholder="粘贴音乐平台链接，后续接解析与授权"
              type="url"
              value={platformUrl}
              onChange={(event) => onPlatformUrlChange(event.currentTarget.value)}
            />
          </label>
        )}
      </div>

      <div className="mt-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-sm text-white/62">增强档位</p>
          <p className="text-xs text-cyan-100/60">{activeTier.short}</p>
        </div>
        <div className="grid gap-1.5">
          {tiers.map((tier) => (
            <TierButton
              key={tier.id}
              selected={selectedTier === tier.id}
              tier={tier}
              onSelect={() => onTierChange(tier.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function TierButton({
  selected,
  tier,
  onSelect,
}: {
  selected: boolean
  tier: (typeof tiers)[number]
  onSelect: () => void
}) {
  return (
    <button
      aria-label={`选择 ${tier.name} 档位`}
      aria-pressed={selected}
      className={`tier-button group ${selected ? 'is-selected' : ''}`}
      data-tier-id={tier.id}
      type="button"
      onClick={onSelect}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="font-medium">{tier.name}</span>
        <span className={`text-xs transition-colors duration-200 ${selected ? 'text-current/70' : 'text-current/58'}`}>{tier.meter}%</span>
      </span>
      <span className="tier-description mt-1 block text-xs leading-4 text-current/58">{tier.description}</span>
    </button>
  )
}

function createObjectAudioUrl(file: File) {
  if (typeof globalThis.URL?.createObjectURL !== 'function') {
    return ''
  }

  try {
    return globalThis.URL.createObjectURL(file)
  } catch {
    return ''
  }
}

function supportsRealtimeAudio() {
  if (typeof window === 'undefined') {
    return false
  }

  const audioWindow = window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }
  return typeof (audioWindow.AudioContext ?? audioWindow.webkitAudioContext) === 'function'
}

function formatTime(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return '0:00'
  }

  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutMessage: string) {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)

    promise.then(
      (value) => {
        window.clearTimeout(timer)
        resolve(value)
      },
      (error: unknown) => {
        window.clearTimeout(timer)
        reject(error)
      },
    )
  })
}

function setAudioParam(param: AudioParam, value: number, context: AudioContext) {
  const now = context.currentTime
  param.cancelScheduledValues(now)
  param.setTargetAtTime(value, now, 0.018)
}

function configureEqBand(filter: BiquadFilterNode, band: EqBand, context: AudioContext) {
  filter.type = band.type
  setAudioParam(filter.frequency, band.frequencyHz, context)
  setAudioParam(filter.gain, band.gainDb, context)
  setAudioParam(filter.Q, band.q ?? 0.707, context)
}

function configureEnhancementNodes(context: AudioContext, nodes: EnhancementNodes, profile: EnhancementProfile) {
  setAudioParam(nodes.inputTrim.gain, dbToGain(profile.inputTrimDb), context)

  nodes.highPass.type = 'highpass'
  setAudioParam(nodes.highPass.frequency, profile.highPass.frequencyHz, context)
  setAudioParam(nodes.highPass.Q, profile.highPass.q, context)

  configureEqBand(nodes.lowShelf, profile.lowShelf, context)
  configureEqBand(nodes.body, profile.body, context)
  configureEqBand(nodes.presence, profile.presence, context)
  configureEqBand(nodes.air, profile.air, context)

  setAudioParam(nodes.compressor.threshold, profile.compressor.thresholdDb, context)
  setAudioParam(nodes.compressor.knee, profile.compressor.kneeDb, context)
  setAudioParam(nodes.compressor.ratio, profile.compressor.ratio, context)
  setAudioParam(nodes.compressor.attack, profile.compressor.attackSeconds, context)
  setAudioParam(nodes.compressor.release, profile.compressor.releaseSeconds, context)

  setAudioParam(nodes.makeupGain.gain, dbToGain(profile.outputGainDb), context)
  setAudioParam(nodes.peakGuard.threshold, profile.outputCeilingDbtp, context)
  setAudioParam(nodes.peakGuard.knee, 0, context)
  setAudioParam(nodes.peakGuard.ratio, 20, context)
  setAudioParam(nodes.peakGuard.attack, 0.003, context)
  setAudioParam(nodes.peakGuard.release, 0.08, context)
}

function PlayerPanel({
  activeTier,
  audioSource,
  exportStatus,
  isPlaying,
  previewMode,
  onExportRequest,
  onPlayingChange,
  onPreviewModeChange,
}: {
  activeTier: (typeof tiers)[number]
  audioSource: AudioSource
  exportStatus: string
  isPlaying: boolean
  previewMode: PreviewMode
  onExportRequest: () => void
  onPlayingChange: (value: boolean) => void
  onPreviewModeChange: (value: PreviewMode) => void
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dryGainRef = useRef<GainNode | null>(null)
  const wetGainRef = useRef<GainNode | null>(null)
  const enhancementNodesRef = useRef<EnhancementNodes | null>(null)
  const lastPlayerActivationRef = useRef(Number.NEGATIVE_INFINITY)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [audioError, setAudioError] = useState('')
  const [bars, setBars] = useState(previewMode === 'after' ? barsAfter : barsBefore)
  const progress = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0
  const activeProfile = useMemo(() => getEnhancementProfile(activeTier.id), [activeTier.id])

  const getAudioElement = useCallback(
    () => audioRef.current ?? document.querySelector<HTMLAudioElement>('[data-player-audio="preview"]'),
    [],
  )

  const applyPreviewMode = useCallback((mode: PreviewMode) => {
    const context = audioContextRef.current
    const dryGain = dryGainRef.current
    const wetGain = wetGainRef.current

    if (!context || !dryGain || !wetGain) {
      return
    }

    const now = context.currentTime
    dryGain.gain.cancelScheduledValues(now)
    wetGain.gain.cancelScheduledValues(now)
    dryGain.gain.setTargetAtTime(mode === 'before' ? 1 : 0, now, 0.035)
    wetGain.gain.setTargetAtTime(mode === 'after' ? 1 : 0, now, 0.035)
  }, [])

  const setupAudioGraph = useCallback(() => {
    const audio = getAudioElement()
    const audioWindow = window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }
    const AudioContextConstructor = audioWindow.AudioContext ?? audioWindow.webkitAudioContext

    if (!audio || !AudioContextConstructor) {
      return null
    }

    const context = audioContextRef.current ?? new AudioContextConstructor()
    audioContextRef.current = context

    if (!sourceNodeRef.current) {
      const source = context.createMediaElementSource(audio)
      const dryGain = context.createGain()
      const wetGain = context.createGain()
      const inputTrim = context.createGain()
      const highPass = context.createBiquadFilter()
      const lowShelf = context.createBiquadFilter()
      const body = context.createBiquadFilter()
      const presence = context.createBiquadFilter()
      const air = context.createBiquadFilter()
      const compressor = context.createDynamicsCompressor()
      const makeupGain = context.createGain()
      const peakGuard = context.createDynamicsCompressor()
      const analyser = context.createAnalyser()

      analyser.fftSize = 128
      analyser.smoothingTimeConstant = 0.68

      source.connect(dryGain)
      dryGain.connect(analyser)
      source.connect(inputTrim)
      inputTrim.connect(highPass)
      highPass.connect(lowShelf)
      lowShelf.connect(body)
      body.connect(presence)
      presence.connect(air)
      air.connect(compressor)
      compressor.connect(makeupGain)
      makeupGain.connect(peakGuard)
      peakGuard.connect(wetGain)
      wetGain.connect(analyser)
      analyser.connect(context.destination)

      sourceNodeRef.current = source
      dryGainRef.current = dryGain
      wetGainRef.current = wetGain
      analyserRef.current = analyser
      enhancementNodesRef.current = {
        inputTrim,
        highPass,
        lowShelf,
        body,
        presence,
        air,
        compressor,
        makeupGain,
        peakGuard,
      }
    }

    if (enhancementNodesRef.current) {
      configureEnhancementNodes(context, enhancementNodesRef.current, activeProfile)
    }

    applyPreviewMode(previewMode)
    return context
  }, [activeProfile, applyPreviewMode, getAudioElement, previewMode])

  const handlePlayPause = useCallback(async () => {
    try {
      const audio = getAudioElement()

      if (!audio) {
        setAudioError('播放器音频节点还未准备好')
        return
      }

      if (isPlaying) {
        audio.pause()
        setAudioError('')
        onPlayingChange(false)
        return
      }

      if (!audioSource.previewUrl) {
        setAudioError('当前音频无法在浏览器里预览')
        return
      }

      const context = setupAudioGraph()
      if (!context) {
        setAudioError('当前浏览器不支持 Web Audio 实时增强')
        return
      }
      if (context.state === 'suspended') {
        await withTimeout(context.resume(), 1800, 'audio-context-timeout')
      }
      await withTimeout(audio.play(), 2400, 'audio-play-timeout')
      setAudioError('')
      onPlayingChange(true)
    } catch (error) {
      setAudioError(
        error instanceof Error && error.message === 'audio-context-timeout'
          ? '浏览器阻止了 Web Audio 启动，请再点一次播放'
          : '浏览器阻止了播放，请再点一次播放',
      )
      onPlayingChange(false)
    }
  }, [audioSource.previewUrl, getAudioElement, isPlaying, onPlayingChange, setupAudioGraph])

  const activatePlayer = useCallback(() => {
    const now = Date.now()
    if (now - lastPlayerActivationRef.current < 260) {
      return
    }

    lastPlayerActivationRef.current = now
    setAudioError('正在启动试听...')
    void handlePlayPause()
  }, [handlePlayPause])

  useEffect(() => {
    const context = audioContextRef.current
    const nodes = enhancementNodesRef.current

    if (context && nodes) {
      configureEnhancementNodes(context, nodes, activeProfile)
    }
  }, [activeProfile])

  useEffect(() => {
    applyPreviewMode(previewMode)

    if (!isPlaying) {
      setBars(previewMode === 'after' ? barsAfter : barsBefore)
    }
  }, [applyPreviewMode, isPlaying, previewMode])

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    if (supportsRealtimeAudio()) {
      audio.pause()
      audio.load()
    }
    setCurrentTime(0)
    setDuration(0)
    setAudioError('')
    onPlayingChange(false)
  }, [audioSource.previewUrl, onPlayingChange])

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    const handleLoadedMetadata = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleEnded = () => onPlayingChange(false)
    const handleError = () => setAudioError('试听源暂时无法加载')

    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [onPlayingChange])

  useEffect(() => {
    let frameId = 0
    const samples = new Uint8Array(64)

    const tick = () => {
      const analyser = analyserRef.current
      const audio = getAudioElement()

      if (analyser && audio && !audio.paused && !audio.ended) {
        analyser.getByteFrequencyData(samples)
        const bucketSize = Math.max(1, Math.floor(samples.length / 12))
        const nextBars = Array.from({ length: 12 }, (_, index) => {
          const start = index * bucketSize
          const bucket = samples.slice(start, start + bucketSize)
          const average = bucket.reduce((sum, value) => sum + value, 0) / Math.max(bucket.length, 1)
          const modeLift = previewMode === 'after' ? activeProfile.waveformLift : 0
          return Math.round(Math.min(96, Math.max(14, 18 + (average / 255) * 74 + modeLift)))
        })
        setBars(nextBars)
      }

      frameId = window.requestAnimationFrame(tick)
    }

    frameId = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frameId)
  }, [activeProfile.waveformLift, getAudioElement, previewMode])

  return (
    <aside className="liquid-panel glass-pane player-panel p-4 transition-transform duration-300 hover:translate-y-[-2px]" aria-label="沉浸播放器">
      <audio
        ref={audioRef}
        aria-label={audioSource.ariaLabel}
        className="sr-only"
        crossOrigin="anonymous"
        data-player-audio="preview"
        preload="metadata"
        src={audioSource.previewUrl}
      />

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-fuchsia-100/70">沉浸播放器</p>
          <h2 className="mt-1 text-xl font-medium">星野预览 / {activeTier.name}</h2>
        </div>
        <span className="rounded-full bg-cyan-300/16 px-3 py-1 text-xs text-cyan-100">local demo</span>
      </div>

      <div className="track-card mt-3">
        <div>
          <p className="text-xs text-cyan-100/62">蔚蓝档案</p>
          <h3 className="mt-1 text-base font-medium leading-tight">{audioSource.title}</h3>
          <p className="mt-1 text-xs text-white/48">{audioSource.artist}</p>
        </div>
        {audioSource.sourceUrl ? (
          <a className="source-link" href={audioSource.sourceUrl} rel="noreferrer" target="_blank">
            {audioSource.sourceLabel}
          </a>
        ) : (
          <span className="source-link as-label">{audioSource.sourceLabel}</span>
        )}
      </div>

      <div className={`record-disc mx-auto mt-4 transition-shadow duration-300 ${isPlaying ? 'is-playing shadow-[0_0_44px_rgba(218,238,255,0.14)]' : ''}`}>
        <div className="record-core">
          <Radio size={34} />
        </div>
      </div>

      <div
        aria-label="实时音乐频谱音浪"
        className={`live-waveform mt-4 grid h-20 grid-cols-12 items-end gap-1.5 rounded-2xl bg-black/26 px-3 py-3 transition-all duration-300 ${
          isPlaying ? 'is-playing shadow-[inset_0_-20px_50px_rgba(218,238,255,0.09)]' : ''
        }`}
        data-live-waveform="true"
      >
        {bars.map((height, index) => (
          <span
            className="wave-bar"
            key={`${previewMode}-${index}`}
            style={{ height: `${height}%`, transitionDelay: `${index * 12}ms` }}
          />
        ))}
      </div>

      <div className="mt-3 h-2 rounded-full bg-white/12">
        <div className="h-full rounded-full bg-cyan-200 transition-[width] duration-300" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-xs text-white/46">
        <span>{formatTime(currentTime)}</span>
        <span>-{formatTime(Math.max(duration - currentTime, 0) || 30)}</span>
      </div>

      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] gap-2">
        <button
          aria-pressed={previewMode === 'before'}
          className={`preview-button ${previewMode === 'before' ? 'is-active' : ''}`}
          type="button"
          onClick={() => onPreviewModeChange('before')}
        >
          原音
        </button>
        <button
          className="play-button group"
          type="button"
          aria-label={isPlaying ? '暂停演示' : '播放演示'}
          onClick={activatePlayer}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              activatePlayer()
            }
          }}
          onPointerDown={activatePlayer}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          <span className="play-button-text">{isPlaying ? '暂停' : '播放'}</span>
        </button>
        <button
          aria-pressed={previewMode === 'after'}
          className={`preview-button relative ${previewMode === 'after' ? 'is-active accent shadow-[0_0_24px_rgba(218,238,255,0.16)]' : ''}`}
          type="button"
          onClick={() => onPreviewModeChange('after')}
        >
          增强后
        </button>
      </div>

      <p className="enhance-chain mt-3">真实 A/B 增强链路</p>

      <button className="export-button mt-3" type="button" aria-label="导出增强后的音频" onClick={onExportRequest}>
        <Download size={16} />
        <span>加入导出队列</span>
      </button>
      <p className="mt-2 min-h-5 text-center text-xs text-cyan-100/64" aria-live="polite">
        {audioError || exportStatus || '本地演示，不会上传文件'}
      </p>
    </aside>
  )
}

function ParameterPanel({
  className = '',
  profile,
  rows,
}: {
  className?: string
  profile: EnhancementProfile
  rows: ReturnType<typeof getParameterRows>
}) {
  return (
    <section className={`parameter-panel ${className}`} aria-label="真实增强参数">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="parameter-kicker">DSP parameters</p>
          <h3 className="mt-1 text-sm font-medium text-white">真实增强参数</h3>
        </div>
        <span className="parameter-badge">live</span>
      </div>

      <div className="parameter-grid mt-3">
        <article className="parameter-stack">
          <div className="flex items-center justify-between gap-2">
            <p className="parameter-title">原音基线</p>
            <span className="parameter-value">Before</span>
          </div>
          <div className="parameter-rows mt-2">
            {rows.before.map((row) => (
              <p className="parameter-row" key={row}>
                {row}
              </p>
            ))}
          </div>
        </article>

        <article className="parameter-stack is-after">
          <div className="flex items-center justify-between gap-2">
            <p className="parameter-title">增强后链路</p>
            <span className="parameter-value">After</span>
          </div>
          <p className="mt-1 text-xs text-cyan-100/80">{profile.dspName}</p>
          <p className="mt-1 text-xs leading-5 text-white/54">{profile.listeningIntent}</p>
          <div className="parameter-rows mt-2">
            {rows.after.map((row) => (
              <p className="parameter-row" key={row}>
                {row}
              </p>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}

function SpecRail() {
  return (
    <section id="specs" className="border-y border-white/10 bg-[#07080d] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-center gap-2">
        {specs.map((spec) => (
          <span className="spec-pill" key={spec}>
            {spec}
          </span>
        ))}
      </div>
    </section>
  )
}

function PipelineSection() {
  return (
    <section id="pipeline" className="relative bg-[#050507] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <div className="glass-chip mb-5 inline-flex items-center gap-2">
              <Waves size={15} />
              <span>module foundation</span>
            </div>
            <h2 className="text-4xl font-medium leading-tight md:text-5xl">后续音频管线，先把入口打稳。</h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-white/62">
            首版不处理真实音频，不抓取平台内容，不做账号和支付。页面只建立可扩展的信息架构、
            本地交互和未来模块的落点。
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {pipeline.map((step) => {
            const Icon = step.icon
            return (
              <article className="module-card" key={step.title}>
                <div className="flex items-start justify-between gap-4">
                  <span className="module-icon">
                    <Icon size={22} />
                  </span>
                  <span className="module-stage">{step.stage}</span>
                </div>
                <h3 className="mt-5 text-xl font-medium">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/58">{step.body}</p>
                <div className="module-signal mt-5">
                  <span>{step.signal}</span>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FoundationSection() {
  return (
    <section id="foundation" className="foundation-section px-4 py-20 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="glass-chip mb-5 inline-flex items-center gap-2">
              <ShieldCheck size={15} />
              <span>implementation plan</span>
            </div>
            <h2 className="text-4xl font-medium leading-tight md:text-5xl">从零创建，但给后续留接口。</h2>
            <p className="mt-5 text-base leading-8 text-white/62">
              设计系统、模块边界和素材管线都先写进项目文档。Figma 暂做 tokens 和组件命名准备；
              video-edit 的 RunComfy 调用后续在有源视频和凭据时接入。
            </p>
          </div>
          <div className="grid gap-3">
            {foundation.map((item) => {
              const Icon = item.icon
              return (
                <article className="foundation-card" key={item.title}>
                  <span className="foundation-icon">
                    <Icon size={20} />
                  </span>
                  <div>
                    <p className="foundation-signal">{item.signal}</p>
                    <h3 className="text-lg font-medium">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/58">{item.body}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function ResearchPlanSection() {
  return (
    <section id="research-plan" className="research-section px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-7 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <div className="glass-chip mb-5 inline-flex items-center gap-2">
              <Activity size={15} />
              <span>MVP-1 浏览器本地预览</span>
            </div>
            <h2 className="text-4xl font-medium leading-tight md:text-5xl">
              功能研发路线，先跑通本地增强。
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-white/62">
            真实音频增强先从本地文件、短片段预览和 WAV 导出开始。平台链接只做合规入口和元信息，
            生产级多格式转码、AI 降噪、源分离和云端队列放到后续阶段。
          </p>
        </div>

        <div className="mt-10 grid gap-3 lg:grid-cols-4">
          {researchPhases.map((phase, index) => (
            <article className="research-card" key={phase.title}>
              <span className="research-index">{String(index + 1).padStart(2, '0')}</span>
              <p className="research-signal">{phase.signal}</p>
              <h3 className="mt-3 text-lg font-medium">{phase.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/58">{phase.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[0.8fr_1.2fr]">
          <article className="research-panel">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="research-signal">module boundary</p>
                <h3 className="mt-2 text-xl font-medium">MVP 模块边界</h3>
              </div>
              <span className="foundation-icon">
                <Layers3 size={20} />
              </span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {mvpModules.map((module) => (
                <span className="module-token" key={module}>
                  {module}
                </span>
              ))}
            </div>
          </article>

          <article className="research-panel">
            <div className="flex items-start gap-3">
              <span className="foundation-icon">
                <ShieldCheck size={20} />
              </span>
              <div>
                <p className="research-signal">product guardrails</p>
                <h3 className="mt-2 text-xl font-medium">上线口径和合规边界</h3>
              </div>
            </div>
            <div className="mt-5 grid gap-2">
              {guardrails.map((item) => (
                <p className="guardrail-row" key={item}>
                  {item}
                </p>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-4 py-8 text-sm text-white/54 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1180px] flex-col justify-between gap-3 md:flex-row">
        <p>星野的mp3 · xingye-audio-glass</p>
        <p className="flex items-center gap-2">
          <ShieldCheck size={15} />
          Local-only prototype · no upload · no scraping
        </p>
      </div>
    </footer>
  )
}

export default App
