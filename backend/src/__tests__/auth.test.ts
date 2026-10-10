import request from "supertest";
import app from "../app";
import { prisma } from "../config/database";

describe("Authentication API Integration Tests", () => {
  const testUser = {
    name: "Test Developer",
    email: `test-${Date.now()}@codementor.ai`,
    password: "Password123!"
  };

  afterAll(async () => {
    try {
      await prisma.user.deleteMany({
        where: { email: { contains: "@codementor.ai" }, NOT: { email: "demo@codementor.ai" } }
      });
    } catch {}
  });

  test("POST /api/auth/register successfully registers a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.passwordHash).toBeUndefined(); // Security: never expose hash
  });

  test("POST /api/auth/register rejects duplicate email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("already exists");
  });

  test("POST /api/auth/login succeeds with valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(testUser.email);
  });

  test("POST /api/auth/login rejects invalid password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: "WrongPassword123"
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test("GET /api/auth/me returns profile for authenticated user", async () => {
    // First login to get token
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password
      });

    const token = loginRes.body.data.token;

    const meRes = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.data.user.email).toBe(testUser.email);
    expect(meRes.body.data.user.name).toBe(testUser.name);
  });

  test("GET /api/auth/me returns 401 without token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
