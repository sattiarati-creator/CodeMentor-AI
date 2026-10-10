import subprocess
import tempfile
import os
import json

def test():
    with tempfile.NamedTemporaryFile("w", delete=False, suffix=".py") as f:
        f.write("import sys\nname = sys.stdin.read().strip()\nprint(f'Hello {name}!')\n")
        code_file = f.name

    with tempfile.NamedTemporaryFile("w", delete=False, suffix=".txt") as inp:
        inp.write("CodeMentor\n")
        inp_file = inp.name

    try:
        proc = subprocess.run(
            ["python", "runner.py", code_file, inp_file],
            capture_output=True,
            text=True
        )
        print("Runner test output:", proc.stdout.strip())
        data = json.loads(proc.stdout.strip())
        assert data["status"] == "SUCCESS"
        assert data["output"].strip() == "Hello CodeMentor!"
        print("Runner test passed successfully!")
    finally:
        os.unlink(code_file)
        os.unlink(inp_file)

if __name__ == "__main__":
    test()
