import React from "react";
import { BrainCircuit, Github, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 py-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <BrainCircuit className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-white tracking-tight">CodeMentor AI</span>
            </div>
            <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
              Adaptive Coding Coach & Placement Intelligence. Built to teach how to think through Socratic hints, real containerized execution, and transparent Learning DNA analytics.
            </p>
          </div>
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/problems" className="hover:text-emerald-400 transition">Curated Problems</a></li>
              <li><a href="/dashboard" className="hover:text-emerald-400 transition">Performance Dashboard</a></li>
              <li><a href="/learning-dna" className="hover:text-emerald-400 transition">Learning DNA Analytics</a></li>
              <li><a href="/company-readiness" className="hover:text-emerald-400 transition">Company Benchmarks</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Technical Architecture</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="http://localhost:5000/api/docs" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition">REST API Docs (Swagger)</a></li>
              <li><span className="text-slate-500">Dockerized Sandbox Judge</span></li>
              <li><span className="text-slate-500">PostgreSQL + Prisma ORM</span></li>
              <li><span className="text-slate-500">Socratic Hint Engine</span></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CodeMentor AI. Academic & Campus Placement Capstone Project.</p>
          <div className="flex items-center gap-1">
            <span>Engineered with rigor & passion for interview excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
