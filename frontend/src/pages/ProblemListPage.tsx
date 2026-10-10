import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { problemService } from "../services/problem.service";
import { Problem, Topic } from "../types";
import { Badge } from "../components/common/Badge";
import { Search, Filter, CheckCircle2, ChevronRight, Code2, Sparkles } from "lucide-react";

export const ProblemListPage: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    problemService.listTopics().then((res) => setTopics(res)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    problemService
      .listProblems({
        difficulty: selectedDifficulty !== "all" ? selectedDifficulty : undefined,
        topic: selectedTopic !== "all" ? selectedTopic : undefined,
        search: searchQuery.trim() || undefined
      })
      .then((res) => setProblems(res))
      .catch((err) => console.error("Problem list error:", err))
      .finally(() => setLoading(false));
  }, [selectedDifficulty, selectedTopic, searchQuery]);

  const difficulties = ["all", "Easy", "Medium", "Hard"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Interview Problem Bank</h1>
          <p className="text-xs text-slate-400">
            22 realistic technical interview problems covering Arrays to Dynamic Programming.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {problems.length} Problems Available
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-4 rounded-xl backdrop-blur">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems by title or concept..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Difficulty Buttons */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            {difficulties.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                  selectedDifficulty === d
                    ? "bg-slate-800 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {d === "all" ? "All" : d}
              </button>
            ))}
          </div>

          {/* Topic Dropdown */}
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition"
          >
            <option value="all">All Topics</option>
            {topics.map((t) => (
              <option key={t.id} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Problems Table / List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs">Loading problem bank...</p>
        </div>
      ) : problems.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-xl">
          <Code2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-400">No problems match your current filter criteria.</p>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-sm backdrop-blur">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">Status</th>
                  <th className="py-3.5 px-4">Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Difficulty</th>
                  <th className="py-3.5 px-4 text-center">Socratic Hints</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {problems.map((prob) => (
                  <tr
                    key={prob.id}
                    className="hover:bg-slate-800/40 transition duration-150 group"
                  >
                    <td className="py-3.5 px-4 text-center">
                      {prob.userStatus === "Accepted" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-700 block mx-auto"></span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <Link
                        to={`/problems/${prob.slug}`}
                        className="font-medium text-white group-hover:text-emerald-400 transition"
                      >
                        {prob.title}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60 font-mono text-[11px]">
                        {prob.topic?.name || "General"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          prob.difficulty.toLowerCase() === "easy"
                            ? "easy"
                            : prob.difficulty.toLowerCase() === "medium"
                            ? "medium"
                            : "hard"
                        }
                      >
                        {prob.difficulty}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-400">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400/90 font-mono">
                        <Sparkles className="w-3 h-3" /> 5 Levels
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/problems/${prob.slug}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 transition font-medium text-[11px]"
                      >
                        <span>Solve</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
