import { learningDnaService } from "../services/analytics/learning-dna.service";

describe("Learning DNA Analytics Service", () => {
  test("calculates 0 mastery score for 0 attempts", () => {
    const score = learningDnaService.calculateMasteryScore(0, 0, 0, 0);
    expect(score).toBe(0);
  });

  test("calculates high mastery score for perfect solves without hints", () => {
    // 5 attempts, 5 solved, 0 hints, 5 retries (or 0 extra retries)
    const score = learningDnaService.calculateMasteryScore(5, 5, 0, 5);
    // base: 65, volume: 25, hints: 0, retries: 0 => 90
    expect(score).toBeGreaterThanOrEqual(85);
  });

  test("deducts score appropriately for hints and excessive retries", () => {
    const highHintScore = learningDnaService.calculateMasteryScore(5, 5, 8, 15);
    const lowHintScore = learningDnaService.calculateMasteryScore(5, 5, 0, 5);
    expect(highHintScore).toBeLessThan(lowHintScore);
  });

  test("clamps scores strictly within [0, 100]", () => {
    const clampedMax = learningDnaService.calculateMasteryScore(100, 100, 0, 0);
    expect(clampedMax).toBeLessThanOrEqual(100);

    const clampedMin = learningDnaService.calculateMasteryScore(10, 0, 50, 50);
    expect(clampedMin).toBeGreaterThanOrEqual(0);
  });
});
