import request from "supertest";
import app from "../app";

describe("AI Service Input Validation Tests", () => {
  test("POST /api/ai/hint rejects missing problemTitle", async () => {
    const res = await request(app)
      .post("/api/ai/hint")
      .send({
        hintLevel: 1
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("Validation error");
  });

  test("POST /api/ai/hint rejects hintLevel outside 1-6 range", async () => {
    const res = await request(app)
      .post("/api/ai/hint")
      .send({
        problemTitle: "Binary Search",
        hintLevel: 10
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /api/ai/debug rejects empty studentCode", async () => {
    const res = await request(app)
      .post("/api/ai/debug")
      .send({
        problemTitle: "Two Sum",
        studentCode: ""
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("POST /api/ai/analyze-failure rejects missing verdict", async () => {
    const res = await request(app)
      .post("/api/ai/analyze-failure")
      .send({
        problemTitle: "Target Sum"
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
