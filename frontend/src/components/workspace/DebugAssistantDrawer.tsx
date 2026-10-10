import React, { useState } from "react";
import { Problem, DebugResponse } from "../../types";
import { aiService } from "../../services/ai.service";
import { Bug, CheckSquare, HelpCircle } from "lucide-react";
import { Badge } from "../common/Badge";

interface DebugAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem;
  studentCode: string;
  testInput: string;
  actualOutput: string;
  expectedOutput: string;
}

export const DebugAssistantDrawer: React.FC<DebugAssistantDrawerProps> = ({
  isOpen,
  onClose,
  problem,
  studentCode,
  testInput,
  actualOutput,
  expectedOutput
}) => {
  const [debugData, setDebugData] = useState<DebugResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRequestDebug = async () => {
    setLoading(true);
    try {
      const res = await aiService.getDebugGuidance({
        problemTitle: problem.title,
        problemDescription: problem.description,
        studentCode,
        testInput,
        expectedOutput,
        actualOutput
      });
      setDebugData(res);
    } catch (err) {
      console.error("Debug request failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // If not loaded yet, initiate fetch
  if (!debugData && !loading) {
    handleRequestDebug();
  }

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Bug className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">Interactive Debug Tutor</h3>
            <p className="text-[11px] text-slate-400">Targeted invariant & boundary inspection</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition text-xs"
        >
          Close
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
        {loading ? (
          <div className="h-48 flex flex-col items-center justify-center gap-3 text-slate-400">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p>Analyzing code invariants and boundary limits...</p>
          </div>
        ) : debugData ? (
          <div className="space-y-4">
            {/* Category */}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                Detected Bug Pattern
              </span>
              <Badge variant="warning" className="text-xs py-1 px-2.5">
                {debugData.likelyCategory}
              </Badge>
            </div>

            {/* Guidance */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 leading-relaxed whitespace-pre-line text-slate-200">
              {debugData.guidance}
            </div>

            {/* Questions to consider */}
            <div>
              <h4 className="font-semibold text-white flex items-center gap-1.5 mb-2">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Mental Invariant Checks
              </h4>
              <div className="space-y-2">
                {debugData.questionsToConsider.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg flex items-start gap-2 text-slate-300"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Inspection */}
            <div className="p-3.5 bg-amber-950/20 border border-amber-500/20 rounded-xl">
              <span className="font-semibold text-amber-300 block mb-1">Recommended Inspection</span>
              <p className="text-slate-300">{debugData.suggestedCheck}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            Click to analyze code for potential bug hotspots.
          </div>
        )}
      </div>
    </div>
  );
};
