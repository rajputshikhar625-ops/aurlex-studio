export type PipelineStage = 
  | 'research'
  | 'story'
  | 'characters'
  | 'scenes'
  | 'animation'
  | 'audio'
  | 'editing'
  | 'verification';

export type VideoFormat = '16:9' | '9:16' | '1:1';

export interface ProjectData {
  id: string;
  title: string;
  series: string;
  episodeNumber: number;
  durationTargetSec: number;
  format: VideoFormat;
  style: string;
  language: string;
  progress: Record<PipelineStage, { status: 'complete' | 'in_progress' | 'pending'; percent: number }>;
}

export interface CharacterItem {
  id: string; // e.g. CHAR_001
  name: string;
  role: string;
  age: number;
  style: string;
  hair: string;
  clothes: string;
  personality: string;
  allowedActions: string[];
  imagePath: string;
  consistencyScore: number;
  notes: string;
}

export interface MotionKeyframe {
  timestampSec: number;
  label: string;
  poseDescription: string;
  deltaEnergy: number; // For temporal motion analysis
}

export interface SceneItem {
  id: string;
  sceneNumber: number;
  title: string;
  durationSec: number;
  characterId: string;
  dialogue: string;
  action: string;
  expression?: string; // e.g. Concerned -> Explanatory
  camera: string;
  environment: string;
  lighting: string;
  composition: string;
  graphics?: string; // e.g. Liquidity chart animates upward
  transition: string;
  imagePath: string;
  motionSpec: {
    continuousMotionPlan: string;
    motionModule: string; // e.g. AnimateDiff v3 + Hotshot
    contextWindow: number; // 16 frames
    motionScale: number; // 1.05
    keyframes: MotionKeyframe[];
  };
  audioSpec: {
    speaker: string;
    ttsVoice: string;
    speechSpeed: number;
    emotion: string;
    subtitlesText: string;
    bgmTrack: string;
    bgmVolume: number;
  };
  renderStatus: {
    animation: 'rendered' | 'rendering' | 'pending';
    audio: 'rendered' | 'rendering' | 'pending';
    composite: 'ready' | 'rendering' | 'stale' | 'pending';
  };
  verification: {
    passed: boolean;
    technicalOk: boolean;
    visualOk: boolean;
    temporalMotionScore: number; // 0 to 1.0
    motionVerdict: 'MOTION DETECTED ✓' | 'STATIC DETECTED ❌';
    fps: number;
    resolution: string;
    codec: string;
  };
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  type: 'PDF' | 'DOCX' | 'TXT' | 'Markdown' | 'CSV';
  category: 'Research' | 'Series Rule' | 'Terminology' | 'Previous Episode' | 'Mistake Log';
  summary: string;
  keyFacts: string[];
  confidence: 'High' | 'Medium' | 'Unresolved';
  dateAdded: string;
}

export interface ResearchTopic {
  id: string;
  topic: string;
  niche: 'Finance' | 'AI & Tech' | 'Robotics' | 'Geopolitics' | 'Science';
  sources: string[];
  keyConcepts: string[];
  confidence: 'High' | 'Medium' | 'Review Needed';
  unresolvedCount: number;
  suggestedAngle: string;
}

export interface HistoricalEvent {
  year: string;
  headline: string;
  impact: string;
  visualMetaphor: string;
  verifiedSource: string;
}

export interface TrendRadarItem {
  id: string;
  niche: string;
  heatLevel: number; // 1-5
  velocity: string;
  proposedTopic: string;
  hook: string;
  targetDuration: string;
}

export interface HardwareTelemetry {
  mode?: 'local' | 'hybrid' | 'cloud';
  localComfyConnected?: boolean;
  localOllamaConnected?: boolean;
  gpu: {
    name: string;
    totalVramGb: number;
    usedVramGb: number;
    vramPercent: number;
    temperatureC: number;
    utilizationPercent: number;
  };
  cpu: {
    model: string;
    utilizationPercent: number;
    cores: number;
  };
  ram: {
    totalGb: number;
    usedGb: number;
    percent: number;
  };
  services: {
    comfyUI: { status: 'online' | 'offline'; port: number; latencyMs: number };
    ollama: { status: 'online' | 'offline'; port: number; latencyMs: number };
    tts: { status: 'online' | 'offline'; engine: string; latencyMs: number };
    ffmpeg: { status: 'ready' | 'busy'; version: string };
    whisper: { status: 'online' | 'offline'; engine: string };
  };
}

export interface SponsorDeal {
  id: string;
  brandName: string;
  productName: string;
  productUrl: string;
  targetDurationSec: number;
  talkingPoints: string[];
  script: string;
  callToAction: string;
  approvalStatus: 'Draft' | 'In Review' | 'Approved' | 'Inserted';
  insertTimestampSec: number; // e.g. at 18.0s mid-roll
}

export interface ChannelSeries {
  id: string;
  title: string;
  niche: 'Finance' | 'Business' | 'History' | 'AI & Technology' | 'Anime/Narrative';
  color: string;
  episodesCount: number;
  cadence: string;
  visualBibleRules: string[];
  loreMemory: string[];
}

export interface CalendarProductionItem {
  id: string;
  title: string;
  seriesId: string;
  type: 'Shorts' | 'Standard Episode' | 'Documentary' | 'Deep Dive';
  scheduledDate: string;
  priority: 'Urgent' | 'High' | 'Normal' | 'Queued';
  status: 'Drafting' | 'Scene Planning' | 'Rendering' | 'Verified' | 'Published';
  renderOrder: number;
  estimatedRenderMins: number;
}

export interface ReferenceVideoItem {
  id: string;
  name: string;
  sourceCategory: string;
  pacingCutsPerMin: number;
  cameraLanguage: string;
  illustrationStyle: string;
  animationApproach: string;
  colorPalette: string[];
  extractedPromptHints: string;
}

export interface ContinuityRule {
  id: string;
  subject: 'Wardrobe Lock' | 'World Scale' | 'Lighting Temperature' | 'Voice Phonetics' | 'Series Canon';
  characterId?: string;
  rule: string;
  severity: 'Strict Violation' | 'Advisory Warning' | 'Passed';
}

export interface SystemSettingsConfig {
  comfyUrl: string;
  ollamaUrl: string;
  ollamaModel: string;
  vramSafetyLimitGb: number;
  ffmpegPath: string;
  cloudProvider: 'Local Only' | 'RunPod Auto-Fallback' | 'Google Colab Pro' | 'Modal Labs';
  defaultFps: number;
  autoDuckDb: number;
}

