import request from "supertest";
import app from "../app";

describe("Problem Bank API Integration Tests", () => {
  test("GET /api/problems returns list of seeded problems", async () => {
    const res = await request(app).get("/api/problems");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(20);
  });

  test("GET /api/problems with difficulty filter returns only matching problems", async () => {
    const res = await request(app).get("/api/problems?difficulty=Easy");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    for (const p of res.body.data) {
      expect(p.difficulty).toBe("Easy");
    }
  });

  test("GET /api/problems/:slug returns full problem details with sample test cases", async () => {
    const res = await request(app).get("/api/problems/target-sum-pair-finder");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Target Sum Pair Finder");
    expect(res.body.data.difficulty).toBe("Easy");
    expect(res.body.data.starterCode).toBeDefined();
    expect(Array.isArray(res.body.data.testCases)).toBe(true);
    // Hidden test cases must NOT be exposed in the public problem details
    for (const tc of res.body.data.testCases) {
      expect(tc.isSample).toBe(true);
    }
  });

  test("GET /api/problems/non-existent-problem returns 404", async () => {
    const res = await request(app).get("/api/problems/non-existent-xyz-slug");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
