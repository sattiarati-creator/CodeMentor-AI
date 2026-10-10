import React, { useState } from "react";
import { Problem, SocraticHintResponse } from "../../types";
import { aiService } from "../../services/ai.service";
import { Lightbulb, Lock, Unlock, Sparkles, ChevronRight } from "lucide-react";

interface SocraticHintDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem;
  studentCode: string;
  onHintUnlocked?: (level: number) => void;
}

export const SocraticHintDrawer: React.FC<SocraticHintDrawerProps> = ({
  isOpen,
  onClose,
  problem,
  studentCode,
  onHintUnlocked
}) => {
  const [unlockedLevel, setUnlockedLevel] = useState<number>(1);
  const [activeLevel, setActiveLevel] = useState<number>(1);
  const [hintsCache, setHintsCache] = useState<Record<number, SocraticHintResponse>>({});
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const hintLevels = [
    { level: 1, name: "Problem Comprehension", desc: "Clarify inputs, invariants, edge cases" },
    { level: 2, name: "Pattern Recognition", desc: "Identify algorithmic pattern" },
    { level: 3, name: "Data Structure Suggestion", desc: "Optimal structure & reasons" },
    { level: 4, name: "Approach & Logic Guide", desc: "Loop invariants & state transitions" },
    { level: 5, name: "Structured Pseudocode", desc: "Step-by-step algorithm scaffold" },
    { level: 6, name: "Solution Walkthrough", desc: "Explicitly requested complete solution reference" }
  ];

  const fetchHint = async (level: number) => {
    if (hintsCache[level]) {
      setActiveLevel(level);
      return;
    }

    setLoading(true);
    try {
      const res = await aiService.getHint({
        problemId: problem.id,
        problemTitle: problem.title,
        problemDescription: problem.description,
        constraints: problem.constraints,
        studentCode,
        hintLevel: level
      });
      setHintsCache((prev) => ({ ...prev, [level]: res }));
      setActiveLevel(level);
      if (level > unlockedLevel) {
        setUnlockedLevel(level);
        onHintUnlocked?.(level);
      }
    } catch (err) {
      console.error("Failed to load hint:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load if level 1 not cached
  if (!hintsCache[1] && !loading) {
    fetchHint(1);
  }

  const currentHint = hintsCache[activeLevel];

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">Socratic Hint Coach</h3>
            <p className="text-[11px] text-slate-400">Progressive hints — learn how to think</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition text-xs"
        >
          Close
        </button>
      </div>

      {/* Socratic Philosophy Banner */}
      <div className="px-4 py-2.5 bg-emerald-950/20 border-b border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
        <span>Hints guide your reasoning step-by-step without spoiling full code solutions.</span>
      </div>

      {/* Level Selector Tabs */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/30 flex gap-1.5 overflow-x-auto">
        {hintLevels.map((hl) => {
          const isUnlocked = hl.level <= unlockedLevel;
          const isActive = hl.level === activeLevel;

          return (
            <button
              key={hl.level}
              onClick={() => {
                if (isUnlocked) {
                  fetchHint(hl.level);
                } else if (hl.level === unlockedLevel + 1) {
                  fetchHint(hl.level);
                }
              }}
              className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-medium flex flex-col items-center justify-center transition border ${
                isActive
                  ? "bg-emerald-500 text-slate-950 border-emerald-400 font-semibold"
                  : isUnlocked
                  ? "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800"
                  : "bg-slate-900 text-slate-500 border-slate-800/60 opacity-60"
              }`}
            >
              <div className="flex items-center gap-1">
                {isUnlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                <span>L{hl.level}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Content Body */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-200">
        {loading ? (
          <div className="h-48 flex flex-col items-center justify-center gap-3 text-slate-400">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p>Formulating Socratic guidance...</p>
          </div>
        ) : currentHint ? (
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-800">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block mb-1">
                Hint Level {currentHint.level} of 6
              </span>
              <h4 className="text-base font-semibold text-white tracking-tight">{currentHint.title}</h4>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 whitespace-pre-line font-normal text-slate-300 leading-relaxed font-mono text-[11px]">
              {currentHint.content}
            </div>

            {/* Next Level Unlock Prompt */}
            {activeLevel < 6 && (
              <div className="pt-2">
                <button
                  onClick={() => fetchHint(activeLevel + 1)}
                  className={`w-full py-2.5 px-4 border rounded-xl font-medium flex items-center justify-center gap-2 transition ${
                    activeLevel === 5
                      ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30"
                      : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
                  }`}
                >
                  <span>
                    {activeLevel === 5
                      ? "Explicitly Request Level 6 (Full Walkthrough)"
                      : `Need more help? Unlock Level ${activeLevel + 1}`}
                  </span>
                  <ChevronRight className="w-4 h-4 text-emerald-400" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">Select a level above to load guidance.</div>
        )}
      </div>
    </div>
  );
};
