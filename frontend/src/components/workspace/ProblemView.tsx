import React from "react";
import { Problem } from "../../types";
import { Badge } from "../common/Badge";
import { BookOpen, AlertCircle, CheckCircle, Lightbulb } from "lucide-react";

interface ProblemViewProps {
  problem: Problem;
  onOpenHints: () => void;
}

export const ProblemView: React.FC<ProblemViewProps> = ({ problem, onOpenHints }) => {
  const getDifficultyVariant = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "easy":
        return "easy";
      case "medium":
        return "medium";
      case "hard":
        return "hard";
      default:
        return "neutral";
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6 text-slate-300 text-sm leading-relaxed">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={getDifficultyVariant(problem.difficulty)}>{problem.difficulty}</Badge>
          {problem.topic && (
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/60 font-medium">
              {problem.topic.name}
            </span>
          )}
          {problem.userStatus === "Accepted" && (
            <Badge variant="success" className="gap-1">
              <CheckCircle className="w-3 h-3" /> Solved
            </Badge>
          )}
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">{problem.title}</h1>
      </div>

      {/* Socratic Hint Quick Button */}
      <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-emerald-300">Stuck or need approach guidance?</h4>
            <p className="text-[11px] text-slate-400">Unlock progressive Socratic hints without spoiling the answer.</p>
          </div>
        </div>
        <button
          onClick={onOpenHints}
          className="px-3 py-1.5 bg-emerald-500 text-slate-950 text-xs font-semibold rounded-lg hover:bg-emerald-400 transition"
        >
          View Hints
        </button>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Description
        </h3>
        <div className="whitespace-pre-line text-slate-200 text-[13px] leading-relaxed">
          {problem.description}
        </div>
      </div>

      {/* Input / Output Formats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
          <h4 className="text-xs font-semibold text-slate-300 mb-1.5">Input Format</h4>
          <p className="text-xs text-slate-400 whitespace-pre-line font-mono">{problem.inputFormat}</p>
        </div>
        <div className="bg-slate-900/60 p-3.5 rounded-lg border border-slate-800">
          <h4 className="text-xs font-semibold text-slate-300 mb-1.5">Output Format</h4>
          <p className="text-xs text-slate-400 whitespace-pre-line font-mono">{problem.outputFormat}</p>
        </div>
      </div>

      {/* Constraints */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Constraints
        </h3>
        <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800/80 font-mono text-xs text-amber-200/90 whitespace-pre-line">
          {problem.constraints}
        </div>
      </div>

      {/* Examples */}
      {problem.examples && problem.examples.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Examples</h3>
          {problem.examples.map((ex, idx) => (
            <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-slate-400">Example {idx + 1}:</span>
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-0.5">Input:</span>
                <pre className="bg-slate-950 p-2 rounded text-xs font-mono text-emerald-300 overflow-x-auto">{ex.input}</pre>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-0.5">Output:</span>
                <pre className="bg-slate-950 p-2 rounded text-xs font-mono text-sky-300 overflow-x-auto">{ex.output}</pre>
              </div>
              {ex.explanation && (
                <div className="pt-1">
                  <span className="text-xs font-semibold text-slate-400 block mb-0.5">Explanation:</span>
                  <p className="text-xs text-slate-300">{ex.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
