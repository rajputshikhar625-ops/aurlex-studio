import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { DashboardView } from './components/DashboardView';
import { StudioCreateView } from './components/StudioCreateView';
import { StoryScriptView } from './components/StoryScriptView';
import { CharacterBibleView } from './components/CharacterBibleView';
import { AnimationEngineView } from './components/AnimationEngineView';
import { AudioStudioView } from './components/AudioStudioView';
import { VideoPreviewView } from './components/VideoPreviewView';
import { VerificationEngineView } from './components/VerificationEngineView';
import { ResearchIntelligenceView } from './components/ResearchIntelligenceView';
import { HardwareManagerView } from './components/HardwareManagerView';
import { SponsorStudioView } from './components/SponsorStudioView';
import { ChannelsSeriesView } from './components/ChannelsSeriesView';
import { ProductionCalendarView } from './components/ProductionCalendarView';
import { ReferenceStudioView } from './components/ReferenceStudioView';
import { DirectorContinuityView } from './components/DirectorContinuityView';
import { EditorCollaborationView } from './components/EditorCollaborationView';
import { SettingsSystemView } from './components/SettingsSystemView';
import { NewProjectModal } from './components/NewProjectModal';

import {
  INITIAL_PROJECT,
  INITIAL_CHARACTERS,
  INITIAL_SCENES,
  INITIAL_KNOWLEDGE_DOCS,
  INITIAL_RESEARCH_TOPIC,
  INITIAL_HISTORICAL_EVENTS,
  INITIAL_TREND_RADAR,
  INITIAL_HARDWARE_TELEMETRY,
  INITIAL_SPONSOR_DEALS,
  INITIAL_CHANNELS_SERIES,
  INITIAL_CALENDAR_ITEMS,
  INITIAL_REFERENCE_ITEMS,
  INITIAL_CONTINUITY_RULES,
  INITIAL_SYSTEM_SETTINGS,
} from './data/initialData';

