"""
CodeMentor AI - Secure Execution Harness
Executes user code against stdin, tracks runtime, memory, catches exceptions,
and emits a structured JSON report.
"""

import sys
import time
import tracemalloc
import io
import json

MAX_OUTPUT_BYTES = 65536  # 64 KB limit

def main():
    if len(sys.argv) < 2:
        print(json.dumps({
            "status": "ERROR",
            "error": "Usage: python runner.py <code_file> [input_file]"
        }))
        sys.exit(1)

    code_file = sys.argv[1]
    input_file = sys.argv[2] if len(sys.argv) > 2 else None

    # Prepare standard input
    if input_file:
        try:
            with open(input_file, "r", encoding="utf-8") as f:
                stdin_data = f.read()
            sys.stdin = io.StringIO(stdin_data)
        except Exception as e:
            print(json.dumps({
                "status": "ERROR",
                "error": f"Failed reading input file: {str(e)}"
            }))
            sys.exit(1)

    # Read user code
    try:
        with open(code_file, "r", encoding="utf-8") as f:
            user_code = f.read()
    except Exception as e:
        print(json.dumps({
            "status": "COMPILATION_ERROR",
            "error": f"Failed to read submission file: {str(e)}"
        }))
        sys.exit(1)

    # Compile check
    try:
        compiled_code = compile(user_code, "<solution>", "exec")
    except SyntaxError as e:
        print(json.dumps({
            "status": "COMPILATION_ERROR",
            "error": f"SyntaxError on line {e.lineno}: {e.msg}\n  {e.text or ''}".strip(),
            "runtime_ms": 0,
            "memory_kb": 0,
            "output": ""
        }))
        sys.exit(0)
    except Exception as e:
        print(json.dumps({
            "status": "COMPILATION_ERROR",
            "error": str(e),
            "runtime_ms": 0,
            "memory_kb": 0,
            "output": ""
        }))
        sys.exit(0)

    # Prepare stdout/stderr capture
    captured_stdout = io.StringIO()
    captured_stderr = io.StringIO()
    old_stdout = sys.stdout
    old_stderr = sys.stderr

    sys.stdout = captured_stdout
    sys.stderr = captured_stderr

    # Execution environment
    exec_globals = {
        "__name__": "__main__",
        "__doc__": None,
        "__package__": None,
    }

    start_time = time.perf_counter()
    tracemalloc.start()
    status = "SUCCESS"
    runtime_error_msg = ""

    try:
        exec(compiled_code, exec_globals)
    except SystemExit as e:
        pass
    except Exception as e:
        status = "RUNTIME_ERROR"
        import traceback
        tb_lines = traceback.format_exception(*sys.exc_info())
        # Filter internal frames to only show user code frame
        cleaned_tb = [l for l in tb_lines if "runner.py" not in l]
        runtime_error_msg = "".join(cleaned_tb).strip()
    finally:
        end_time = time.perf_counter()
        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()
        sys.stdout = old_stdout
        sys.stderr = old_stderr

    elapsed_ms = round((end_time - start_time) * 1000, 2)
    memory_kb = round(peak / 1024, 2)

    raw_output = captured_stdout.getvalue()
    if len(raw_output.encode("utf-8")) > MAX_OUTPUT_BYTES:
        raw_output = raw_output[:MAX_OUTPUT_BYTES] + "\n[Output truncated: Exceeded 64KB limit]"

    result = {
        "status": status,
        "output": raw_output,
        "error": runtime_error_msg,
        "runtime_ms": elapsed_ms,
        "memory_kb": memory_kb
    }

    print(json.dumps(result))

if __name__ == "__main__":
    main()
