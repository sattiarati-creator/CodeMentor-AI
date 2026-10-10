import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { problemService } from "../services/problem.service";
import { codeService } from "../services/code.service";
import { Problem, RunResult, SubmitResult } from "../types";
import { ProblemView } from "../components/workspace/ProblemView";
import { CodeEditor } from "../components/workspace/CodeEditor";
import { ConsoleOutput } from "../components/workspace/ConsoleOutput";
import { SocraticHintDrawer } from "../components/workspace/SocraticHintDrawer";
import { FailureAnalysisModal } from "../components/workspace/FailureAnalysisModal";
import { DebugAssistantDrawer } from "../components/workspace/DebugAssistantDrawer";
import { useAuth } from "../context/AuthContext";

export const CodingWorkspacePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState<string>("");
  const [customInput, setCustomInput] = useState<string>("");
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hintsUsedCount, setHintsUsedCount] = useState<number>(0);

  // Modals & Drawers state
  const [isHintsOpen, setIsHintsOpen] = useState<boolean>(false);
  const [isFailureAnalysisOpen, setIsFailureAnalysisOpen] = useState<boolean>(false);
  const [isDebugTutorOpen, setIsDebugTutorOpen] = useState<boolean>(false);
  const [loadingProblem, setLoadingProblem] = useState<boolean>(true);

  useEffect(() => {
    if (!slug) return;
    setLoadingProblem(true);
    problemService
      .getProblem(slug)
      .then((p: Problem) => {
        setProblem(p);
        setCode(p.starterCode);
        if (p.testCases && p.testCases.length > 0) {
          setCustomInput(p.testCases[0].input);
        }
      })
      .catch((err: any) => {
        console.error("Failed to fetch problem:", err);
      })
      .finally(() => setLoadingProblem(false));
  }, [slug]);

  const handleRun = async () => {
    if (!code) return;
    setIsRunning(true);
    try {
      const res = await codeService.runCode(code, customInput);
      setRunResult(res);
    } catch (err: any) {
      setRunResult({
        status: "RUNTIME_ERROR",
        output: "",
        error: err.response?.data?.message || err.message,
        runtime_ms: 0,
        memory_kb: 0
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem || !code) return;
    if (!user) {
      navigate("/login");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await codeService.submitCode(problem.id, code, hintsUsedCount);
      setSubmitResult(res);
    } catch (err: any) {
      alert("Submission failed: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetCode = () => {
    if (problem && window.confirm("Reset code back to original starter template?")) {
      setCode(problem.starterCode);
    }
  };

  if (loadingProblem) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs">Loading coding workspace & Docker judge harness...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <p className="text-slate-400">Problem not found.</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-slate-950">
      {/* Split Workspace Area */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Left Panel: Problem Statement */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full border-r border-slate-800 bg-slate-950/80">
          <ProblemView problem={problem} onOpenHints={() => setIsHintsOpen(true)} />
        </div>

        {/* Right Panel: Code Editor + Console Output */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col min-h-0 bg-slate-950">
          {/* Top half: Monaco Code Editor */}
          <div className="flex-1 min-h-[45%]">
            <CodeEditor code={code} onChange={setCode} onReset={handleResetCode} />
          </div>

          {/* Bottom half: Execution Console & Submission Verdicts */}
          <div className="h-[55%] min-h-[220px]">
            <ConsoleOutput
              customInput={customInput}
              setCustomInput={setCustomInput}
              runResult={runResult}
              submitResult={submitResult}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
              onRun={handleRun}
              onSubmit={handleSubmit}
              onOpenFailureAnalysis={() => setIsFailureAnalysisOpen(true)}
              onOpenDebugTutor={() => setIsDebugTutorOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Socratic Hint Drawer */}
      <SocraticHintDrawer
        isOpen={isHintsOpen}
        onClose={() => setIsHintsOpen(false)}
        problem={problem}
        studentCode={code}
        onHintUnlocked={(lvl: number) => setHintsUsedCount(Math.max(hintsUsedCount, lvl))}
      />

      {/* Failure Analysis Modal */}
      <FailureAnalysisModal
        isOpen={isFailureAnalysisOpen}
        onClose={() => setIsFailureAnalysisOpen(false)}
        problem={problem}
        submitResult={submitResult}
        studentCode={code}
      />

      {/* Debug Assistant Drawer */}
      <DebugAssistantDrawer
        isOpen={isDebugTutorOpen}
        onClose={() => setIsDebugTutorOpen(false)}
        problem={problem}
        studentCode={code}
        testInput={customInput}
        actualOutput={runResult?.output || runResult?.error || submitResult?.firstFailedTestCase?.actualOutput || ""}
        expectedOutput={submitResult?.firstFailedTestCase?.expectedOutput || ""}
      />
    </div>
  );
};
