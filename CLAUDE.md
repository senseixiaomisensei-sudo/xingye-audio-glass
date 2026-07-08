# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**星野的mp3 Audio Glass** 是一个托管在 GitHub Pages 的音频增强展示主页，采用 local-first 架构。当前版本只实现前端页面、本地交互和模块落点，不包含真实音频增强、平台抓取、上传服务或后端任务队列。

- **在线地址**: https://senseixiaomisensei-sudo.github.io/xingye-audio-glass/
- **GitHub**: github.com/senseixiaomisensei-sudo/xingye-audio-glass
- **技术栈**: React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 4
- **部署**: GitHub Actions 自动部署到 GitHub Pages

## 常用命令

```powershell
# 安装依赖
npm install

# 开发服务器（默认 http://127.0.0.1:5173）
npm run dev

# 运行测试
npm test

# 代码检查
npm run lint

# 构建生产版本
npm run build

# 本地预览构建结果（默认 http://127.0.0.1:4173）
npm run preview
npm run preview -- --port 4173  # 指定端口
```

## 架构设计

### 核心文件结构

```
src/
├── App.tsx                 # 主应用组件，包含所有页面模块
├── audioEnhancement.ts     # 音频增强参数配置和 DSP 配置文件
├── index.css              # 全局样式、玻璃材质系统、CSS tokens
├── main.tsx               # React 应用入口
└── test/
    └── setup.ts           # Vitest 测试配置

public/
└── motion-sites/
    ├── audio-showcase.mp4   # Hero 背景视频
    └── audio-showcase.webp  # Hero 海报图

docs/
└── design-plan.md         # 设计计划、视觉方向、模块架构文档
```

### 应用架构

**单页面组件化结构**：所有内容都在 `src/App.tsx` 中实现，采用功能组件拆分：

1. **Hero 区域**：品牌展示、导入控制台、沉浸播放器
   - `ImportConsole`: 文件上传/平台链接切换 + 增强档位选择
   - `PlayerPanel`: A/B 对比播放器 + 实时波形 + Web Audio 增强链路
   - `ParameterPanel`: 显示当前档位的真实 DSP 参数

2. **功能模块展示**：
   - `SpecRail`: 支持格式展示（MP3/FLAC/WAV/AAC/OGG/M4A/AIFF, 192kHz, 320kbps, 24-bit）
   - `PipelineSection`: Import → Analyze → Enhance → Export 四段处理链路
   - `FoundationSection`: Figma tokens、RunComfy video route、平台适配器
   - `ResearchPlanSection`: MVP 研发计划、模块边界、合规边界

### 音频增强系统

**档位配置** (`audioEnhancement.ts`):
- `clean`: Clean Lift - 去噪/齿音/响度整理
- `studio`: Studio Bloom - 动态/清晰/稳定响度（默认）
- `master`: Master Air - 频谱/宽度/母带平衡
- `hires`: Hi-Res Vault - 192kHz/24-bit/高解析导出

**DSP 链路** (Web Audio API):
```
audioElement → inputTrim → highPass → lowShelf → body → presence → air 
→ compressor → makeupGain → peakGuard → analyser → destination
```

**A/B 对比实现**:
- 原音路径: `source → dryGain → analyser → destination`
- 增强路径: `source → [DSP chain] → wetGain → analyser → destination`
- 通过动态调整 `dryGain` 和 `wetGain` 实现无缝切换

### 视觉系统

**玻璃材质模式** (可切换):
- **液态玻璃** (Liquid Glass): iOS 26 风格，SVG 滤镜折射效果
- **毛玻璃** (Frosted Glass): 简化版，纹理噪声叠加

**CSS Tokens** (`src/index.css`):
```css
--glass-fill: rgba(255, 255, 255, 0.105)      /* 玻璃填充 */
--glass-edge: rgba(255, 255, 255, 0.34)       /* 玻璃边缘 */
--blur-panel: 30px                            /* 面板模糊 */
--radius-panel: 1.75rem                       /* 面板圆角 */
--shadow-float: 0 30px 90px rgba(0,0,0,0.42) /* 浮动阴影 */
--motion-fluid: cubic-bezier(0.16,1,0.3,1)    /* 流体动画 */
```

### 状态管理

使用 React Hooks 本地状态管理（无全局状态库）：

- `sourceMode`: 'upload' | 'platform' - 导入模式
- `previewMode`: 'before' | 'after' - A/B 对比模式
- `glassMode`: 'liquid' | 'frosted' - 玻璃材质模式
- `selectedTier`: 增强档位 ID
- `uploadedSource`: 上传的音频文件信息
- `isPlaying`: 播放状态

## 开发约定

### 代码风格

1. **Ponytail 模式已激活**：优先使用标准库和已安装依赖，避免引入新依赖
2. **TypeScript 严格模式**：所有类型都明确定义，避免 `any`
3. **组件拆分原则**：功能内聚，单一职责，Props 类型明确
4. **CSS 优先级**：Tailwind utility classes + CSS variables，避免内联 style（除非动态值）

### 文件操作规则

