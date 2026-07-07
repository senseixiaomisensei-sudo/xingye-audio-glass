# 星野的mp3 Audio Glass

从零创建的本机音频音质增强主页基础版。当前只实现前端页面、本地交互和模块落点，不包含真实音频增强、平台抓取、上传服务、登录、支付或后端任务队列。

## 当前能力

- A+B 视觉方向：音频仪表玻璃 + 沉浸播放器。
- iOS 26 同类液态玻璃视觉：半透明面板、背景模糊、高光描边、层次阴影、动态波形。
- 本地音频导入状态：选择文件后只显示文件名，不上传。
- 平台链接状态：可切换到平台链接模式并保留输入值，不解析、不抓取。
- Clean Lift / Studio Bloom / Master Air / Hi-Res Vault 四档增强 UI 模型。
- 显示 MP3 / FLAC / WAV / AAC / OGG / M4A / AIFF、192kHz、320kbps、24-bit 位深。
- 预留 Figma-ready tokens、RunComfy video-edit 素材路线和平台适配器模块。

## Commands

```powershell
npm install
npm run dev
npm run test
npm run lint
npm run build
npm run preview -- --port 4173
```

本机预览默认使用：

```text
http://127.0.0.1:4173
```

## Project Notes

- 主要页面实现：`src/App.tsx`
- 视觉系统：`src/index.css`
- 验收测试：`src/App.test.tsx`
- 设计与实现计划：`docs/design-plan.md`
- 本地媒体：`public/motion-sites/audio-showcase.mp4` 和 `.webp`

