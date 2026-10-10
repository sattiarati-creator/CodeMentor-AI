import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { analyticsService } from "../services/analytics.service";
import { DashboardData } from "../types";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import {
  CheckCircle,
  Flame,
  Percent,
  BarChart,
  Code2,
  ArrowRight,
  Sparkles,
  Trophy,
  AlertCircle,
  Clock,
  Compass
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from "recharts";

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    analyticsService
      .getDashboard()
      .then((res) => setData(res))
      .catch((err) => console.error("Dashboard error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs">Computing interview analytics & Learning DNA...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <p className="text-slate-400">Unable to load dashboard data. Please log in or try again.</p>
      </div>
    );
  }

  const { metrics, learningDna, companyReadiness, recentSubmissions, recommendedProblem } = data;

  // Chart data formatting
  const chartData = learningDna.topics.map((t) => ({
    name: t.topicName,
    score: t.masteryScore
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Placement Intelligence Dashboard</h1>
          <p className="text-xs text-slate-400">
            Real-time algorithmic mastery, practice consistency, and estimated readiness benchmarks.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/roadmap"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
          >
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>Active Roadmap</span>
          </Link>
          <Link
            to="/problems"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-lg shadow-sm shadow-emerald-500/20 flex items-center gap-1.5 transition"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Practice Problems</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Problems Solved</span>
            <span className="text-xl font-bold text-white tracking-tight">{metrics.problemsSolved}</span>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Total Submissions</span>
            <span className="text-xl font-bold text-white tracking-tight">{metrics.totalSubmissions}</span>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Acceptance Rate</span>
            <span className="text-xl font-bold text-white tracking-tight">{metrics.acceptanceRate}%</span>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Daily Streak</span>
            <span className="text-xl font-bold text-white tracking-tight">{metrics.currentStreakDays} days</span>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5 col-span-2 lg:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Learning DNA</span>
            <span className="text-xl font-bold text-white tracking-tight">{metrics.overallMasteryScore}/100</span>
          </div>
        </Card>
      </div>

      {/* Recommended Next Problem Banner */}
      {recommendedProblem && (
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                AI Adaptive Recommendation
              </span>
              <span className="text-xs text-slate-400">Targeting weakest topic: {recommendedProblem.topic?.name}</span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">{recommendedProblem.title}</h3>
            <p className="text-xs text-slate-400">
              Reinforce fundamental invariants and improve your {recommendedProblem.topic?.name} mastery.
            </p>
          </div>
          <Link
            to={`/problems/${recommendedProblem.slug}`}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition flex-shrink-0 shadow-lg shadow-emerald-500/20"
          >
            <span>Solve Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Middle Row: Learning DNA Chart + Strong/Weak Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Topic Mastery Bar Chart */}
        <Card
          className="lg:col-span-2"
          title="Learning DNA Topic Mastery Breakdown"
          action={
            <Link to="/learning-dna" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
              <span>Detailed Breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                />
                <YAxis domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "8px", fontSize: "12px" }}
                  itemStyle={{ color: "#22c55e" }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.score >= 75 ? "#22c55e" : entry.score >= 55 ? "#eab308" : "#f43f5e"}
                    />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-500 italic mt-2">
            Scores dynamically reflect problem completion, difficulty weight, hint usage, and retry efficiency.
          </p>
        </Card>

        {/* Strong vs Weak Cards */}
        <div className="space-y-6">
          <Card title="Strongest Areas">
            <div className="space-y-3">
              {learningDna.strongestTopics.map((top) => (
                <div key={top.topicId} className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/60">
                  <span className="font-semibold text-white">{top.topicName}</span>
                  <Badge variant="easy">{top.masteryScore}%</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Critical Knowledge Gaps">
            <div className="space-y-3">
              {learningDna.weakestTopics.map((top) => (
                <div key={top.topicId} className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/60">
                  <div>
                    <span className="font-semibold text-rose-300 block">{top.topicName}</span>
                    <span className="text-[10px] text-slate-500">Needs conceptual practice</span>
                  </div>
                  <Badge variant="danger">{top.masteryScore}%</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Row: Company Readiness Benchmarks + Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Readiness */}
        <Card
          className="lg:col-span-2"
          title="Company Preparation Benchmarks"
          action={
            <Link to="/company-readiness" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {companyReadiness.map((comp) => (
              <div
                key={comp.company}
                className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 text-center space-y-1.5"
              >
                <span className="text-xs font-semibold text-slate-300 block">{comp.company}</span>
                <div className="text-2xl font-extrabold text-white">
                  {comp.estimatedPreparationScore}
                  <span className="text-xs text-slate-500 font-normal">/100</span>
                </div>
                <Badge
                  variant={
                    comp.tier === "High Readiness"
                      ? "success"
                      : comp.tier === "Moderate Readiness"
                      ? "warning"
                      : "danger"
                  }
                  className="text-[10px]"
                >
                  {comp.tier}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] text-slate-500">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>Estimated preparation score based on DSA syllabus coverage. NOT an official hiring prediction.</span>
          </div>
        </Card>

        {/* Recent Submissions */}
        <Card title="Recent Submissions">
          {recentSubmissions && recentSubmissions.length > 0 ? (
            <div className="space-y-3">
              {recentSubmissions.map((sub: any) => (
                <div key={sub.id} className="pb-2.5 border-b border-slate-800/60 text-xs flex items-center justify-between">
                  <div>
                    <Link
                      to={`/problems/${sub.problem?.slug}`}
                      className="font-medium text-slate-200 hover:text-emerald-400 transition block truncate max-w-[140px]"
                    >
                      {sub.problem?.title}
                    </Link>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(sub.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Badge variant={sub.verdict === "Accepted" ? "success" : "danger"}>
                    {sub.verdict}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-4 italic text-center">No submissions yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
};
