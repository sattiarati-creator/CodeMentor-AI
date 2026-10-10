-- CodeMentor AI - PostgreSQL Seed Data
-- Run this in psql or pgAdmin: \i seed.sql

-- Topics
INSERT INTO topics (id, name, slug, description, "order") VALUES
('top-1', 'Arrays', 'arrays', 'Array manipulation, prefix sums, contiguous subarrays, and in-place transformations.', 1),
('top-2', 'Strings', 'strings', 'Character traversal, palindromes, substring matching, and string reconstruction.', 2),
('top-3', 'Hashing', 'hashing', 'Hash tables, frequency maps, set lookups, and fast O(1) membership checks.', 3),
('top-4', 'Two Pointers', 'two-pointers', 'Opposite ends, fast/slow runners, and sorted array boundary narrowing.', 4),
('top-5', 'Sliding Window', 'sliding-window', 'Dynamic and fixed-size windows for subarray/substring optimization.', 5),
('top-6', 'Stack', 'stack', 'LIFO parsing, monotonic stacks, bracket balancing, and nested expression evaluation.', 6),
('top-7', 'Queue', 'queue', 'FIFO buffering, double-ended queues, sliding maximums, and breadth traversals.', 7),
('top-8', 'Linked List', 'linked-list', 'Pointer mutations, cycle detection, list merging, and dummy node techniques.', 8),
('top-9', 'Binary Search', 'binary-search', 'Logarithmic search on sorted arrays, monotonic answer spaces, and rotated arrays.', 9),
('top-10', 'Trees', 'trees', 'Binary trees, binary search trees (BST), traversals, invariants, and recursion.', 10),
('top-11', 'Graphs', 'graphs', 'Adjacency lists, DFS, BFS, topological sorting, connected components, and cycles.', 11),
('top-12', 'Dynamic Programming', 'dynamic-programming', 'Optimal substructure, overlapping subproblems, memoization, and bottom-up DP tables.', 12)
ON CONFLICT (slug) DO NOTHING;

-- Demo User (Password: Password123!)
INSERT INTO users (id, email, name, password_hash, role) VALUES
('usr-demo-1', 'demo@codementor.ai', 'Alex Chen (Placement Candidate)', '$2a$10$7Z8q2t6qBwzX7wA0s5YF7.kL3sM6W2E4T6Y8U0I2O4P6A8S0D2F4G', 'student')
ON CONFLICT (email) DO NOTHING;
