import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('xingye audio glass homepage', () => {
  it('renders the from-zero A+B liquid glass homepage foundation', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: '星野的mp3' })).toBeInTheDocument()
    expect(screen.getByText('把任意音乐推到清澈高解析。')).toBeInTheDocument()
    expect(screen.getByText('Pulse console')).toBeInTheDocument()
    expect(screen.getByText('沉浸播放器')).toBeInTheDocument()
    expect(screen.getByText('支持 MP3 / FLAC / WAV / AAC / OGG / M4A / AIFF')).toBeInTheDocument()
    expect(screen.getAllByText('192kHz').length).toBeGreaterThan(0)
    expect(screen.getAllByText('320kbps').length).toBeGreaterThan(0)
    expect(screen.getAllByText('24-bit 位深').length).toBeGreaterThan(0)
    expect(screen.getByText('Figma-ready tokens')).toBeInTheDocument()
    expect(screen.getByText('RunComfy video asset route')).toBeInTheDocument()
  })

  it('publishes the audio enhancement research plan on the homepage', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: '功能研发路线，先跑通本地增强。' })).toBeInTheDocument()
    expect(screen.getByText('MVP-1 浏览器本地预览')).toBeInTheDocument()
    expect(screen.getByText('导入与解码')).toBeInTheDocument()
    expect(screen.getByText('MVP 模块边界')).toBeInTheDocument()
    expect(screen.getByText('禁止抓取平台受保护音频、绕过 DRM 或宣传低码率恢复真无损。')).toBeInTheDocument()
  })

  it('keeps upload and platform import modes local', async () => {
    const user = userEvent.setup()
    render(<App />)

    const fileInput = screen.getByLabelText('选择音频文件')
    await user.upload(fileInput, new File(['audio'], 'xingye-master.flac', { type: 'audio/flac' }))
    expect(screen.getByText('xingye-master.flac')).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: '平台链接' }))
    const urlInput = screen.getByPlaceholderText('粘贴音乐平台链接，后续接解析与授权')
    await user.type(urlInput, 'https://music.example/song/123')
    expect(urlInput).toHaveValue('https://music.example/song/123')
  })

  it('switches enhancement tiers and A/B player state', async () => {
    const user = userEvent.setup()
    render(<App />)

    const hiresButtons = screen.getAllByRole('button', { name: /Hi-Res Vault/i })
    await user.click(hiresButtons[0])
    expect(hiresButtons[0]).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getAllByText('高解析归档路径，保留 24-bit 位深和 192kHz 展示位。').length).toBeGreaterThan(0)

    const beforeButtons = screen.getAllByRole('button', { name: '原音' })
    await user.click(beforeButtons[0])
    expect(beforeButtons[0]).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getAllByRole('button', { name: '增强后' })[0]).toHaveAttribute('aria-pressed', 'false')

    await user.click(screen.getByRole('button', { name: '导出增强后的音频' }))
    expect(screen.getByText('Hi-Res Vault 已加入本地导出队列')).toBeInTheDocument()
  })
})
