export type EnhancementTierId = 'clean' | 'studio' | 'master' | 'hires'

export type EqBand = {
  label: string
  type: BiquadFilterType
  frequencyHz: number
  gainDb: number
  q?: number
}

export type HighPassSettings = {
  frequencyHz: number
  q: number
}

export type CompressorSettings = {
  thresholdDb: number
  kneeDb: number
  ratio: number
  attackSeconds: number
  releaseSeconds: number
}

export type EnhancementProfile = {
  id: EnhancementTierId
  dspName: string
  listeningIntent: string
  highPass: HighPassSettings
  lowShelf: EqBand
  body: EqBand
  presence: EqBand
  air: EqBand
  eqBands: EqBand[]
  compressor: CompressorSettings
  inputTrimDb: number
  outputGainDb: number
  outputCeilingDbtp: number
  waveformLift: number
  wetGain: number
  makeupGain: {
    linear: number
  }
  peakProtection: {
    truePeakCeilingDbtp: number
    mode: string
  }
  stereoWidthPercent: number
  loudnessTargetLufs: number
  exportTarget: {
    sampleRateHz: number
    mp3BitrateKbps: number
    pcmBitDepth: number
  }
  notes: string[]
}

type ProfileInput = Omit<EnhancementProfile, 'eqBands' | 'makeupGain'>

const exportTarget = {
  sampleRateHz: 192000,
  mp3BitrateKbps: 320,
  pcmBitDepth: 24,
}

const baseNotes = [
  '透明试听增强，保持原声场、原声道和干净峰值保护。',
  '192kHz / 320kbps / 24-bit 是最高导出规格，不代表恢复源文件中不存在的信息。',
]

export const enhancementProfiles = [
  createProfile({
    id: 'clean',
    dspName: 'Clean Lift Hi-Fi DSP',
    listeningIntent: '保守清洁：只做低频下潜保护、轻微浑浊控制和透明峰值保护。',
    highPass: {
      frequencyHz: 18,
      q: 0.707,
    },
    lowShelf: {
      label: '低频架',
      type: 'lowshelf',
      frequencyHz: 90,
      gainDb: 0.3,
    },
    body: {
      label: '低中频清理',
      type: 'peaking',
      frequencyHz: 280,
      gainDb: -0.6,
      q: 0.9,
    },
    presence: {
      label: '存在感',
      type: 'peaking',
      frequencyHz: 3000,
      gainDb: 0.5,
      q: 0.8,
    },
    air: {
      label: '空气感',
      type: 'highshelf',
      frequencyHz: 12000,
      gainDb: 0.6,
    },
    compressor: {
      thresholdDb: -17,
      kneeDb: 18,
      ratio: 1.15,
      attackSeconds: 0.018,
      releaseSeconds: 0.18,
    },
    inputTrimDb: -1.6,
    outputGainDb: 0.3,
    outputCeilingDbtp: -1.5,
    waveformLift: 8,
    wetGain: 1,
    peakProtection: {
      truePeakCeilingDbtp: -1.5,
      mode: '透明峰值保护',
    },
    stereoWidthPercent: 100,
    loudnessTargetLufs: -15,
    exportTarget,
    notes: baseNotes,
  }),
  createProfile({
    id: 'studio',
    dspName: 'Studio Bloom Hi-Fi DSP',
    listeningIntent: '默认清晰：轻微清理低中频，稳定响度，保持原声场。',
    highPass: {
      frequencyHz: 20,
      q: 0.707,
    },
    lowShelf: {
      label: '低频架',
      type: 'lowshelf',
      frequencyHz: 82,
      gainDb: 0.4,
    },
    body: {
      label: '低中频清理',
      type: 'peaking',
      frequencyHz: 320,
      gainDb: -0.8,
      q: 0.95,
    },
    presence: {
      label: '存在感',
      type: 'peaking',
      frequencyHz: 2800,
      gainDb: 0.8,
      q: 0.78,
    },
    air: {
      label: '空气感',
      type: 'highshelf',
      frequencyHz: 11800,
      gainDb: 0.9,
    },
    compressor: {
      thresholdDb: -19,
      kneeDb: 18,
      ratio: 1.25,
      attackSeconds: 0.014,
      releaseSeconds: 0.2,
    },
    inputTrimDb: -1.8,
    outputGainDb: 0.4,
    outputCeilingDbtp: -1.5,
    waveformLift: 10,
    wetGain: 1,
    peakProtection: {
      truePeakCeilingDbtp: -1.5,
      mode: '透明峰值保护',
    },
    stereoWidthPercent: 100,
    loudnessTargetLufs: -14,
    exportTarget,
    notes: baseNotes,
  }),
  createProfile({
    id: 'master',
    dspName: 'Master Air Hi-Fi DSP',
    listeningIntent: '高规格预览：只提高稳定度和轮廓，保持原声场和干净瞬态。',
    highPass: {
      frequencyHz: 22,
      q: 0.707,
    },
    lowShelf: {
      label: '低频架',
      type: 'lowshelf',
      frequencyHz: 85,
      gainDb: 0.7,
    },
    body: {
      label: '低中频清理',
      type: 'peaking',
      frequencyHz: 340,
      gainDb: -1,
      q: 0.95,
    },
    presence: {
      label: '存在感',
      type: 'peaking',
      frequencyHz: 3200,
      gainDb: 1.1,
      q: 0.76,
    },
    air: {
      label: '空气感',
      type: 'highshelf',
      frequencyHz: 11200,
      gainDb: 1,
    },
    compressor: {
      thresholdDb: -20.5,
      kneeDb: 16,
      ratio: 1.3,
      attackSeconds: 0.012,
      releaseSeconds: 0.22,
    },
    inputTrimDb: -2,
    outputGainDb: 0.6,
    outputCeilingDbtp: -1.5,
    waveformLift: 12,
    wetGain: 1,
    peakProtection: {
      truePeakCeilingDbtp: -1.5,
      mode: '透明峰值保护',
    },
    stereoWidthPercent: 100,
    loudnessTargetLufs: -14,
    exportTarget,
    notes: baseNotes,
  }),
  createProfile({
    id: 'hires',
    dspName: 'Hi-Res Vault Hi-Fi DSP',
    listeningIntent: '最高规格导出预设：预览只做透明修正，参数目标拉到 192kHz / 320kbps / 24-bit。',
    highPass: {
      frequencyHz: 24,
      q: 0.707,
    },
    lowShelf: {
      label: '低频架',
      type: 'lowshelf',
      frequencyHz: 80,
      gainDb: 0.5,
    },
    body: {
      label: '低中频清理',
      type: 'peaking',
      frequencyHz: 360,
      gainDb: -1.1,
      q: 0.95,
    },
    presence: {
      label: '轮廓增强',
      type: 'peaking',
      frequencyHz: 2600,
      gainDb: 1,
      q: 0.78,
    },
    air: {
      label: '空气感',
      type: 'highshelf',
      frequencyHz: 12000,
      gainDb: 1.2,
    },
    compressor: {
      thresholdDb: -18,
      kneeDb: 18,
      ratio: 1.2,
      attackSeconds: 0.015,
      releaseSeconds: 0.24,
    },
    inputTrimDb: -2,
    outputGainDb: 0.5,
    outputCeilingDbtp: -1.5,
    waveformLift: 12,
    wetGain: 1,
    peakProtection: {
      truePeakCeilingDbtp: -1.5,
      mode: '透明峰值保护',
    },
    stereoWidthPercent: 100,
    loudnessTargetLufs: -14,
    exportTarget,
    notes: baseNotes,
  }),
]

