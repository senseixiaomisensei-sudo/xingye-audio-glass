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
  compressor: CompressorSettings
  inputTrimDb: number
  outputGainDb: number
  outputCeilingDbtp: number
  limiterDrive: number
  stereoWidthAmount: number
  waveformLift: number
}

export const enhancementProfiles: Record<EnhancementTierId, EnhancementProfile> = {
  clean: {
    id: 'clean',
    dspName: 'Clean Lift DSP',
    listeningIntent: '明显清洁模式：压低浑浊感，让人声和主旋律更靠前。',
    highPass: {
      frequencyHz: 26,
      q: 0.707,
    },
    lowShelf: {
      label: '低频架',
      type: 'lowshelf',
      frequencyHz: 104,
      gainDb: 4,
    },
    body: {
      label: '浑浊削减',
      type: 'peaking',
      frequencyHz: 360,
      gainDb: -3,
      q: 1.05,
    },
    presence: {
      label: '存在感',
      type: 'peaking',
      frequencyHz: 3000,
      gainDb: 3.4,
      q: 0.95,
    },
    air: {
      label: '空气感',
      type: 'highshelf',
      frequencyHz: 8200,
      gainDb: 6,
    },
    compressor: {
      thresholdDb: -26,
      kneeDb: 15,
      ratio: 3.3,
      attackSeconds: 0.004,
      releaseSeconds: 0.16,
    },
    inputTrimDb: -3.2,
    outputGainDb: 4.2,
    outputCeilingDbtp: -1,
    limiterDrive: 1.24,
    stereoWidthAmount: 1.12,
    waveformLift: 15,
  },
  studio: {
    id: 'studio',
    dspName: 'Studio Bloom DSP',
    listeningIntent: '强增强：低频更厚、主旋律更亮，整体响度明显前推。',
    highPass: {
      frequencyHz: 28,
      q: 0.707,
    },
    lowShelf: {
      label: '低频架',
      type: 'lowshelf',
      frequencyHz: 88,
      gainDb: 6,
    },
    body: {
      label: '低中频清理',
      type: 'peaking',
      frequencyHz: 410,
      gainDb: -3.4,
      q: 1.1,
    },
    presence: {
      label: '存在感',
      type: 'peaking',
      frequencyHz: 2500,
      gainDb: 5,
      q: 0.86,
    },
    air: {
      label: '空气感',
      type: 'highshelf',
      frequencyHz: 8800,
      gainDb: 9,
    },
    compressor: {
      thresholdDb: -30,
      kneeDb: 14,
      ratio: 4.2,
      attackSeconds: 0.003,
      releaseSeconds: 0.14,
    },
    inputTrimDb: -4.2,
    outputGainDb: 5.6,
    outputCeilingDbtp: -1,
    limiterDrive: 1.42,
    stereoWidthAmount: 1.22,
    waveformLift: 22,
  },
  master: {
    id: 'master',
    dspName: 'Master Air DSP',
    listeningIntent: '重母带听感：低频冲击、瞬态边缘和高频空气感都更强。',
    highPass: {
      frequencyHz: 30,
      q: 0.707,
    },
    lowShelf: {
      label: '低频架',
      type: 'lowshelf',
      frequencyHz: 76,
      gainDb: 7,
    },
    body: {
      label: '箱体削减',
      type: 'peaking',
      frequencyHz: 500,
      gainDb: -4,
      q: 1.15,
    },
    presence: {
      label: '瞬态密度',
      type: 'peaking',
      frequencyHz: 1900,
      gainDb: 5.8,
      q: 0.8,
    },
    air: {
      label: '空气感',
      type: 'highshelf',
      frequencyHz: 9800,
      gainDb: 10.4,
    },
    compressor: {
      thresholdDb: -33,
      kneeDb: 12,
      ratio: 5.1,
      attackSeconds: 0.0025,
      releaseSeconds: 0.12,
    },
    inputTrimDb: -4.8,
    outputGainDb: 6.8,
    outputCeilingDbtp: -1,
    limiterDrive: 1.55,
    stereoWidthAmount: 1.26,
    waveformLift: 26,
  },
  hires: {
    id: 'hires',
    dspName: 'Hi-Res Vault DSP',
    listeningIntent: '最强展示档：最大化解析感、冲击力、声场张力和响度前推。',
    highPass: {
      frequencyHz: 30,
      q: 0.707,
    },
    lowShelf: {
      label: '低频架',
      type: 'lowshelf',
      frequencyHz: 72,
      gainDb: 7.4,
    },
    body: {
      label: '低中频清理',
      type: 'peaking',
      frequencyHz: 460,
      gainDb: -4.2,
      q: 1.08,
    },
    presence: {
      label: '轮廓增强',
      type: 'peaking',
      frequencyHz: 2400,
      gainDb: 6.2,
      q: 0.82,
    },
    air: {
      label: '空气感',
      type: 'highshelf',
      frequencyHz: 11200,
      gainDb: 12,
    },
    compressor: {
      thresholdDb: -34,
      kneeDb: 13,
      ratio: 5.4,
      attackSeconds: 0.0025,
      releaseSeconds: 0.16,
    },
    inputTrimDb: -5.2,
    outputGainDb: 7.2,
    outputCeilingDbtp: -1,
    limiterDrive: 1.65,
    stereoWidthAmount: 1.3,
    waveformLift: 30,
  },
}

export function getEnhancementProfile(tierId: EnhancementTierId) {
  return enhancementProfiles[tierId] ?? enhancementProfiles.hires
}

export function getParameterRows(tierId: EnhancementTierId) {
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
      `压缩 ${profile.compressor.thresholdDb} dB / ${formatNumber(profile.compressor.ratio)}:1`,
      `Knee ${profile.compressor.kneeDb} dB / Attack ${formatMs(profile.compressor.attackSeconds)}`,
      `Release ${formatMs(profile.compressor.releaseSeconds)}`,
      `输出 ${formatSignedDb(profile.outputGainDb)} / 峰值 ${formatNumber(profile.outputCeilingDbtp)} dBTP`,
      `软限幅 drive ${formatNumber(profile.limiterDrive)}x`,
      `声场宽度 ${Math.round(profile.stereoWidthAmount * 100)}%`,
    ],
  }
}

export function dbToGain(db: number) {
  return 10 ** (db / 20)
}

export function createSoftLimiterCurve(drive: number, ceilingGain = dbToGain(-1), sampleCount = 2048) {
  const curve = new Float32Array(sampleCount)
  const safeDrive = Math.max(0.01, drive)
  const safeCeiling = Math.min(1, Math.max(0.01, ceilingGain))
  const normalizer = Math.tanh(safeDrive)

  for (let index = 0; index < curve.length; index += 1) {
    const x = (index / (curve.length - 1)) * 2 - 1
    curve[index] = (Math.tanh(x * safeDrive) / normalizer) * safeCeiling
  }

  return curve
}

function formatFrequency(frequencyHz: number) {
  if (frequencyHz >= 1000) {
    return `${formatNumber(frequencyHz / 1000)} kHz`
  }

  return `${Math.round(frequencyHz)} Hz`
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
