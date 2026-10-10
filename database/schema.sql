-- CodeMentor AI - PostgreSQL Database Schema
-- Run this in psql or pgAdmin: \i schema.sql

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS topics (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    "order" INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS problems (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    difficulty VARCHAR(20) NOT NULL, -- 'Easy', 'Medium', 'Hard'
    description TEXT NOT NULL,
    input_format TEXT NOT NULL,
    output_format TEXT NOT NULL,
    constraints TEXT NOT NULL,
    examples JSONB NOT NULL DEFAULT '[]',
    starter_code TEXT NOT NULL,
    topic_id VARCHAR(36) REFERENCES topics(id) ON DELETE CASCADE,
    "order" INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS test_cases (
    id VARCHAR(36) PRIMARY KEY,
    problem_id VARCHAR(36) REFERENCES problems(id) ON DELETE CASCADE,
    input TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_sample BOOLEAN DEFAULT FALSE,
    explanation TEXT
);

CREATE TABLE IF NOT EXISTS submissions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    problem_id VARCHAR(36) REFERENCES problems(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    language VARCHAR(50) DEFAULT 'python',
    verdict VARCHAR(50) NOT NULL,
    runtime_ms FLOAT,
    memory_kb FLOAT,
    passed_test_cases INT DEFAULT 0,
    total_test_cases INT DEFAULT 0,
    failed_case_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hints (
    id VARCHAR(36) PRIMARY KEY,
    problem_id VARCHAR(36) REFERENCES problems(id) ON DELETE CASCADE,
    level INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    CONSTRAINT unique_problem_hint_level UNIQUE (problem_id, level)
);

CREATE TABLE IF NOT EXISTS learning_dna (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    topic_id VARCHAR(36) REFERENCES topics(id) ON DELETE CASCADE,
    mastery_score FLOAT DEFAULT 0.0,
    problems_attempted INT DEFAULT 0,
    problems_solved INT DEFAULT 0,
    hints_used_count INT DEFAULT 0,
    retries_count INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_topic_dna UNIQUE (user_id, topic_id)
);

CREATE TABLE IF NOT EXISTS roadmaps (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    target_company VARCHAR(100),
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roadmap_items (
    id VARCHAR(36) PRIMARY KEY,
    roadmap_id VARCHAR(36) REFERENCES roadmaps(id) ON DELETE CASCADE,
    topic_id VARCHAR(36) REFERENCES topics(id) ON DELETE CASCADE,
    week_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    target_problem_ids JSONB DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS company_scores (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(100) NOT NULL,
    score FLOAT DEFAULT 0.0,
    breakdown JSONB DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_company_score UNIQUE (user_id, company_name)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_problems_topic ON problems(topic_id);
CREATE INDEX IF NOT EXISTS idx_test_cases_problem ON test_cases(problem_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_problem ON submissions(problem_id);
CREATE INDEX IF NOT EXISTS idx_learning_dna_user ON learning_dna(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_roadmap ON roadmap_items(roadmap_id);
