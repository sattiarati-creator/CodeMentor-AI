# CodeMentor AI — Technical Interview Preparation & Architecture Guide

This document is engineered specifically to help you ace your campus placement and technical interviews at top-tier companies (Google, Microsoft, Amazon, Meta, Atlassian, Adobe). Every answer is grounded in the actual codebase implementation of **CodeMentor AI**.

---

## 1. 60-Second Elevator Pitch

> "Traditional coding practice platforms only tell students 'Accepted' or 'Wrong Answer', leaving them stranded when they fail. I built **CodeMentor AI**, an adaptive coding coach and interview intelligence platform that teaches students *how to think* rather than just giving away answers.
> 
> The platform features:
> 1. An **Online Judge** that safely executes code in isolated Docker containers with CPU/memory limits and network isolation.
> 2. A **Socratic Hint Engine** with 5 progressive levels—prompting intuition, patterns, and invariants without spoiling solutions.
> 3. A **Why-Did-I-Fail Analyzer** that pinpoints root causes, edge cases, and algorithmic complexity gaps.
> 4. A **Learning DNA Engine** that calculates transparent 0–100 topic mastery across 12 DSA categories, detecting knowledge gaps and generating adaptive 4-week study roadmaps.
> 
> The stack is built using React, TypeScript, Tailwind CSS, Monaco Editor, Express, PostgreSQL with Prisma ORM, Redis caching, and Docker."

---

## 2. 2-Minute Deep-Dive Explanation

> "When preparing for technical interviews, candidates often suffer from 'tutorial hell' or memorizing solutions. When an edge case fails, they immediately look at the discussion tab.
> 
> In **CodeMentor AI**, we separate **Execution Truth** from **AI Guidance**:
> 
> First, for execution, user code is never run directly on the host server. The backend coordinates an execution harness that spawns an ephemeral Docker container (`python:3.11-alpine`) running as a non-root user (`UID 1001`), with disabled networking (`--network none`), a 128MB RAM limit, 0.5 CPU shares, and a 3-second hard timeout. It evaluates the code across public sample cases and hidden test cases, returning standardized verdicts: `Accepted`, `Wrong Answer`, `Time Limit Exceeded`, `Runtime Error`, or `Compilation Error`.
> 
> Second, if a submission fails, rather than rewriting the user's code, our **Socratic AI Engine** steps in. A student can unlock progressive hints: Level 1 clarifies problem requirements; Level 2 guides pattern recognition; Level 3 suggests data structures; Level 4 provides loop invariants; and Level 5 gives structured pseudocode. Our **Why-Did-I-Fail Analyzer** contrasts the student's output against the oracle, categorizes the bug pattern (e.g. boundary condition, null dereference, unhandled duplicates), and contrasts estimated time complexity (e.g., $O(N^2)$) with the target optimal complexity ($O(N)$).
> 
> Finally, every submission updates the candidate's **Learning DNA**. Using a transparent mathematical heuristic based on solve ratios, difficulty weighting, hint penalties, and retry counts, the platform generates estimated preparation scores for companies like Google and Amazon, and synthesizes a tailored 4-week roadmap linked directly to target problems in our 22-problem curriculum."

---

## 3. Architecture Deep-Dive

```
[ Browser / Monaco Editor ]
          |
     (REST / JWT)
          v
[ Express.js API Gateway ] <---> [ Redis Cache / In-Memory Fallback ]
          |
  +-------+-------+-------------------+
  |               |                   |
  v               v                   v
[ Auth & Data ] [ AI Socratic Engine ] [ Online Judge Coordinator ]
  |               |                   |
  v               |                   v
[ PostgreSQL ]    |            +---------------------------------+
  (Prisma ORM)    |            | Ephemeral Docker Sandbox        |
                  |            | - python:3.11-alpine            |
                  |            | - Non-root sandbox user (1001)  |
                  |            | - --network none                |
                  |            | - Memory: 128MB | CPU: 0.5      |
                  |            | - 3000ms Hard Timeout           |
                  |            +---------------------------------+
                  v
       [ LLM Prompt Pipeline ]
       (Prompts in /prompts)
```

---

## 4. Key Architectural & Technology Choices

