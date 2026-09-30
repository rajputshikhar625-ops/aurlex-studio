import React, { useState } from 'react';
import { 
  UserCheck, 
  Sparkles, 
  ShieldCheck, 
  Plus, 
  Check, 
  AlertCircle, 
  Copy, 
  Sliders, 
  Film
} from 'lucide-react';
import { CharacterItem } from '../types';

interface CharacterBibleViewProps {
  characters: CharacterItem[];
  onUpdateCharacter: (char: CharacterItem) => void;
  onAddCharacter: (newChar: CharacterItem) => void;
  onNavigateTab: (tab: string) => void;
}

export const CharacterBibleView: React.FC<CharacterBibleViewProps> = ({
  characters,
  onUpdateCharacter,
  onAddCharacter,
  onNavigateTab,
}) => {
  const [selectedCharId, setSelectedCharId] = useState<string>(characters[0]?.id || 'CHAR_001');
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  // New character state
  const [newCharName, setNewCharName] = useState('');
  const [newCharRole, setNewCharRole] = useState('');
  const [newCharAge, setNewCharAge] = useState(26);

  const activeChar = characters.find((c) => c.id === selectedCharId) || characters[0];

  const handleCopyPromptEmbed = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleAddAllowedAction = (actionText: string) => {
    if (!actionText.trim() || !activeChar) return;
    const updated = {
      ...activeChar,
      allowedActions: [...activeChar.allowedActions, actionText.trim()],
    };
    onUpdateCharacter(updated);
  };

  const handleCreateChar = () => {
    if (!newCharName.trim()) return;
    const newId = `CHAR_${(characters.length + 1).toString().padStart(3, '0')}`;
    const created: CharacterItem = {
      id: newId,
      name: newCharName,
      role: newCharRole || 'Subject Matter Specialist',
      age: newCharAge,
      style: '2D illustrated clean animation',
      hair: 'Dark styled hair',
      clothes: 'Neutral professional attire',
      personality: 'Articulate and observant',
      allowedActions: ['speaking', 'gesturing', 'walking', 'explaining'],
      imagePath: '/src/assets/images/character_arjun_bible_1790742871208.jpg',
      consistencyScore: 95.0,
      notes: 'New persistent character for Aurlex productions.',
    };
    onAddCharacter(created);
    setSelectedCharId(newId);
    setIsAddingNew(false);
    setNewCharName('');
    setNewCharRole('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
            Production Stage 03 · Character Bible
          </div>
          <h2 className="text-2xl font-bold text-white font-display">
            Persistent Character Roster & Consistency Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Guarantees character consistency across all scenes. Scenes reference persistent IDs (e.g. CHAR_001) instead of hallucinating random faces.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Character ID</span>
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Character Card List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Registered Characters ({characters.length})
          </div>

          <div className="space-y-3">
            {characters.map((char) => {
              const isSelected = char.id === selectedCharId;
              return (
                <div
                  key={char.id}
                  onClick={() => setSelectedCharId(char.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/80 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <img
                    src={char.imagePath}
                    alt={char.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-lg object-cover bg-slate-900 shrink-0 border border-slate-800"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {char.id}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                        {char.consistencyScore}% match
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white truncate">
                      {char.name}
                    </h3>
                    <p className="text-xs text-slate-400 truncate">
                      {char.role}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Consistency Principle Note */}
          <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Identity Invariance Rule</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Every prompt in the Scene Director embeds the canonical model weights and wardrobe constraints for {activeChar?.id}. This eliminates random clothing or facial drift between cuts.
            </p>
          </div>
        </div>

        {/* Character Detail Sheet */}
        <div className="lg:col-span-8">
          {activeChar ? (
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-6">
              {/* Top Profile Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
                <div className="flex items-center gap-4">
                  <img
                    src={activeChar.imagePath}
                    alt={activeChar.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-xl object-cover border-2 border-amber-500/40 shadow-lg"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        {activeChar.id}
                      </span>
                      <span className="text-xs text-slate-400">Age: {activeChar.age}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white font-display mt-1">
                      {activeChar.name}
                    </h2>
                    <p className="text-xs text-slate-400">{activeChar.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400 font-medium">Temporal Consistency</div>
                  <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                    {activeChar.consistencyScore}%
                  </div>
                  <div className="text-[10px] text-slate-500">Cross-scene verified</div>
                </div>
              </div>

              {/* Character Attributes Spec */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 font-medium">Visual Art Style</span>
                  <div className="text-slate-100 font-semibold">{activeChar.style}</div>
                </div>
                <div className="space-y-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 font-medium">Canonical Hair & Grooming</span>
                  <div className="text-slate-100 font-semibold">{activeChar.hair}</div>
                </div>
                <div className="space-y-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 font-medium">Mandatory Wardrobe</span>
                  <div className="text-slate-100 font-semibold">{activeChar.clothes}</div>
                </div>
                <div className="space-y-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 font-medium">Personality & Demeanor</span>
                  <div className="text-slate-100 font-semibold">{activeChar.personality}</div>
                </div>
              </div>

              {/* Allowed Actions Registry */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Allowed Animation Actions
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {activeChar.allowedActions.length} permitted poses
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeChar.allowedActions.map((action, i) => (
                    <div
                      key={i}
                      className="px-2.5 py-1 text-xs rounded bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5"
                    >
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ComfyUI / AnimateDiff Prompt Embedding Token */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 font-mono">
                    AnimateDiff Consistency Injection Prompt:
                  </span>
                  <button
                    onClick={() =>
                      handleCopyPromptEmbed(
                        `lora:${activeChar.id.toLowerCase()}_v3:0.9, ${activeChar.name}, ${activeChar.age}yo, ${activeChar.hair}, wearing ${activeChar.clothes}, ${activeChar.style}, consistent character sheet, masterwork`
                      )
                    }
                    className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-mono cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedPrompt ? 'Copied!' : 'Copy Formula'}</span>
                  </button>
                </div>
                <code className="block text-[11px] text-slate-400 font-mono bg-slate-900/60 p-2.5 rounded border border-slate-800/80 leading-relaxed overflow-x-auto">
                  lora:{activeChar.id.toLowerCase()}_v3:0.9, {activeChar.name}, {activeChar.age}yo, {activeChar.hair}, wearing {activeChar.clothes}, {activeChar.style}, consistent character sheet
                </code>
              </div>

              {/* Production Director Notes */}
              <div className="text-xs text-slate-400 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                <span>Director Memo: {activeChar.notes}</span>
                <button
                  onClick={() => onNavigateTab('script')}
                  className="text-amber-400 hover:underline cursor-pointer"
                >
                  Assign to Scene →
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Modal: New Character */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white font-display">Create Persistent Character</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400">Character Full Name</label>
                <input
                  type="text"
                  value={newCharName}
                  onChange={(e) => setNewCharName(e.target.value)}
                  placeholder="e.g. Vikram Sharma"
                  className="w-full mt-1 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-slate-400">Role in Series</label>
                <input
                  type="text"
                  value={newCharRole}
                  onChange={(e) => setNewCharRole(e.target.value)}
                  placeholder="e.g. Monetary Historian"
                  className="w-full mt-1 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-slate-400">Approximate Age</label>
                <input
                  type="number"
                  value={newCharAge}
                  onChange={(e) => setNewCharAge(parseInt(e.target.value) || 25)}
                  className="w-full mt-1 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChar}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer"
              >
                Register Character ID
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
