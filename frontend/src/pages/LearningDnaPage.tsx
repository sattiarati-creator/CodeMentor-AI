import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { analyticsService } from "../services/analytics.service";
import { LearningDnaSummary } from "../types";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import {
  Sparkles,
  Info,
  BookOpen,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  RotateCcw
} from "lucide-react";

export const LearningDnaPage: React.FC = () => {
  const [dna, setDna] = useState<LearningDnaSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    analyticsService
      .getLearningDna()
      .then((res) => setDna(res))
      .catch((err) => console.error("Learning DNA error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs">Computing Learning DNA topic mastery indices...</p>
        </div>
      </div>
    );
  }

  if (!dna) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <p className="text-slate-400">Unable to load Learning DNA. Please sign in or complete a problem.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Cognitive Mastery Profile
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Learning DNA Analysis</h1>
          <p className="text-xs text-slate-400">
            Algorithmic topic mastery and knowledge gap detection across 12 DSA disciplines.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 flex items-center gap-4">
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Aggregated DNA Index</span>
            <div className="text-2xl font-extrabold text-white">
              {dna.overallScore} <span className="text-xs text-purple-400 font-normal">/ 100</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Transparent Methodology Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-xs text-slate-300 space-y-2 backdrop-blur">
        <div className="flex items-center gap-2 font-semibold text-white">
          <Info className="w-4 h-4 text-emerald-400" />
          <span>Transparent Heuristic Scoring Methodology</span>
        </div>
        <p className="text-slate-400 leading-relaxed text-[11px]">{dna.methodology}</p>
        <div className="pt-2 flex flex-wrap gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Completion Ratio: +65 pts
          </span>
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-sky-400" /> Volume Bonus: Up to +25 pts
          </span>
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Hints Deductions: -1.5 pts/hint
          </span>
          <span className="flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" /> Retry Inefficiency: -1.0 pt/excess retry
          </span>
        </div>
      </div>

      {/* Knowledge Gap Detector (Critical Topics) */}
      {dna.criticalGaps.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Knowledge Gap Detector (Priority Areas)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dna.criticalGaps.map((gap, idx) => (
              <div
                key={idx}
                className="bg-rose-950/20 border border-rose-500/20 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">{gap.topic}</h3>
                  <Badge variant="danger">{gap.score}% Mastery</Badge>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{gap.advice}</p>

                {gap.prerequisites && gap.prerequisites.length > 0 && (
                  <div className="pt-2 border-t border-rose-900/40">
                    <span className="text-[10px] font-semibold text-rose-300 uppercase tracking-wider block mb-1.5">
                      Recommended Prerequisites to Review:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {gap.prerequisites.map((pre, pIdx) => (
                        <span
                          key={pIdx}
                          className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] border border-slate-800"
                        >
                          {pre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comprehensive 12-Topic Mastery Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>All DSA Topics In-Depth</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dna.topics.map((top) => (
            <Card key={top.topicId} className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">{top.topicName}</h3>
                  <span className="text-[10px] text-slate-500">
                    {top.problemsSolved} of {top.problemsAttempted} problems solved
                  </span>
                </div>
                <Badge
                  variant={
                    top.status === "Mastered"
                      ? "success"
                      : top.status === "Proficient"
                      ? "info"
                      : top.status === "Needs Practice"
                      ? "warning"
                      : "danger"
                  }
                >
                  {top.masteryScore}%
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      top.masteryScore >= 75
                        ? "bg-emerald-500"
                        : top.masteryScore >= 55
                        ? "bg-amber-500"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${top.masteryScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <div>
                  <span className="text-slate-500 block">Hints Used:</span>
                  <span className="font-semibold text-slate-300">{top.hintsUsedCount}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Retries:</span>
                  <span className="font-semibold text-slate-300">{top.retriesCount}</span>
                </div>
              </div>

              {/* Recommended Problems */}
              {top.recommendedProblems && top.recommendedProblems.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Practice Problems:
                  </span>
                  <div className="space-y-1.5">
                    {top.recommendedProblems.map((rp) => (
                      <Link
                        key={rp.id}
                        to={`/problems/${rp.slug}`}
                        className="text-xs text-slate-300 hover:text-emerald-400 transition flex items-center justify-between"
                      >
                        <span className="truncate max-w-[180px]">{rp.title}</span>
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
