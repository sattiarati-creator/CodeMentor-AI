import React, { useEffect, useState } from "react";
import { companyService } from "../services/company.service";
import { CompanyReadinessProfile } from "../types";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import {
  Trophy,
  ShieldAlert,
  CheckCircle,
  Building2,
  TrendingUp,
  Info,
  Sparkles
} from "lucide-react";

export const CompanyReadinessPage: React.FC = () => {
  const [profiles, setProfiles] = useState<CompanyReadinessProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    companyService
      .getReadiness()
      .then((res) => setProfiles(res))
      .catch((err) => console.error("Company readiness error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs">Evaluating company syllabus coverage and benchmark scores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Placement Benchmark Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Company Readiness Scores</h1>
          <p className="text-xs text-slate-400">
            Estimated algorithmic preparation scores benchmarked against target tech company interview patterns.
          </p>
        </div>
      </div>

      {/* Mandatory Prominent Disclaimer Banner */}
      <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-5 flex items-start gap-3.5 text-xs text-amber-200/90 leading-relaxed">
        <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block mb-0.5">Objective Preparation Estimate</span>
          <p className="text-amber-300/80">
            These metrics represent an <strong>Estimated Preparation Score</strong> calculated strictly from your DSA topic coverage, solved difficulty tiers, and hint independence. They are <strong>NOT a prediction or guarantee of actual hiring or selection</strong> at any company.
          </p>
        </div>
      </div>

      {/* 6 Company Benchmark Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <Card key={profile.company} className="space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white">
                  <Building2 className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base tracking-tight">{profile.company}</h3>
                  <span className="text-[11px] text-slate-400">Interview Benchmark</span>
                </div>
              </div>

              <Badge
                variant={
                  profile.tier === "High Readiness"
                    ? "success"
                    : profile.tier === "Moderate Readiness"
                    ? "warning"
                    : "danger"
                }
              >
                {profile.tier}
              </Badge>
            </div>

            {/* Score Metric */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                  Estimated Preparation
                </span>
                <div className="text-3xl font-extrabold text-white">
                  {profile.estimatedPreparationScore}
                  <span className="text-xs text-slate-500 font-normal"> / 100</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Syllabus Coverage</span>
                <span className="text-xs font-semibold text-emerald-400">
                  {profile.estimatedPreparationScore >= 75 ? "Strong" : "In Progress"}
                </span>
              </div>
            </div>

            {/* Primary Focus Areas */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                High-Frequency Interview Topics:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {profile.primaryFocusAreas.map((topic, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-1 rounded-md bg-slate-850 text-slate-300 text-[11px] border border-slate-800 capitalize"
                  >
                    {topic.replace("-", " ")}
                  </span>
                ))}
              </div>
            </div>

            {/* Topic Weights Breakdown */}
            {profile.breakdown && Object.keys(profile.breakdown).length > 0 && (
              <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Weighted Topic Mastery:
                </span>
                {Object.entries(profile.breakdown).slice(0, 3).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 capitalize">{key.replace("-", " ")}</span>
                    <span className="font-mono text-slate-200">{val}%</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