### Why PostgreSQL?
1. **Relational Integrity**: Problems, test cases, submissions, topics, hints, and users are intrinsically relational. Foreign key constraints with cascading deletes ensure zero orphaned data.
2. **ACID Transactions**: Financial-grade consistency when recording submissions, updating Learning DNA mastery scores, and persisting user session state.
3. **JSONB Support**: Allows storing semi-structured test case examples and detailed failure analysis diagnostics without requiring unnecessary database tables.
4. **Prisma ORM**: Provides end-to-end type safety, migration versioning, and eliminates SQL injection vulnerabilities via parameterized queries.

### Why Redis?
1. **Sub-millisecond Problem Retrieval**: Frequently accessed problem bank statements and topic lists are cached with configurable TTLs, drastically reducing database load.
2. **Rate Limiting**: Protects expensive LLM and execution endpoints from abuse or denial-of-service.
3. **Resilience Pattern**: Our implementation features an automatic, non-crashing in-memory cache fallback so local development and offline environments run seamlessly even if Redis is not started.

### Why Docker for Code Execution?
1. **Zero-Trust Sandbox**: Running arbitrary user code on a host Node.js server is a severe vulnerability (e.g., `os.system("rm -rf /")` or reading environment secrets).
2. **Resource Constraints**: Docker enforces Linux cgroups for strict memory limits (128MB) and CPU quotas (0.5 vCPU).
3. **Network Isolation**: By invoking `--network none`, malicious submissions cannot execute SSRF attacks, connect to internal cloud metadata endpoints, or open reverse shells.
4. **Disposable Lifecycle**: Containers are ephemeral and automatically destroyed (`--rm`) post-execution.

### Why Node.js & TypeScript?
1. **Asynchronous Non-Blocking I/O**: Ideal for handling concurrent HTTP requests while delegating heavy execution workloads to external container processes.
2. **Full-Stack Type Sharing**: Common interfaces for problem models, execution verdicts, and submission results across both backend controllers and frontend React components.

---

## 5. Security Architecture

1. **Password Security**: Passwords are never stored in plain text. They are salted and hashed using `bcryptjs` with 10 salt rounds.
2. **Authentication**: Stateless JSON Web Tokens (JWT) signed with secret keys and configurable expiration (`7d`). Protected endpoints require valid Bearer tokens.
3. **Input Validation**: Strict schema enforcement using `zod` prevents malformed payloads, payload injection, and oversized submissions before hitting business logic.
4. **Defense in Depth**:
   - HTTP security headers via `helmet`.
   - Rate limiting via `express-rate-limit` on authentication and execution routes.
   - Secrets managed exclusively via `.env` files; `.env.example` templates committed without secrets.

---

## 6. Mathematical Heuristic: Learning DNA

We deliberately avoid pseudoscientific "AI mind-reading" claims. The Learning DNA topic mastery ($M \in [0, 100]$) is calculated transparently:

$$\text{SolveRatio} = \min\left(1.0, \frac{\text{Solved}}{\max(1, \text{Attempted})}\right)$$

$$\text{Base} = \text{SolveRatio} \times 65$$

$$\text{VolumeBonus} = \min(25, \text{Solved} \times 5)$$

$$\text{HintPenalty} = \min(15, \text{HintsUsed} \times 1.5)$$

$$\text{RetryPenalty} = \min(15, \max(0, \text{Retries} - \text{Solved}) \times 1.0)$$

$$\text{Mastery} = \text{clamp}(0, 100, \text{Base} + \text{VolumeBonus} - \text{HintPenalty} - \text{RetryPenalty})$$

This model rewards both accuracy and volume, while penalizing reliance on hints and brute-force retries.

---

## 7. 30 Frequently Asked Interview Questions & Model Answers

### Category A: Architecture & System Design
**Q1: How do you prevent arbitrary code execution from compromising the host server?**
*Answer*: We never invoke `eval()` or run code directly in the Node.js process. We write the submission to a temporary directory and execute it inside an unprivileged Docker container running as user `1001` with `--network none`, a 128MB memory cap, 0.5 CPU shares, and a 3-second timeout. Even if a user executes malicious scripts, they are confined to a disposable container with no network access or write permissions to the host.

**Q2: How does the system handle infinite loops in user code like `while True: pass`?**
*Answer*: The execution runner wraps the process in a strict timer (`3000ms`). If the timeout expires before completion, the process or container is forcefully killed with `SIGKILL`, and the Online Judge assigns the verdict `Time Limit Exceeded`.

**Q3: How do you measure memory consumption and execution runtime accurately?**
*Answer*: In our Python harness (`judge/runner.py`), we use `time.perf_counter()` for sub-millisecond wall-clock timing and Python's `tracemalloc` to track peak heap allocations during the execution of compiled byte-code. In Linux/Docker production environments, cgroups memory accounting verifies container limits.

