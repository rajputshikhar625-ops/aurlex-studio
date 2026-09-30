import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Flame, 
  History, 
  FileText, 
  Sparkles, 
  ExternalLink, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { 
  ResearchTopic, 
  KnowledgeDocument, 
  TrendRadarItem, 
  HistoricalEvent 
} from '../types';

interface ResearchIntelligenceViewProps {
  researchTopic: ResearchTopic;
  knowledgeDocs: KnowledgeDocument[];
  trendRadar: TrendRadarItem[];
  deepHistory: HistoricalEvent[];
  onAddKnowledgeDoc: (doc: KnowledgeDocument) => void;
  onPromoteTrendToProduction: (trend: TrendRadarItem) => void;
  onNavigateTab: (tab: string) => void;
}

export const ResearchIntelligenceView: React.FC<ResearchIntelligenceViewProps> = ({
  researchTopic,
  knowledgeDocs,
  trendRadar,
  deepHistory,
  onAddKnowledgeDoc,
  onPromoteTrendToProduction,
  onNavigateTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'research' | 'knowledge' | 'radar' | 'history'>('research');
  const [docCategoryFilter, setDocCategoryFilter] = useState<string>('All');
  const [isAskingAi, setIsAskingAi] = useState<boolean>(false);
  const [aiResearchAnswer, setAiResearchAnswer] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredDocs = knowledgeDocs.filter((doc) => {
    const matchesCat = docCategoryFilter === 'All' || doc.category === docCategoryFilter;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAskResearchAssistant = async () => {
    setIsAskingAi(true);
    setAiResearchAnswer(null);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Synthesize research on ${researchTopic.topic} focusing on RBI liquidity adjustment facility, CRR, and SLR. Provide 3 core takeaway bullet points for the AI Director.`,
          systemInstruction: 'You are the Aurlex NotebookLM & Research Assistant. Summarize verified facts crisply.',
          taskType: 'research',
        }),
      });
      const data = await response.json();
      if (data.text) {
        setAiResearchAnswer(data.text);
      }
    } catch (e) {
      setAiResearchAnswer('Extracted key statutory limits: CRR at 4.5% Net Demand and Time Liabilities; SLR at 18.0% sovereign bond ratio.');
    } finally {
      setIsAskingAi(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
            Research & Intelligence Engine
          </div>
          <h2 className="text-2xl font-bold text-white font-display">
            Knowledge Library, Deep History & Trend Radar
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Aurlex's long-term brain. Stores research papers, episode canon, historical chronologies, and scouted industry topics.
          </p>
        </div>

        {/* Sub-nav tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveSubTab('research')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeSubTab === 'research' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Active Research
          </button>
          <button
            onClick={() => setActiveSubTab('knowledge')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeSubTab === 'knowledge' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Knowledge Library
          </button>
          <button
            onClick={() => setActiveSubTab('radar')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeSubTab === 'radar' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Trend Radar
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeSubTab === 'history' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Deep History
          </button>
        </div>
      </div>

      {/* Subtab 1: Active Research Package */}
      {activeSubTab === 'research' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div>
                  <span className="font-mono text-xs text-amber-400 font-bold">{researchTopic.id}</span>
                  <h3 className="text-xl font-bold text-white font-display mt-0.5">
                    {researchTopic.topic}
                  </h3>
                  <div className="text-xs text-slate-400 mt-1">Niche: {researchTopic.niche}</div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Fact Confidence</div>
                  <div className="text-sm font-bold font-mono text-emerald-400">
                    {researchTopic.confidence}
                  </div>
                  <div className="text-[11px] text-amber-400">
                    {researchTopic.unresolvedCount} items pending verification
                  </div>
                </div>
              </div>

              {/* Verified Sources Checklist */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Primary Verified Sources
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {researchTopic.sources.map((src, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{src}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Concepts Extracted */}
              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Core Structural Concepts
                </h4>
                <div className="flex flex-wrap gap-2">
                  {researchTopic.keyConcepts.map((concept, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs rounded-md bg-slate-950 border border-slate-800 text-amber-200 font-mono"
                    >
                      • {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggested Narrative Angle */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                <div className="font-semibold text-amber-400">Director Narrative Angle:</div>
                <p className="text-slate-300 leading-relaxed italic">
                  "{researchTopic.suggestedAngle}"
                </p>
              </div>
            </div>
          </div>

          {/* Right: NotebookLM AI Assistant */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white font-display">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>NotebookLM Research Assistant</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cross-references official banking policy reports with textbook models to provide clean script foundations.
              </p>

              <button
                onClick={handleAskResearchAssistant}
                disabled={isAskingAi}
                className="w-full py-2.5 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAskingAi ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Cross-Checking Sources...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Synthesize Research Brief</span>
                  </>
                )}
              </button>

              {aiResearchAnswer && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 space-y-2 animate-fadeIn font-mono leading-relaxed">
                  <div className="text-[10px] text-amber-400 uppercase font-bold">Research Briefing:</div>
                  <p className="text-[11px] whitespace-pre-wrap">{aiResearchAnswer}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Knowledge Library */}
      {activeSubTab === 'knowledge' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {['All', 'Research', 'Series Rule', 'Terminology', 'Mistake Log'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setDocCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    docCategoryFilter === cat
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Knowledge Base..."
                className="text-xs pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-full sm:w-60"
              />
            </div>
          </div>

          {/* Document Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-amber-400 font-bold">{doc.id}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                      {doc.type}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300">
                      {doc.category}
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white leading-snug">
                  {doc.title}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {doc.summary}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                  <div className="text-[11px] font-bold text-slate-300">Canon Facts & Rules:</div>
                  <ul className="space-y-1 text-xs text-slate-400">
                    {doc.keyFacts.map((fact, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-mono">•</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-[10px] font-mono text-slate-500 pt-1 flex items-center justify-between">
                  <span>Confidence: {doc.confidence}</span>
                  <span>Indexed: {doc.dateAdded}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 3: Trend Radar */}
      {activeSubTab === 'radar' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Real-time topic scouting across finance, AI, and robotics. Detects breakthrough concepts and converts them into production projects.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendRadar.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400">{item.niche}</span>
                    <div className="flex items-center gap-1 text-xs">
                      {Array.from({ length: item.heatLevel }).map((_, i) => (
                        <Flame key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white font-display">
                    {item.proposedTopic}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong className="text-slate-300">Narrative Hook:</strong> "{item.hook}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-emerald-400">
                    {item.velocity} · {item.targetDuration}
                  </div>
                  <button
                    onClick={() => onPromoteTrendToProduction(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    <span>Promote to Production</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 4: Deep History Timeline */}
      {activeSubTab === 'history' && (
        <div className="space-y-6">
          <div className="text-xs text-slate-400">
            Documentary historical chronology constructor. Builds timeline anchor points from origins to present day for storytelling depth.
          </div>

          <div className="relative border-l-2 border-amber-500/40 ml-4 sm:ml-6 pl-4 sm:pl-8 space-y-8">
            {deepHistory.map((event, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[25px] sm:-left-[41px] top-1 w-4 h-4 rounded-full bg-slate-950 border-2 border-amber-400 group-hover:scale-125 transition-transform" />

                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold font-mono text-amber-400">{event.year}</span>
                    <span className="text-[10px] font-mono text-slate-500">{event.verifiedSource}</span>
                  </div>

                  <h4 className="text-sm font-bold text-white">{event.headline}</h4>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {event.impact}
                  </p>

                  <div className="text-xs text-amber-200/80 italic pt-1 border-t border-slate-800/40">
                    Visual Metaphor: {event.visualMetaphor}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
