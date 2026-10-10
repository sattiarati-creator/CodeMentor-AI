import React from "react";
import Editor from "@monaco-editor/react";
import { RotateCcw, Terminal } from "lucide-react";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onReset: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, onReset }) => {
  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-l border-slate-800">
      {/* Editor Toolbar */}
      <div className="h-10 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-200">Python 3.11</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400">Docker Isolated</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-1 hover:text-slate-200 transition text-[11px]"
            title="Reset code to default template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Monaco Editor Canvas */}
      <div className="flex-1 w-full min-h-0">
        <Editor
          height="100%"
          language="python"
          theme="vs-dark"
          value={code}
          onChange={(val) => onChange(val || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'Fira Code', monospace",
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            padding: { top: 12, bottom: 12 },
            suggestOnTriggerCharacters: true
          }}
        />
      </div>
    </div>
  );
};