export function getEnhancementProfile(tierId: string) {
  return enhancementProfiles.find((profile) => profile.id === tierId) ?? enhancementProfiles[1]
}

export function getParameterRows(tierId: string) {
  const profile = getEnhancementProfile(tierId)

  return {
    before: ['旁路直通 0 dB', '无 EQ / 无压缩', '原始声场 100%', '原始峰值不改写'],
    after: [
      `${profile.lowShelf.label} ${formatSignedDb(profile.lowShelf.gainDb)} @ ${formatFrequency(profile.lowShelf.frequencyHz)}`,
      `${profile.body.label} ${formatSignedDb(profile.body.gainDb)} @ ${formatFrequency(profile.body.frequencyHz)}`,
      `${profile.presence.label} ${formatSignedDb(profile.presence.gainDb)} @ ${formatFrequency(profile.presence.frequencyHz)}`,
      `${profile.air.label} ${formatSignedDb(profile.air.gainDb)} @ ${formatFrequency(profile.air.frequencyHz)}`,
      `高通 ${formatFrequency(profile.highPass.frequencyHz)} / Q ${formatNumber(profile.highPass.q)}`,
      `输入 ${formatSignedDb(profile.inputTrimDb)}`,
      `压缩 ${formatSignedDb(profile.compressor.thresholdDb)} / ${formatNumber(profile.compressor.ratio)}:1`,
      `Knee ${formatSignedDb(profile.compressor.kneeDb)} / Attack ${formatMs(profile.compressor.attackSeconds)}`,
      `Release ${formatMs(profile.compressor.releaseSeconds)}`,
      `输出 ${formatSignedDb(profile.outputGainDb)} / 峰值保护 ${formatSignedDb(profile.outputCeilingDbtp).replace(' dB', ' dBFS')}`,
      `${profile.peakProtection.mode}，无削波`,
      `声场宽度 ${profile.stereoWidthPercent}%`,
      `响度目标 ${profile.loudnessTargetLufs} LUFS`,
      `wet mix ${Math.round(profile.wetGain * 100)}%`,
      '实时预览 Web Audio 32-bit float',
      `导出目标 ${formatExportSampleRate(profile.exportTarget.sampleRateHz)} / ${profile.exportTarget.mp3BitrateKbps} kbps / ${profile.exportTarget.pcmBitDepth}-bit`,
    ],
  }
}

export function dbToGain(db: number) {
  return 10 ** (db / 20)
}

function createProfile(input: ProfileInput): EnhancementProfile {
  const eqBands = [input.lowShelf, input.body, input.presence, input.air]

  return {
    ...input,
    eqBands,
    makeupGain: {
      linear: dbToGain(input.outputGainDb),
    },
  }
}

function formatFrequency(frequencyHz: number) {
  if (frequencyHz >= 1000) {
    return `${formatNumber(frequencyHz / 1000)} kHz`
  }

  return `${Math.round(frequencyHz)} Hz`
}

function formatExportSampleRate(frequencyHz: number) {
  return `${Math.round(frequencyHz / 1000)} kHz`
}

function formatMs(seconds: number) {
  return `${formatNumber(seconds * 1000)} ms`
}

function formatSignedDb(db: number) {
  return `${db > 0 ? '+' : ''}${formatNumber(db)} dB`
}

function formatNumber(value: number) {
  return (Math.round(value * 10) / 10).toFixed(1)
}