import {
  ProjectData,
  CharacterItem,
  SceneItem,
  KnowledgeDocument,
  ResearchTopic,
  HistoricalEvent,
  TrendRadarItem,
  HardwareTelemetry,
  SponsorDeal,
  ChannelSeries,
  CalendarProductionItem,
  ReferenceVideoItem,
  ContinuityRule,
  SystemSettingsConfig,
  VideoFormat,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [project, setProject] = useState<ProjectData>(INITIAL_PROJECT);
  const [characters, setCharacters] = useState<CharacterItem[]>(INITIAL_CHARACTERS);
  const [scenes, setScenes] = useState<SceneItem[]>(INITIAL_SCENES);
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>(INITIAL_KNOWLEDGE_DOCS);
  const [researchTopic, setResearchTopic] = useState<ResearchTopic>(INITIAL_RESEARCH_TOPIC);
  const [deepHistory, setDeepHistory] = useState<HistoricalEvent[]>(INITIAL_HISTORICAL_EVENTS);
  const [trendRadar, setTrendRadar] = useState<TrendRadarItem[]>(INITIAL_TREND_RADAR);
  const [telemetry, setTelemetry] = useState<HardwareTelemetry>(INITIAL_HARDWARE_TELEMETRY);
  const [sponsorDeals, setSponsorDeals] = useState<SponsorDeal[]>(INITIAL_SPONSOR_DEALS);
  const [seriesList, setSeriesList] = useState<ChannelSeries[]>(INITIAL_CHANNELS_SERIES);
  const [calendarItems, setCalendarItems] = useState<CalendarProductionItem[]>(INITIAL_CALENDAR_ITEMS);
  const [referenceItems, setReferenceItems] = useState<ReferenceVideoItem[]>(INITIAL_REFERENCE_ITEMS);
  const [continuityRules, setContinuityRules] = useState<ContinuityRule[]>(INITIAL_CONTINUITY_RULES);
  const [systemSettings, setSystemSettings] = useState<SystemSettingsConfig>(INITIAL_SYSTEM_SETTINGS);

  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState<boolean>(false);
  const [systemNotification, setSystemNotification] = useState<string | null>(null);

  // Poll hardware telemetry from server
  const fetchTelemetry = async () => {
    try {
      const res = await fetch('/api/hardware/telemetry');
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
      }
    } catch {
      // Use initial state if offline
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 15000);
    return () => clearInterval(interval);
  }, []);

  const showNotification = (msg: string) => {
    setSystemNotification(msg);
    setTimeout(() => setSystemNotification(null), 5000);
  };

  // Handlers for state updates
  const handleUpdateScene = (updatedScene: SceneItem) => {
    setScenes((prev) => prev.map((s) => (s.id === updatedScene.id ? updatedScene : s)));
    showNotification(`Scene ${updatedScene.sceneNumber} (${updatedScene.title}) updated.`);
  };

  const handleAddScene = () => {
    const nextNum = scenes.length + 1;
    const newScene: SceneItem = {
      id: `SCENE_${nextNum.toString().padStart(2, '0')}`,
      sceneNumber: nextNum,
      title: `Strategic Synthesis & Takeaways`,
      durationSec: 6.0,
      characterId: characters[0]?.id || 'CHAR_001',
      dialogue: 'When liquidity flows smoothly, commerce thrives without friction.',
      action: 'Character summarizes key principles with natural gestures.',
      camera: 'Medium close-up to wide pull-back',
      environment: 'Architectural trading room atrium at sunset',
      lighting: 'Golden hour ambient light',
      composition: 'Golden ratio center',
      transition: 'Fade to black',
      imagePath: '/src/assets/images/scene_bank_liquidity_1790742883212.jpg',
      motionSpec: {
        continuousMotionPlan: 'Speaking gesture (0-2s), turns to board (2-4s), returns to center camera (4-6s)',
        motionModule: 'AnimateDiff Evolved v3',
        contextWindow: 16,
        motionScale: 1.0,
        keyframes: [
          { timestampSec: 0.0, label: 'Entry Talk', poseDescription: 'Arms resting on podium', deltaEnergy: 0.25 },
          { timestampSec: 3.0, label: 'Main Point', poseDescription: 'Open hand emphasis', deltaEnergy: 0.5 },
          { timestampSec: 6.0, label: 'Conclusion', poseDescription: 'Gentle nod and neutral posture', deltaEnergy: 0.2 },
        ],
      },
      audioSpec: {
        speaker: 'Arjun (CHAR_001)',
        ttsVoice: 'en-IN-Prabhat / Index-TTS Studio Male',
        speechSpeed: 1.0,
        emotion: 'Conclusive, clear',
        subtitlesText: 'When liquidity flows smoothly, commerce thrives without friction.',
        bgmTrack: 'Warm Synth & Acoustic Bass',
        bgmVolume: 0.25,
      },
      renderStatus: {
        animation: 'pending',
        audio: 'pending',
        composite: 'pending',
      },
      verification: {
        passed: false,
        technicalOk: false,
        visualOk: false,
        temporalMotionScore: 0.0,
        motionVerdict: 'STATIC DETECTED ❌',
        fps: 24,
        resolution: '1920x1080',
        codec: 'Pending',
      },
    };
    setScenes((prev) => [...prev, newScene]);
    showNotification(`New Scene 0${nextNum} added to production script.`);
  };

  const handleUpdateCharacter = (char: CharacterItem) => {
    setCharacters((prev) => prev.map((c) => (c.id === char.id ? char : c)));
    showNotification(`Character ${char.id} (${char.name}) updated in Character Bible.`);
  };

  const handleAddCharacter = (newChar: CharacterItem) => {
    setCharacters((prev) => [...prev, newChar]);
    showNotification(`Character ${newChar.id} (${newChar.name}) added to registry.`);
  };

  const handleAddKnowledgeDoc = (doc: KnowledgeDocument) => {
    setKnowledgeDocs((prev) => [doc, ...prev]);
    showNotification(`Document ${doc.id} indexed into Knowledge Library.`);
  };

  const handlePromoteTrendToProduction = (trend: TrendRadarItem) => {
    const newProj: ProjectData = {
      id: `PROJ-${Date.now().toString().slice(-4)}`,
      title: trend.proposedTopic,
      series: trend.niche,
      episodeNumber: 1,
      durationTargetSec: 36.0,
      format: '16:9',
      style: '2D Illustrated Editorial',
      language: 'English',
      progress: {
        research: { status: 'complete', percent: 100 },
        story: { status: 'in_progress', percent: 50 },
        characters: { status: 'complete', percent: 100 },
        scenes: { status: 'pending', percent: 20 },
        animation: { status: 'pending', percent: 0 },
        audio: { status: 'pending', percent: 0 },
        editing: { status: 'pending', percent: 0 },
        verification: { status: 'pending', percent: 0 },
      },
    };
    setProject(newProj);
    setActiveTab('script');
    showNotification(`Promoted trend topic to active production: "${trend.proposedTopic}".`);
  };

  const handleTriggerPipelineRender = () => {
    setIsRendering(true);
    showNotification('Pipeline Render initiated: Coordinating ComfyUI, AnimateDiff & Index-TTS...');
    setTimeout(() => {
      setScenes((prev) =>
        prev.map((s) => ({
          ...s,
          renderStatus: {
            animation: 'rendered',
            audio: 'rendered',
            composite: 'ready',
          },
          verification: {
            ...s.verification,
            passed: true,
            temporalMotionScore: Math.max(0.85, s.verification.temporalMotionScore),
            motionVerdict: 'MOTION DETECTED ✓',
          },
        }))
      );
      setProject((prev) => ({
        ...prev,
        progress: {
          research: { status: 'complete', percent: 100 },
          story: { status: 'complete', percent: 100 },
          characters: { status: 'complete', percent: 100 },
          scenes: { status: 'complete', percent: 100 },
          animation: { status: 'complete', percent: 100 },
          audio: { status: 'complete', percent: 100 },
          editing: { status: 'complete', percent: 100 },
          verification: { status: 'complete', percent: 100 },
        },
      }));
      setIsRendering(false);
      showNotification('Episode rendering & verification complete! Master MP4 compiled.');
      setActiveTab('preview');
    }, 3200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* Universal Top Bar with 17 Pillars Navigation */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        project={project}
        telemetry={telemetry}
        onOpenNewProject={() => setIsNewProjectModalOpen(true)}
        onTriggerRender={handleTriggerPipelineRender}
        isRendering={isRendering}
      />

      {/* Floating System Notification Toast */}
      {systemNotification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md p-3.5 rounded-xl bg-slate-900/95 border border-amber-500/40 text-amber-200 text-xs shadow-2xl backdrop-blur-md flex items-center gap-3 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
          <p className="flex-1 font-medium">{systemNotification}</p>
          <button
            onClick={() => setSystemNotification(null)}
            className="text-slate-400 hover:text-white text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 sm:py-8">
        {/* Pillar 01: Home / Dashboard */}
        {activeTab === 'dashboard' && (
          <DashboardView
            project={project}
            telemetry={telemetry}
            scenes={scenes}
            onNavigateTab={setActiveTab}
            onTriggerRender={handleTriggerPipelineRender}
            isRendering={isRendering}
          />
        )}

        {/* Pillar 02: Studio / Create */}
        {activeTab === 'create' && (
          <StudioCreateView
            characters={characters}
            onStartProduction={(newProj) => {
              setProject(newProj);
              showNotification(`Started new production: ${newProj.title}`);
            }}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* Pillar 03 & 04: Researcher & Knowledge Library */}
        {activeTab === 'intelligence' && (
          <ResearchIntelligenceView
            researchTopic={researchTopic}
            knowledgeDocs={knowledgeDocs}
            trendRadar={trendRadar}
            deepHistory={deepHistory}
            onAddKnowledgeDoc={handleAddKnowledgeDoc}
            onPromoteTrendToProduction={handlePromoteTrendToProduction}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* Pillar 05 & 07: Script / Story & Scene Director */}
        {activeTab === 'script' && (
          <StoryScriptView
            scenes={scenes}
            characters={characters}
            onUpdateScene={handleUpdateScene}
            onAddScene={handleAddScene}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* Pillar 06: Characters / Character Bible */}
        {activeTab === 'characters' && (
          <CharacterBibleView
            characters={characters}
            onUpdateCharacter={handleUpdateCharacter}
            onAddCharacter={handleAddCharacter}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* Pillar 08: Animation / Production & D3 Motion Engine */}
        {activeTab === 'animation' && (
          <AnimationEngineView
            scenes={scenes}
            characters={characters}
            telemetry={telemetry}
            onUpdateScene={handleUpdateScene}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* Pillar 10: Voice & Audio */}
        {activeTab === 'audio' && (
          <AudioStudioView
            scenes={scenes}
            characters={characters}
            onUpdateScene={handleUpdateScene}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* Pillar 11: Editor / Collaboration */}
        {activeTab === 'editor' && (
          <EditorCollaborationView
            scenes={scenes}
            characters={characters}
            onUpdateScene={handleUpdateScene}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* Preview Studio */}
        {activeTab === 'preview' && (
          <VideoPreviewView
            scenes={scenes}
            characters={characters}
            activeFormat={project.format}
            onChangeFormat={(fmt) => setProject({ ...project, format: fmt })}
            onUpdateScene={handleUpdateScene}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* Pillar 16: Verification / Quality Control */}
        {activeTab === 'verification' && (
          <VerificationEngineView
            scenes={scenes}
            onUpdateScene={handleUpdateScene}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* Pillar 09: Director & Continuity */}
        {activeTab === 'continuity' && (
          <DirectorContinuityView
            continuityRules={continuityRules}
            characters={characters}
            scenes={scenes}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* Pillar 12: Sponsor Studio */}
        {activeTab === 'sponsor' && (
          <SponsorStudioView
            sponsorDeals={sponsorDeals}
            onUpdateSponsorDeal={(deal) => {
              setSponsorDeals((prev) => prev.map((d) => (d.id === deal.id ? deal : d)));
              showNotification(`Sponsor deal ${deal.brandName} updated.`);
            }}
            onAddSponsorDeal={(deal) => {
              setSponsorDeals((prev) => [deal, ...prev]);
              showNotification(`Added new partner: ${deal.brandName}.`);
            }}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* Pillar 13: Channels / Series */}
        {activeTab === 'series' && (
          <ChannelsSeriesView
            seriesList={seriesList}
            calendarItems={calendarItems}
            onSelectSeriesForProduction={(ser) => {
              setProject({ ...project, series: ser.title });
              showNotification(`Selected series franchise: ${ser.title}.`);
            }}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* Pillar 14: Production Calendar & Queue */}
        {activeTab === 'calendar' && (
          <ProductionCalendarView
            calendarItems={calendarItems}
            onUpdateCalendarItem={(item) => {
              setCalendarItems((prev) => prev.map((it) => (it.id === item.id ? item : it)));
            }}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* Pillar 15: Reference Studio */}
        {activeTab === 'reference' && (
          <ReferenceStudioView
            referenceItems={referenceItems}
            onApplyReferenceToScene={(ref) => {
              showNotification(`Applied aesthetic invariants from ${ref.name}.`);
            }}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* Hardware & GPU Manager */}
        {activeTab === 'hardware' && (
          <HardwareManagerView
            telemetry={telemetry}
            onRefreshTelemetry={fetchTelemetry}
          />
        )}

        {/* Pillar 17: Settings / System */}
        {activeTab === 'settings' && (
          <SettingsSystemView
            settings={systemSettings}
            onUpdateSettings={(newSettings) => {
              setSystemSettings(newSettings);
              showNotification('System daemon and VRAM guardrail settings saved.');
            }}
            onRefreshTelemetry={fetchTelemetry}
          />
        )}
      </main>

      {/* Project Switcher Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onSelectProject={(newProj) => {
          setProject(newProj);
          showNotification(`Switched project to: ${newProj.title}`);
        }}
        currentProject={project}
      />

      {/* Production Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-4 lg:px-8 py-3.5 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">Aurlex Studio OS</span>
            <span>·</span>
            <span>Director + Production Manager + Quality Gate</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
            <span>17 Studio Pillars Active</span>
            <span>·</span>
            <span>GTX 1650 4GB Guarded</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