- 修改 `src/App.tsx` 前必须先 Read，因为文件较大（>1400 行）
- 使用 `Edit` 工具进行局部修改，避免全文件 `Write`
- 新增功能组件时，保持在 `App.tsx` 内部定义（除非复用性极高）

### 测试规范

测试文件 `src/App.test.tsx` 必须验证：
- 关键文本内容（品牌、标题、控制台标签）
- 支持格式和规格展示
- 交互状态（文件选择、档位切换、A/B 切换）
- 模块存在性（Figma、RunComfy 相关内容）

运行测试：
```powershell
npm test           # 单次运行
npm test -- --watch # 监听模式
```

### 构建和部署

**本地验证流程**：
```powershell
npm run test       # 1. 运行测试
npm run lint       # 2. 代码检查
npm run build      # 3. 构建
npm run preview    # 4. 预览构建结果
```

**自动部署**：
- 推送到 `main` 分支触发 GitHub Actions
- 自动运行 test → lint → build → deploy
- 部署到 GitHub Pages: `https://senseixiaomisensei-sudo.github.io/xingye-audio-glass/`

**构建配置** (`vite.config.ts`):
- `base: './'` - 支持相对路径，适配 GitHub Pages 子路径部署
- `test.environment: 'jsdom'` - 使用 jsdom 模拟浏览器环境

## 功能边界

### 当前已实现

✅ 本地音频文件选择（不上传，只显示文件名）  
✅ 平台链接输入（不解析，不抓取）  
✅ 四档增强档位 UI 和状态  
✅ A/B 对比播放（Web Audio 实时增强）  
✅ 真实 DSP 参数显示（EQ/Compressor/Limiter）  
✅ 实时波形可视化（AnalyserNode）  
✅ 液态玻璃/毛玻璃材质切换  
✅ 响应式布局（移动端/桌面端）

### 待实现功能

⏳ **MVP-1 本地音频增强**（下一阶段）：
- 完整音频解码（File API + AudioContext）
- 15-30 秒预览片段截取
- 峰值/RMS/响度分析
- WAV 格式导出（增强后片段）

🚫 **暂不实现**：
- 真实文件上传到服务器
- 平台链接解析和授权抓取（网易云/QQ 音乐/Apple Music/Spotify）
- 多格式导出（MP3/FLAC/AAC，需 FFmpeg 或后端队列）
- 账号系统、支付、云端任务队列
- AI 降噪、源分离、高级 DSP

## 扩展接口

### Figma-ready Tokens

设计系统已预留 Figma 变量命名约定（见 `docs/design-plan.md`）：
```
color/bg/canvas, color/text/primary, spacing/xs|sm|md|lg
radius/sm|md|lg|full, effect/glass/panel, effect/glow/accent
```

组件命名目标：
```
Button, GlassPanel, AudioDropzone, WaveformPreview, 
BeforeAfterMeter, MetricCard, SpecPill
```

### RunComfy Video Asset Route

预留视频素材生成路线（不阻塞首版发布）：
- 可用 video-edit skill 调用 RunComfy API
- 用于 Hero 背景重绘、产品演示短片、社交媒体素材
- 凭据和网络调用不进入浏览器代码

### Platform Adapters

预留平台适配器模块（仅占位）：
- 网易云音乐、QQ 音乐、Apple Music、Spotify
- 当前只做 URL 输入框，不做抓取和 DRM 绕过

## 合规边界

🚨 **严格遵守**：
1. 禁止抓取平台受保护音频、绕过 DRM
2. 禁止宣传"低码率恢复真无损"等误导性表述
3. 192kHz/24-bit 只能作为导出规格，不承诺恢复原始母带信息
4. 所有增强都在本地浏览器完成，不上传用户文件

## 故障排查

### 常见问题

**播放器无法启动**：
- 检查浏览器是否支持 Web Audio API
- 确认音频文件格式正确（MP3/M4A/WAV/FLAC）
- 查看控制台是否有 CORS 错误（演示音频需支持跨域）

**构建失败**：
- 运行 `npm run lint` 检查代码问题
- 确认 TypeScript 类型无误（`npm run build` 会执行 `tsc -b`）
- 检查 `public/motion-sites/` 目录下视频和图片是否存在

**测试失败**：
- 查看 `src/App.test.tsx` 中的断言
- 确认关键文本内容未被修改
- 运行 `npm test -- --reporter=verbose` 查看详细输出

### 调试技巧

```powershell
# 查看构建产物
npm run build && Get-ChildItem dist -Recurse

# 测试覆盖率
npm test -- --coverage

# 监听模式开发
npm run dev & npm test -- --watch
```

## 项目文档

- `README.md`: 快速开始、命令参考、项目说明
- `docs/design-plan.md`: 设计方向、模块架构、视觉系统、验收标准
- `src/audioEnhancement.ts`: DSP 参数配置详细注释

## GitHub 凭据

- **GitHub 主页**: github.com/senseixiaomisensei-sudo
- **访问令牌**: sk-ozGEL70sOEt5lbZqiOwoCWOVkHsXBPomaaFEPFG8X3ZQG8jR
  （注意：此令牌不应硬编码到代码中，仅用于本地 git 操作或 CI/CD 配置）
