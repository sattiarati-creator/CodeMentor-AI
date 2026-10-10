export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation: string;
}

export interface ProblemTestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isSample: boolean;
  explanation?: string;
}

export interface ProblemHint {
  level: number;
  title: string;
  content?: string;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  examples: ProblemExample[];
  starterCode: string;
  topicId: string;
  topic?: Topic;
  testCases?: ProblemTestCase[];
  hints?: ProblemHint[];
  totalTestCases?: number;
  totalHints?: number;
  userStatus?: string;
}

export interface TestCaseEvaluation {
  testCaseIndex: number;
  isSample: boolean;
  passed: boolean;
  verdict: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  runtimeMs: number;
  memoryKb: number;
  error?: string;
}

export interface RunResult {
  status: "SUCCESS" | "RUNTIME_ERROR" | "COMPILATION_ERROR" | "TIMEOUT";
  output: string;
  error?: string;
  runtime_ms: number;
  memory_kb: number;
  verdict?: string;
}

export interface SubmitResult {
  submissionId: string;
  verdict: "Accepted" | "Wrong Answer" | "Time Limit Exceeded" | "Runtime Error" | "Compilation Error";
  passedTestCases: number;
  totalTestCases: number;
  runtimeMs: number;
  memoryKb: number;
  testCaseResults: TestCaseEvaluation[];
  firstFailedTestCase?: TestCaseEvaluation | null;
}

export interface SocraticHintResponse {
  level: number;
  title: string;
  content: string;
  isAiGenerated: boolean;
}

export interface DebugResponse {
  likelyCategory: string;
  guidance: string;
  questionsToConsider: string[];
  suggestedCheck: string;
}

export interface FailureAnalysisResponse {
  result: string;
  rootCause: string;
  edgeCasesToCheck: string[];
  complexityAnalysis: {
    currentEstimatedTime: string;
    currentEstimatedSpace: string;
    targetOptimalTime: string;
    targetOptimalSpace: string;
    explanation: string;
  };
  suggestedNextStep: string;
  disclaimer: string;
}

export interface TopicMasteryDetail {
  topicId: string;
  topicName: string;
  topicSlug: string;
  masteryScore: number;
  problemsAttempted: number;
  problemsSolved: number;
  hintsUsedCount: number;
  retriesCount: number;
  status: "Mastered" | "Proficient" | "Needs Practice" | "Critical Gap";
  prerequisites: string[];
  recommendedProblems?: Array<{ id: string; title: string; difficulty: string; slug: string }>;
}

export interface LearningDnaSummary {
  overallScore: number;
  methodology: string;
  topics: TopicMasteryDetail[];
  strongestTopics: TopicMasteryDetail[];
  weakestTopics: TopicMasteryDetail[];
  criticalGaps: Array<{ topic: string; score: number; advice: string; prerequisites: string[] }>;
}

export interface CompanyReadinessProfile {
  company: string;
  estimatedPreparationScore: number;
  tier: "High Readiness" | "Moderate Readiness" | "Foundational Stage";
  primaryFocusAreas: string[];
  breakdown: Record<string, number>;
  disclaimer: string;
}

export interface RoadmapItem {
  id: string;
  weekNumber: number;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  topic: Topic;
  problems?: Array<{ id: string; title: string; difficulty: string; slug: string }>;
}

export interface Roadmap {
  id: string;
  title: string;
  targetCompany?: string;
  summary?: string;
  items: RoadmapItem[];
}

export interface DashboardData {
  metrics: {
    problemsSolved: number;
    totalSubmissions: number;
    acceptanceRate: number;
    currentStreakDays: number;
    overallMasteryScore: number;
  };
  learningDna: LearningDnaSummary;
  companyReadiness: CompanyReadinessProfile[];
  recentSubmissions: any[];
  recommendedProblem: any;
}
