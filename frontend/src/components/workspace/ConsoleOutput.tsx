import React, { useState } from "react";
import { RunResult, SubmitResult } from "../../types";
import { Badge } from "../common/Badge";
import { Play, Send, CheckCircle2, XCircle, Clock, Cpu, HelpCircle, Bug, Sparkles } from "lucide-react";

interface ConsoleOutputProps {
  customInput: string;
  setCustomInput: (val: string) => void;
  runResult: RunResult | null;
  submitResult: SubmitResult | null;
  isRunning: boolean;
  isSubmitting: boolean;
  onRun: () => void;
  onSubmit: () => void;
  onOpenFailureAnalysis: () => void;
  onOpenDebugTutor: () => void;
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  customInput,
  setCustomInput,
  runResult,
  submitResult,
  isRunning,
  isSubmitting,
  onRun,
  onSubmit,
  onOpenFailureAnalysis,
  onOpenDebugTutor
}) => {
  const [activeTab, setActiveTab] = useState<"input" | "run" | "submit">("input");

  return (
    <div className="flex flex-col h-full bg-slate-950 border-t border-slate-800 text-xs">
      {/* Top Header & Action Controls */}
      <div className="h-12 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("input")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "input" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Custom Input
          </button>
          <button
            onClick={() => setActiveTab("run")}
            className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 ${
              activeTab === "run" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Run Output {runResult && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
          </button>
          <button
            onClick={() => setActiveTab("submit")}
            className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 ${
              activeTab === "submit" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Submission {submitResult && <span className="w-2 h-2 rounded-full bg-sky-400"></span>}
          </button>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRun}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg transition disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isRunning ? "Running..." : "Run Code"}</span>
          </button>
          <button
            onClick={onSubmit}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-lg shadow-sm shadow-emerald-500/20 transition disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Judging..." : "Submit"}</span>
          </button>
        </div>
      </div>

      {/* Main Console Tab Body */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === "input" && (
          <div className="h-full flex flex-col">
            <label className="text-[11px] font-semibold text-slate-400 mb-1.5 block">
              Standard Input (stdin):
            </label>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Paste input here to test your solution..."
              className="w-full flex-1 bg-slate-900 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>
        )}

        {activeTab === "run" && (
          <div className="space-y-3">
            {!runResult && !isRunning && (
              <p className="text-slate-500 italic py-4">Click "Run Code" to test against custom input.</p>
            )}

            {isRunning && (
              <div className="flex items-center gap-2 text-slate-400 py-4">
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Executing solution in Docker sandbox...</span>
              </div>
            )}

            {runResult && (
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-[11px] text-slate-400 pb-2 border-b border-slate-800">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {runResult.runtime_ms} ms
                  </span>
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-slate-400" /> {runResult.memory_kb} KB
                  </span>
                  <Badge variant={runResult.status === "SUCCESS" ? "success" : "danger"}>
                    {runResult.status}
                  </Badge>
                </div>

                {runResult.output && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">Standard Output:</span>
                    <pre className="bg-slate-900 p-3 rounded-lg font-mono text-slate-200 overflow-x-auto whitespace-pre-wrap">
                      {runResult.output}
                    </pre>
                  </div>
                )}

                {runResult.error && (
                  <div>
                    <span className="text-[11px] font-semibold text-rose-400 block mb-1">Traceback / Error:</span>
                    <pre className="bg-rose-950/20 border border-rose-900/40 p-3 rounded-lg font-mono text-rose-300 overflow-x-auto whitespace-pre-wrap">
                      {runResult.error}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "submit" && (
          <div className="space-y-4">
            {!submitResult && !isSubmitting && (
              <p className="text-slate-500 italic py-4">Submit your code to execute against all stored test suites.</p>
            )}

            {isSubmitting && (
              <div className="flex items-center gap-2 text-slate-400 py-4">
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Executing test suites in Docker container...</span>
              </div>
            )}

            {submitResult && (
              <div className="space-y-4">
                {/* Verdict Banner */}
                <div
                  className={`p-4 rounded-xl border flex items-center justify-between ${
                    submitResult.verdict === "Accepted"
                      ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400"
                      : "bg-rose-950/20 border-rose-500/30 text-rose-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {submitResult.verdict === "Accepted" ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <XCircle className="w-6 h-6" />
                    )}
                    <div>
                      <h4 className="text-base font-bold tracking-tight">{submitResult.verdict}</h4>
                      <p className="text-[11px] opacity-80">
                        Passed {submitResult.passedTestCases} of {submitResult.totalTestCases} test cases
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {submitResult.runtimeMs} ms
                    </span>
                    <span className="flex items-center gap-1">
                      <Cpu className="w-4 h-4" /> {submitResult.memoryKb} KB
                    </span>
                  </div>
                </div>

                {/* AI Failure Action Trigger */}
                {submitResult.verdict !== "Accepted" && (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <h5 className="font-semibold text-white flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-400" /> Why Did I Fail?
                      </h5>
                      <p className="text-slate-400 text-[11px]">
                        Get AI failure root cause diagnosis, edge cases to check, and time complexity gap.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={onOpenDebugTutor}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
                      >
                        <Bug className="w-3.5 h-3.5 text-amber-400" />
                        <span>Debug Guidance</span>
                      </button>
                      <button
                        onClick={onOpenFailureAnalysis}
                        className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Analyze Failure</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* First Failed Test Case Details */}
                {submitResult.firstFailedTestCase && (
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                      <span className="font-semibold text-rose-400">
                        Failed Test Case #{submitResult.firstFailedTestCase.testCaseIndex}
                      </span>
                      <Badge variant="danger">{submitResult.firstFailedTestCase.verdict}</Badge>
                    </div>

                    <div className="space-y-2 pt-1 text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold block mb-0.5">Input:</span>
                        <pre className="bg-slate-950 p-2 rounded text-emerald-300 font-mono overflow-x-auto">
                          {submitResult.firstFailedTestCase.input}
                        </pre>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block mb-0.5">Expected Output:</span>
                        <pre className="bg-slate-950 p-2 rounded text-sky-300 font-mono overflow-x-auto">
                          {submitResult.firstFailedTestCase.expectedOutput}
                        </pre>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block mb-0.5">Your Output:</span>
                        <pre className="bg-slate-950 p-2 rounded text-rose-300 font-mono overflow-x-auto">
                          {submitResult.firstFailedTestCase.actualOutput || "None"}
                        </pre>
                      </div>
                      {submitResult.firstFailedTestCase.error && (
                        <div>
                          <span className="text-rose-400 font-semibold block mb-0.5">Runtime Error:</span>
                          <pre className="bg-rose-950/30 p-2 rounded text-rose-300 font-mono overflow-x-auto">
                            {submitResult.firstFailedTestCase.error}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
