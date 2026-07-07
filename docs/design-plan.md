# 星野的mp3 Audio Glass - Homepage Plan

Date: 2026-07-07

## Brief

从零创建一个本机网站主页，内容是音频和各大音乐平台音乐的音质增强能力展示。当前阶段只做主页设计基础和可扩展模块，不做真实处理。视觉方向由用户确认：A+B 结合，即“音频仪表玻璃 + 播放器沉浸”。

首版必须做到：

- 首屏有品牌、主张、上传音频入口、平台链接入口、增强档位和沉浸播放器。
- 明确展示 MP3、FLAC、WAV、AAC、OGG、M4A、AIFF、192kHz、320kbps、24-bit 位深。
- 预留 Import / Analyze / Enhance / Export 四段处理链路。
- 预留 Figma-ready tokens、RunComfy video-edit 素材路线和平台适配器。
- 所有交互只在本地状态完成，不上传、不抓取、不调用后端。

## Research Sources

These references are used for quality bar and product vocabulary only. Do not copy their layout, code, copy, imagery, brand assets, or distinctive visual expression.

| Reference | URL | Learn From | Do Not Copy |
|---|---|---|---|
| Apple Liquid Glass | https://developer.apple.com/documentation/technologyoverviews/liquid-glass | Dynamic glass material, optical depth, fluidity, content-aware surfaces. | Apple UI controls, platform chrome, icons, text, exact material behavior. |
| Apple Adopting Liquid Glass | https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass | Use glass sparingly on important controls; preserve readability. | Native API specifics that do not exist in web CSS. |
| Moises AI Mastering | https://moises.ai/features/ai-mastering/ | Simple mastering modes, approachable music workflow, export settings language. | Moises visual identity, screenshots, claims, artist assets. |
| LANDR Online Mastering | https://www.landr.com/online-audio-mastering | Drag/drop mastering flow, preview-before-download framing, MP3/WAV output vocabulary. | LANDR page structure, pricing, brand claims, imagery. |
| Auphonic Features | https://auphonic.com/features | Audio post-production pipeline ideas: leveling, loudness, noise/reverb modules. | Auphonic app layout, copy, icons, product naming. |

## Design Direction

The homepage opens as an audio control surface, not a generic landing page. The first viewport combines:

- A dark immersive media field with real local video/poster assets.
- A large brand statement: `星野的mp3` and `把任意音乐推到清澈高解析。`
- A glass import console with upload/platform tabs and enhancement tiers.
- A compact player with record disc, wave bars, A/B mode, play/pause, and progress.
- Capability metrics for 192kHz, 320kbps, and 24-bit.

The glass system uses blur, saturation, translucent fills, thin highlights, and controlled shadows. Following Apple’s guidance, glass is concentrated on functional surfaces: header CTA, import console, player, metrics, spec pills, and module cards. It avoids turning every section into glass, so readability stays stable.

## Module Order

1. Hero: brand, value proposition, capability metrics, import console, immersive player.
2. Spec rail: supported formats and headline output specs.
3. Pipeline: Import, Analyze, Enhance, Export future modules.
4. Foundation: Figma-ready tokens, RunComfy video asset route, platform adapters.
5. Footer: local-only prototype boundary.

## Design System Tokens

Current code tokens in `src/index.css`:

```text
--bg: #050507
--ink: #f7fbff
--muted: rgba(247, 251, 255, 0.64)
--cyan: #8ff7ff
--blue: #4e8dff
--pink: #ff75c8
--glass: rgba(255, 255, 255, 0.095)
--glass-strong: rgba(255, 255, 255, 0.16)
--stroke: rgba(255, 255, 255, 0.22)
--shadow: 0 28px 80px rgba(0, 0, 0, 0.48)
```

Figma variable naming target:

```text
color/bg/canvas
color/bg/glass
color/text/primary
color/text/secondary
color/border/glass
color/accent/cyan
color/accent/blue
color/accent/pink
spacing/xs|sm|md|lg|xl|2xl
radius/sm|md|lg|xl|full
effect/glass/panel
effect/glow/accent
```

Figma component naming target:

```text
Button
GlassPanel
MediaShowcase
AudioDropzone
WaveformPreview
BeforeAfterMeter
MetricCard
EnhancementModeTabs
SpecPill
SectionHeader
```

## video-edit / RunComfy Boundary

The user noted that `C:\Users\Administrator\.agents\skills\video-edit\SKILL.md` is open source and can be copied/called directly. For this homepage, video-edit is not part of audio enhancement and must not block the first release.

Allowed first-release use:

- Document a `RunComfy video asset route`.
- Reuse the skill’s intent routing later for hero background video restyle, product demo short clips, before/after promo videos, or social video assets.
- Keep current page working without RunComfy CLI, `RUNCOMFY_TOKEN`, login, source video URL, or network access.

Future route sketch:

```powershell
runcomfy run wan-ai/wan-2-7/edit-video `
  --input '{
    "prompt": "Preserve the original camera motion and audio-device rhythm; restyle the background as a premium liquid-glass audio interface with cyan and pink spectral light.",
    "video": "https://example.com/source.mp4",
    "audio_setting": "origin",
    "resolution": "1080p"
  }' `
  --output-dir "D:\\数据\\xingye-audio-glass\\public\\generated-video"
```

Do not expose RunComfy tokens in browser code. RunComfy belongs in local tooling, backend jobs, or offline asset generation.

## Parallel Agents

The work was split into independent sidecar goals while the main thread implemented the page:

| Agent | Dedicated lgoal | Result Integrated |
|---|---|---|
| Gauss / Design Research | Produce A+B design research summary, reference learning points, and module order. | Main thread covered the design plan locally and requested a retry after first invalid response. |
| Bacon / Integration Boundary | Define video-edit reuse boundary and Figma-ready tokens/component naming. | Integrated into `video-edit / RunComfy Boundary` and `Design System Tokens`. |
| Popper / Verification | Define unit, build, preview, responsive QA, and completion audit standards. | Integrated into `Verification Standard`. |

## Verification Standard

Required commands:

```powershell
npm run test
npm run lint
npm run build
npm run preview -- --port 4173
```

Unit tests must verify:

- Brand, headline, `Pulse console`, `沉浸播放器`.
- Supported formats and high-resolution specs.
- Figma-ready and RunComfy route modules.
- File selection displays local file name.
- Platform tab accepts and retains local URL.
- Hi-Res tier selected state.
- A/B player state switches between `原音` and `增强后`.

Rendered QA must verify:

- Desktop viewport around 1440x900.
- Mobile viewport around 390x844.
- No blank page, framework overlay, or relevant console errors.
- Main controls are readable and clickable.
- Glass styling is visible but not harming contrast.
- No horizontal mobile overflow or overlapping text.
- `public/motion-sites/audio-showcase.mp4` and `.webp` load without blocking text.

