import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { roadmapService } from "../services/roadmap.service";
import { Roadmap } from "../types";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import {
  Compass,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  Code2
} from "lucide-react";

export const RoadmapPage: React.FC = () => {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [targetCompany, setTargetCompany] = useState<string>("Google");

  useEffect(() => {
    roadmapService
      .getRoadmap()
      .then((res) => setRoadmap(res))
      .catch((err) => console.error("Roadmap fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const updated = await roadmapService.generateRoadmap(targetCompany);
      setRoadmap(updated);
    } catch (err) {
      console.error("Roadmap generation failed:", err);
    } finally {
      setGenerating(false);
    }
  };

  const companies = ["Google", "Microsoft", "Amazon", "Meta", "Atlassian", "Adobe", "General Placement"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Personalized Curriculum
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Adaptive Study Roadmap</h1>
          <p className="text-xs text-slate-400">
            4-week structured sprint tailored to your Learning DNA performance and target company.
          </p>
        </div>

        {/* Generate / Target Company Control */}
        <div className="flex items-center gap-2">
          <select
            value={targetCompany}
            onChange={(e) => setTargetCompany(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition"
          >
            {companies.map((c) => (
              <option key={c} value={c}>
                Target: {c}
              </option>
            ))}
          </select>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg shadow-sm shadow-emerald-500/20 transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${generating ? "animate-spin" : ""}`} />
            <span>{generating ? "Regenerating..." : "Regenerate Plan"}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs">Formulating adaptive preparation schedule...</p>
        </div>
      ) : roadmap ? (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-2 backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
              <Compass className="w-4 h-4" />
              <span>{roadmap.title}</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-normal">{roadmap.summary}</p>
          </div>

          {/* Weekly Progression Cards */}
          <div className="space-y-4">
            {roadmap.items.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur space-y-4 hover:border-slate-700 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-xs">
                      W{item.weekNumber}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base tracking-tight">{item.title}</h3>
                      <span className="text-[11px] text-slate-400">Core Topic: {item.topic?.name}</span>
                    </div>
                  </div>

                  <Badge
                    variant={
                      item.status === "completed"
                        ? "success"
                        : item.status === "in_progress"
                        ? "warning"
                        : "neutral"
                    }
                  >
                    {item.status === "in_progress" ? "Current Focus" : item.status}
                  </Badge>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

                {/* Linked Problems to Practice */}
                {item.problems && item.problems.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                      Recommended Practice Problems for this Week:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.problems.map((p) => (
                        <Link
                          key={p.id}
                          to={`/problems/${p.slug}`}
                          className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl hover:border-emerald-500/50 hover:bg-slate-950 transition flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Code2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span className="text-xs font-medium text-slate-200 group-hover:text-emerald-300 truncate">
                              {p.title}
                            </span>
                          </div>
                          <Badge
                            variant={
                              p.difficulty.toLowerCase() === "easy"
                                ? "easy"
                                : p.difficulty.toLowerCase() === "medium"
                                ? "medium"
                                : "hard"
                            }
                            className="text-[10px]"
                          >
                            {p.difficulty}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4">
          <Compass className="w-10 h-10 text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-semibold text-white text-base">No active study roadmap</h3>
            <p className="text-xs text-slate-400">
              Generate an adaptive 4-week preparation plan based on your current knowledge gaps.
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition"
          >
            Generate My Roadmap
          </button>
        </div>
      )}
    </div>
  );
};
