import React from "react";
import { Link } from "react-router-dom";
import {
  BrainCircuit,
  Code2,
  Terminal,
  Sparkles,
  HelpCircle,
  BarChart3,
  MapPin,
  Trophy,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Cpu
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-emerald-400" />,
      title: "AI Socratic Hints",
      desc: "5 progressive levels that prompt you with intuition, patterns, and pseudocode instead of spoiling full solutions."
    },
    {
      icon: <Terminal className="w-6 h-6 text-sky-400" />,
      title: "Secure Docker Judge",
      desc: "Code executes in hardened, network-isolated containers with memory caps and hard timeouts for authentic interview feedback."
    },
    {
      icon: <HelpCircle className="w-6 h-6 text-purple-400" />,
      title: "Why-Did-I-Fail Analysis",
      desc: "Instant breakdown of output discrepancies, overlooked edge cases, and current vs. optimal complexity gaps."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-amber-400" />,
      title: "Learning DNA Analytics",
      desc: "Transparent 0–100 mastery tracking across 12 DSA topics factoring completion, hints used, and retry counts."
    },
    {
      icon: <MapPin className="w-6 h-6 text-indigo-400" />,
      title: "Personalized Study Roadmaps",
      desc: "Adaptive 4-week preparation progressions automatically generated based on identified knowledge gaps."
    },
    {
      icon: <Trophy className="w-6 h-6 text-rose-400" />,
      title: "Company Readiness Benchmarks",
      desc: "Objective estimated preparation scores for Google, Microsoft, Amazon, Meta, Atlassian, and Adobe."
    }
  ];

  return (
    <div className="space-y-24 py-12 md:py-20">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Campus Placement Intelligence Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          CodeMentor <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">AI</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Learn how to think, debug, and succeed in coding interviews.
        </p>

        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto italic">
          "Traditional platforms tell you 'Accepted' or 'Wrong Answer'. CodeMentor AI teaches you why your solution failed and what concept to strengthen next."
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to={user ? "/problems" : "/register"}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-xl hover:opacity-90 transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
          >
            <span>Start Coding</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/problems"
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold rounded-xl border border-slate-800 transition flex items-center justify-center gap-2"
          >
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>View Problem Bank</span>
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Designed for Rigorous Interview Preparation
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Everything you need to build genuine algorithmic intuition without cognitive reliance on spoiler solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur space-y-3 hover:border-slate-700 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center">
                {feat.icon}
              </div>
              <h3 className="text-base font-semibold text-white">{feat.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture Deep Dive */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Transparent Engineering
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ground Truth Online Judge + Guided Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              We separate algorithmic execution from explanation. Code correctness is verified deterministically by our containerized runner; AI serves as a pedagogical mentor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <Cpu className="w-4 h-4 text-emerald-400" /> Docker Sandbox
              </div>
              <p className="text-xs text-slate-400">
                Executes user code with strictly capped resources, network isolation, and sub-millisecond timer tracking.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <BrainCircuit className="w-4 h-4 text-purple-400" /> Socratic Engine
              </div>
              <p className="text-xs text-slate-400">
                Step-by-step guidance prompts your reasoning, helping you identify data structures and invariants independently.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <ShieldCheck className="w-4 h-4 text-sky-400" /> Transparent DNA
              </div>
              <p className="text-xs text-slate-400">
                Objective heuristics factor problem difficulty, hints used, and retry counts — clearly explained in the UI.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
