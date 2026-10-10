import request from "supertest";
import app from "../app";

describe("Submissions API Integration Tests", () => {
  let authToken: string;
  let testProblemId: string;

  beforeAll(async () => {
    // Login with demo user
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "demo@codementor.ai",
        password: "Password123!"
      });

    authToken = loginRes.body.data.token;

    // Get a valid problem ID
    const probRes = await request(app).get("/api/problems/target-sum-pair-finder");
    testProblemId = probRes.body.data.id;
  });

  test("POST /api/code/run executes custom code without login", async () => {
    const res = await request(app)
      .post("/api/code/run")
      .send({
        code: "import sys\nline = sys.stdin.read().strip()\nprint(f'Echo: {line}')",
        language: "python",
        input: "CodeMentor"
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.output.trim()).toBe("Echo: CodeMentor");
  });

  test("POST /api/submissions submits code, evaluates test cases, and stores verdict", async () => {
    // Correct solution for Target Sum Pair Finder
    const correctCode = `
import sys

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
    target = int(lines[0])
    nums = [int(x) for x in lines[1:]]
    
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            print(f"{seen[complement]} {i}")
            return
        seen[num] = i
    print("-1")

if __name__ == '__main__':
    solve()
`;

    const res = await request(app)
      .post("/api/submissions")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        problemId: testProblemId,
        code: correctCode,
        language: "python",
        hintsUsed: 0
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.submissionId).toBeDefined();
    expect(res.body.data.verdict).toBe("Accepted");
    expect(res.body.data.passedTestCases).toBeGreaterThan(0);
  });

  test("GET /api/submissions returns user submission history", async () => {
    const res = await request(app)
      .get("/api/submissions")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].verdict).toBeDefined();
  });
});