**Q4: How do you normalize and compare test case outputs?**
*Answer*: Stdin and stdout often have subtle differences in trailing whitespace and newline representations (`\r\n` on Windows vs `\n` on Linux). Our judge normalizes outputs by stripping trailing line whitespace, standardizing line breaks to `\n`, and trimming leading/trailing blank lines before checking exact string equality.

**Q5: Why did you choose Monaco Editor over simpler textarea or Ace editor?**
*Answer*: Monaco is the actual code editor that powers VS Code. It provides native syntax highlighting, bracket matching, indentation rules, and line numbering out of the box, offering students an authentic IDE experience mirroring modern coding interviews.

**Q6: What happens if Docker is not installed or the Docker daemon is down during local development?**
*Answer*: We built a resilient runner strategy pattern (`IJudgeRunner`). The `JudgeService` detects if the Docker daemon is accessible; if not, it gracefully switches to an isolated local Python runner with process-level timeouts and temporary directory sandboxing, ensuring development and tests never break.

**Q7: How is Redis integrated and what happens if Redis fails?**
*Answer*: Redis caches frequently fetched problem statements and enforces rate limits. We wrapped our client in a fallback adapter that automatically routes cache operations to an in-memory `Map` with TTL expiration if Redis is unavailable, avoiding crash loops.

**Q8: How do you prevent denial-of-service via huge print outputs like `while True: print("A")`?**
*Answer*: In `judge/runner.py`, stdout output is buffered in memory and capped at 64KB (`MAX_OUTPUT_BYTES = 65536`). If the output exceeds 64KB, it is safely truncated with a warning notice, preventing disk or memory exhaustion.

**Q9: How is the database organized to prevent data anomalies?**
*Answer*: We follow Third Normal Form (3NF). We have separate tables for `topics`, `problems`, `test_cases`, `submissions`, `hints`, `learning_dna`, `roadmaps`, `roadmap_items`, and `company_scores`. Cascading foreign keys (`ON DELETE CASCADE`) ensure that deleting a problem cleanly purges its test cases and hints.

**Q10: Why did you separate sample test cases from hidden test cases?**
*Answer*: In technical interviews and online assessments (like LeetCode or HackerRank), candidates are given 1-2 sample test cases to verify basic logic, but grading is conducted against hidden private cases to test edge boundaries, constraints, and time complexity.

---

### Category B: AI & Socratic Pedagogy
**Q11: Why is a Socratic hint engine better than simply generating an AI code fix?**
*Answer*: Giving a student the code teaches dependency, not problem-solving. In real interviews, interviewers never give code; they offer Socratic hints (e.g. "What data structure gives O(1) lookup?"). Our 5-tier hint engine simulates this exact interviewer dynamic.

**Q12: Where are LLM prompts stored and why?**
*Answer*: All prompts are stored as external template files in `prompts/` (e.g., `socratic-hint.prompt.txt`, `debug-tutor.prompt.txt`). This separates prompt engineering from controller logic, makes prompts version-controllable, and allows independent tuning without code refactoring.

**Q13: How does the AI know not to spoil the solution at Level 1 or 2?**
*Answer*: The system prompt explicitly enforces strict negative constraints: "Do NOT provide the solution code. Level 1 must only clarify problem expectations; Level 2 must prompt pattern recognition."

**Q14: What if an external LLM API key is not configured? Does the app break?**
*Answer*: No. The AI service includes a rule-based deterministic fallback engine. For every problem and hint level, it returns structured, pedagogical hints and failure diagnostics, ensuring the app remains 100% operational for evaluation and offline demonstrations.

**Q15: How does the "Why-Did-I-Fail" Analyzer work?**
*Answer*: When the judge records a non-accepted verdict, the analyzer compares the problem constraints, failing test case, expected output, and student output. It synthesizes a structured JSON report identifying the probable bug category (e.g., integer overflow, unhandled duplicates, off-by-one), lists 3 edge cases to check, and compares current complexity with target optimal complexity.

**Q16: How do you address AI hallucinations in code evaluation?**
*Answer*: We never ask the AI whether code is correct. The **Online Judge** deterministically runs test cases and issues verdicts. The AI is strictly restricted to diagnostic explanation and hints, and every AI response carries an explicit disclaimer noting that the judge is the source of truth.

