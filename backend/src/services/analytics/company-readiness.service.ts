import { prisma } from "../../config/database";

export interface CompanyReadinessProfile {
  company: string;
  estimatedPreparationScore: number; // 0 to 100
  tier: "High Readiness" | "Moderate Readiness" | "Foundational Stage";
  primaryFocusAreas: string[];
  breakdown: Record<string, number>;
  disclaimer: string;
}

export class CompanyReadinessService {
  // Topic weights per company focus
  private companyFocusWeights: Record<string, Record<string, number>> = {
    Google: {
      graphs: 0.25,
      "dynamic-programming": 0.25,
      trees: 0.20,
      "binary-search": 0.15,
      arrays: 0.15
    },
    Microsoft: {
      trees: 0.25,
      "linked-list": 0.20,
      strings: 0.20,
      arrays: 0.20,
      stack: 0.15
    },
    Amazon: {
      arrays: 0.20,
      hashing: 0.20,
      trees: 0.20,
      "two-pointers": 0.20,
      graphs: 0.20
    },
    Meta: {
      "two-pointers": 0.25,
      "sliding-window": 0.25,
      trees: 0.20,
      arrays: 0.15,
      "binary-search": 0.15
    },
    Atlassian: {
      hashing: 0.25,
      arrays: 0.25,
      queue: 0.20,
      stack: 0.15,
      graphs: 0.15
    },
    Adobe: {
      arrays: 0.25,
      strings: 0.25,
      "dynamic-programming": 0.20,
      trees: 0.15,
      "two-pointers": 0.15
    }
  };

  async getCompanyReadiness(userId: string): Promise<CompanyReadinessProfile[]> {
    const userScores = await prisma.companyScore.findMany({
      where: { userId }
    });

    // If records exist in DB, return them
    const companies = ["Google", "Microsoft", "Amazon", "Meta", "Atlassian", "Adobe"];
    const profiles: CompanyReadinessProfile[] = [];

    const userDna = await prisma.learningDNA.findMany({
      where: { userId },
      include: { topic: true }
    });

    const dnaMap = new Map<string, number>();
    for (const d of userDna) {
      dnaMap.set(d.topic.slug, d.masteryScore);
    }

    for (const comp of companies) {
      const dbEntry = userScores.find((s) => s.companyName === comp);
      let score: number;
      let breakdown: Record<string, number> = {};

      if (dbEntry && dbEntry.score > 0) {
        score = dbEntry.score;
        breakdown = (dbEntry.breakdown as Record<string, number>) || {};
      } else {
        // Calculate dynamic weighted score
        const weights = this.companyFocusWeights[comp] || { arrays: 0.5, strings: 0.5 };
        let weightedSum = 0;
        let totalWeight = 0;

        for (const [topicSlug, weight] of Object.entries(weights)) {
          const mastery = dnaMap.get(topicSlug) || 35; // baseline
          weightedSum += mastery * weight;
          totalWeight += weight;
          breakdown[topicSlug] = Math.round(mastery);
        }

        score = totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 10) / 10 : 50;
      }

      let tier: CompanyReadinessProfile["tier"] = "Foundational Stage";
      if (score >= 75) tier = "High Readiness";
      else if (score >= 60) tier = "Moderate Readiness";

      const focusAreas = Object.keys(this.companyFocusWeights[comp] || {}).slice(0, 3);

      profiles.push({
        company: comp,
        estimatedPreparationScore: score,
        tier,
        primaryFocusAreas: focusAreas,
        breakdown,
        disclaimer:
          "Estimated preparation score reflects historical DSA topic coverage and problem completion metrics. This is NOT a prediction or guarantee of actual hiring or selection."
      });
    }

    return profiles;
  }
}

export const companyReadinessService = new CompanyReadinessService();
