import React, { useEffect, useState } from "react";
import { Modal } from "../common/Modal";
import { Problem, SubmitResult, FailureAnalysisResponse } from "../../types";
import { aiService } from "../../services/ai.service";
import { AlertTriangle, Clock, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "../common/Badge";

interface FailureAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem;
  submitResult: SubmitResult | null;
  studentCode: string;
}

export const FailureAnalysisModal: React.FC<FailureAnalysisModalProps> = ({
  isOpen,
  onClose,
  problem,
  submitResult,
  studentCode
}) => {
  const [analysis, setAnalysis] = useState<FailureAnalysisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && submitResult) {
      setLoading(true);
      const failedCase = submitResult.firstFailedTestCase;
      aiService
        .analyzeFailure({
          problemTitle: problem.title,
          difficulty: problem.difficulty,
          topic: problem.topic?.name || "Algorithms",
          studentCode,
          verdict: submitResult.verdict,
          failedInput: failedCase?.input || "",
          expectedOutput: failedCase?.expectedOutput || "",
          actualOutput: failedCase?.actualOutput || failedCase?.error || ""
        })
        .then((res) => {
          setAnalysis(res);
        })
        .catch((err) => {
          console.error("Failure analysis error:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, submitResult]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Why Did My Solution Fail?" maxWidth="xl">
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400">Diagnosing submission discrepancies & edge cases...</p>
        </div>
      ) : analysis ? (
        <div className="space-y-5 text-xs text-slate-300">
          {/* Ground Truth Verdict Header */}
          <div className="flex items-center justify-between p-3.5 bg-rose-950/20 border border-rose-500/30 rounded-xl">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-400 block">Judge Verdict</span>
                <span className="text-sm font-bold text-white">{analysis.result}</span>
              </div>
            </div>
            <Badge variant="danger">{submitResult?.verdict || "Failed"}</Badge>
          </div>

          {/* Root Cause Hypothesis */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Probable Root Cause
            </h4>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-200 leading-relaxed font-normal">
              {analysis.rootCause}
            </div>
          </div>

          {/* Edge Cases To Check */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
              Critical Edge Cases To Verify
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {analysis.edgeCasesToCheck.map((edge, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/60 border border-slate-800/80 p-2.5 rounded-lg flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
                  <span className="text-slate-300">{edge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Complexity Comparison */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" /> Computational Complexity Gap
            </h4>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Estimated Current</span>
                  <div className="font-mono font-bold text-amber-300 text-sm">
                    {analysis.complexityAnalysis.currentEstimatedTime}
                  </div>
                  <span className="text-[10px] text-slate-500">Space: {analysis.complexityAnalysis.currentEstimatedSpace}</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Target Optimal</span>
                  <div className="font-mono font-bold text-emerald-400 text-sm">
                    {analysis.complexityAnalysis.targetOptimalTime}
                  </div>
                  <span className="text-[10px] text-slate-500">Space: {analysis.complexityAnalysis.targetOptimalSpace}</span>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px] pt-1">
                {analysis.complexityAnalysis.explanation}
              </p>
            </div>
          </div>

          {/* Suggested Next Step */}
          <div className="p-3.5 bg-purple-950/20 border border-purple-500/20 rounded-xl flex items-start gap-2.5">
            <ArrowRight className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block mb-0.5">Immediate Next Step</span>
              <p className="text-slate-300">{analysis.suggestedNextStep}</p>
            </div>
          </div>

          {/* Ground truth disclaimer */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{analysis.disclaimer}</span>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-slate-400">
          No submission error data available to analyze.
        </div>
      )}
    </Modal>
  );
};