**Q17: How is the 4-week Personalized Roadmap generated?**
*Answer*: The roadmap engine queries the user's `learning_dna` records, identifies the 3-4 topics with the lowest mastery scores, and creates sequential weekly modules linked directly to practice problems in those weak topics.

**Q18: What is the Company Readiness score and how is it calculated?**
*Answer*: Different companies emphasize different topics (e.g., Google emphasizes Graphs and DP; Microsoft emphasizes Trees and Linked Lists; Amazon emphasizes Arrays, Hashing, and Trees). We apply company-specific topic weights to the candidate's mastery scores, presenting the result as an "Estimated Preparation Score", never a hiring probability.

**Q19: How do you protect against prompt injection in user code?**
*Answer*: Code inputs are treated strictly as literal data strings interpolated into demarcated code blocks (` ```python `) within the prompt template, and output formats require structured JSON schemas.

**Q20: How do you ensure low latency on AI requests?**
*Answer*: Hints for seeded problems are pre-cached in PostgreSQL's `hints` table. When requested, they are served immediately with sub-10ms database lookups. Only dynamically personalized requests hit the LLM endpoint.

---

### Category C: Backend, Database & Scaling
**Q21: How do you protect against SQL injection?**
*Answer*: We use Prisma ORM, which generates parameterized queries for all database interactions. User inputs are never concatenated directly into raw SQL strings.

**Q22: How is authentication implemented securely?**
*Answer*: We use bcrypt with 10 salt rounds to hash passwords before database storage. Upon successful authentication, we issue an HMAC-SHA256 signed JWT containing the user ID, email, and role. The token is verified via Express middleware on every protected route.

**Q23: How do you handle database migrations?**
*Answer*: We manage database schema changes using Prisma migrations (`prisma migrate dev` / `prisma migrate deploy`), which generate versioned SQL migration scripts that can be safely applied across development, staging, and production environments.

**Q24: How would you scale the Online Judge to handle 10,000 concurrent submissions?**
*Answer*: Running Docker containers synchronously on the web server would exhaust resources. To scale:
1. Defer submission requests to a distributed message queue (e.g., Redis BullMQ, RabbitMQ, or AWS SQS).
2. Create an autoscaling pool of isolated worker nodes running container engines (e.g. AWS ECS or Kubernetes with gVisor / Firecracker microVMs).
3. Workers pick up jobs, execute them, write verdicts to PostgreSQL, and notify clients via WebSockets or Server-Sent Events (SSE).

**Q25: Why did you include OpenAPI/Swagger documentation?**
*Answer*: High code quality requires transparent documentation. Our Swagger endpoint at `/api/docs` documents every endpoint, required headers, request payloads, response schemas, and error codes according to the OpenAPI 3.0 standard.

**Q26: How do you manage secrets between development and production?**
*Answer*: Secrets are loaded via environment variables using `dotenv`. We commit `.env.example` templates with empty placeholders and strictly exclude `.env*` files in `.gitignore`. In production, secrets are injected via Docker Compose or Kubernetes secrets.

**Q27: How is CORS configured?**
*Answer*: We use Express `cors` middleware with explicit origin control (`CORS_ORIGIN`), allowed HTTP methods (`GET, POST, PUT, DELETE, OPTIONS`), and allowed headers (`Content-Type, Authorization`), preventing unauthorized cross-origin requests.

**Q28: How do you handle centralized error handling in Express?**
*Answer*: All controller errors are routed to a central error handling middleware (`errorHandler`). In development, error messages and stack traces are logged to console; in production, sensitive stack traces are omitted to prevent information disclosure.

**Q29: How did you design the automated testing strategy?**
*Answer*: We use Jest with `ts-jest`. Tests cover:
1. **Judge Execution**: Verifying correct output, syntax errors, zero division runtime errors, and output comparison.
2. **Learning DNA**: Checking boundary scores (0 and 100), volume bonuses, and hint/retry deductions.
3. **AI Services**: Verifying Socratic progressive level generation and structured failure reports.

**Q30: What are the main limitations of the current MVP, and what would you build next?**
*Answer*:
- **Current Limitations**: The MVP focuses on Python execution; judge execution runs locally or via single-host Docker rather than a distributed worker queue.
- **Next Enhancements**:
  1. Add Java and C++ compilers using containerized compilation stages.
  2. Implement BullMQ job queues for distributed asynchronous judging.
  3. Integrate WebSockets for real-time live test case streaming.
  4. Implement Firecracker microVMs for cloud-scale execution isolation.
