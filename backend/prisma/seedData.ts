export interface SeedTopic {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
}

export interface SeedExample {
  input: string;
  output: string;
  explanation: string;
}

export interface SeedTestCase {
  input: string;
  expectedOutput: string;
  isSample: boolean;
  explanation?: string;
}

export interface SeedHint {
  level: number;
  title: string;
  content: string;
}

export interface SeedProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topicSlug: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  examples: SeedExample[];
  starterCode: string;
  testCases: SeedTestCase[];
  hints: SeedHint[];
  order: number;
}

export const topicsData: SeedTopic[] = [
  { id: "top-1", name: "Arrays", slug: "arrays", description: "Array manipulation, prefix sums, contiguous subarrays, and in-place transformations.", order: 1 },
  { id: "top-2", name: "Strings", slug: "strings", description: "Character traversal, palindromes, substring matching, and string reconstruction.", order: 2 },
  { id: "top-3", name: "Hashing", slug: "hashing", description: "Hash tables, frequency maps, set lookups, and fast O(1) membership checks.", order: 3 },
  { id: "top-4", name: "Two Pointers", slug: "two-pointers", description: "Opposite ends, fast/slow runners, and sorted array boundary narrowing.", order: 4 },
  { id: "top-5", name: "Sliding Window", slug: "sliding-window", description: "Dynamic and fixed-size windows for subarray/substring optimization.", order: 5 },
  { id: "top-6", name: "Stack", slug: "stack", description: "LIFO parsing, monotonic stacks, bracket balancing, and nested expression evaluation.", order: 6 },
  { id: "top-7", name: "Queue", slug: "queue", description: "FIFO buffering, double-ended queues, sliding maximums, and breadth traversals.", order: 7 },
  { id: "top-8", name: "Linked List", slug: "linked-list", description: "Pointer mutations, cycle detection, list merging, and dummy node techniques.", order: 8 },
  { id: "top-9", name: "Binary Search", slug: "binary-search", description: "Logarithmic search on sorted arrays, monotonic answer spaces, and rotated arrays.", order: 9 },
  { id: "top-10", name: "Trees", slug: "trees", description: "Binary trees, binary search trees (BST), traversals, invariants, and recursion.", order: 10 },
  { id: "top-11", name: "Graphs", slug: "graphs", description: "Adjacency lists, DFS, BFS, topological sorting, connected components, and cycles.", order: 11 },
  { id: "top-12", name: "Dynamic Programming", slug: "dynamic-programming", description: "Optimal substructure, overlapping subproblems, memoization, and bottom-up DP tables.", order: 12 },
];

export const problemsData: SeedProblem[] = [
  // 1. Two Sum Counterpart (Arrays & Hashing - Easy)
  {
    id: "prob-1",
    title: "Target Sum Pair Finder",
    slug: "target-sum-pair-finder",
    difficulty: "Easy",
    topicSlug: "hashing",
    description: "Given a list of integers `nums` and an integer `target`, return the 0-based indices of the two distinct numbers whose sum equals `target`.\n\nYou may assume that each input has exactly one valid solution, and you may not use the same element twice. Print the indices separated by a space in ascending order.",
    inputFormat: "First line contains the target integer. Second line contains space-separated integers representing nums.",
    outputFormat: "Print the two 0-based indices separated by a space.",
    constraints: "2 <= len(nums) <= 10^5\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nExactly one valid solution exists.",
    examples: [
      { input: "9\n2 7 11 15", output: "0 1", explanation: "nums[0] + nums[1] = 2 + 7 = 9" },
      { input: "6\n3 2 4", output: "1 2", explanation: "nums[1] + nums[2] = 2 + 4 = 6" }
    ],
    starterCode: `import sys

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
    target = int(lines[0])
    nums = [int(x) for x in lines[1:]]
    
    # Write your solution here:
    # Find two indices i and j such that nums[i] + nums[j] == target
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            print(f"{seen[diff]} {i}")
            return
        seen[num] = i

if __name__ == "__main__":
    solve()
`,
    testCases: [
      { input: "9\n2 7 11 15", expectedOutput: "0 1", isSample: true, explanation: "2 + 7 = 9" },
      { input: "6\n3 2 4", expectedOutput: "1 2", isSample: true, explanation: "2 + 4 = 6" },
      { input: "6\n3 3", expectedOutput: "0 1", isSample: false, explanation: "Duplicate numbers" },
      { input: "0\n-3 4 3 90", expectedOutput: "0 2", isSample: false, explanation: "Negative numbers sum to 0" }
    ],
    hints: [
      { level: 1, title: "Understand the Target Relation", content: "For any number x in the array, what exact second number do you need to complete the target sum?" },
      { level: 2, title: "Avoid O(N^2) Nested Loops", content: "If you check every pair with two nested loops, it takes O(N^2) time, which will exceed limits for 100,000 numbers. How can you remember numbers you have already visited?" },
      { level: 3, title: "Lookups via Hash Table", content: "Consider using a dictionary (hash map) to store each number and its index as you iterate through the list." },
      { level: 4, title: "Iteration Invariant", content: "For each element `num`, check if `target - num` already exists in your dictionary. If it does, you have found the pair! If not, store `num: currentIndex`." },
      { level: 5, title: "Structured Pseudocode", content: "seen = {}\nfor index, val in enumerate(nums):\n  complement = target - val\n  if complement in seen:\n    return seen[complement], index\n  seen[val] = index" }
    ],
    order: 1
  },

  // 2. Reverse Vowels of a String (Strings & Two Pointers - Easy)
  {
    id: "prob-2",
    title: "Reverse String Vowels",
    slug: "reverse-string-vowels",
    difficulty: "Easy",
    topicSlug: "two-pointers",
    description: "Given a string `s`, reverse only all the vowels in the string and return the modified string.\n\nThe vowels are 'a', 'e', 'i', 'o', and 'u', and they can appear in both lower and upper cases, more than once.",
    inputFormat: "A single line containing the string s.",
    outputFormat: "Print the string with vowels reversed.",
    constraints: "1 <= len(s) <= 3 * 10^5\ns consists of printable ASCII characters.",
    examples: [
      { input: "hello", output: "holle", explanation: "Vowels 'e' and 'o' are swapped." },
      { input: "leetcode", output: "leotcede", explanation: "Vowels 'e', 'e', 'o', 'e' reversed become 'e', 'o', 'e', 'e'." }
    ],
    starterCode: `import sys

def solve():
    s = sys.stdin.read().strip()
    if not s:
        return
    
    # Write your solution here:
    chars = list(s)
    vowels = set("aeiouAEIOU")
    left, right = 0, len(chars) - 1
    
    while left < right:
        while left < right and chars[left] not in vowels:
            left += 1
        while left < right and chars[right] not in vowels:
            right -= 1
        if left < right:
            chars[left], chars[right] = chars[right], chars[left]
            left += 1
            right -= 1
            
    print("".join(chars))

if __name__ == "__main__":
    solve()
`,
    testCases: [
      { input: "hello", expectedOutput: "holle", isSample: true },
      { input: "leetcode", expectedOutput: "leotcede", isSample: true },
      { input: "aA", expectedOutput: "Aa", isSample: false },
      { input: "xyz", expectedOutput: "xyz", isSample: false }
    ],
    hints: [
      { level: 1, title: "Identify Vowels", content: "Remember to include both uppercase and lowercase vowels ('a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U')." },
      { level: 2, title: "Pointers at Boundaries", content: "Think about starting one pointer from the start of the string and another from the end." },
      { level: 3, title: "Two Pointer Convergence", content: "Advance the left pointer until it hits a vowel. Decrement the right pointer until it hits a vowel. Then swap them." },
      { level: 4, title: "String Immutability in Python", content: "Strings are immutable in Python. Convert the string into a list of characters first, do in-place swaps, and join it back." },
      { level: 5, title: "Algorithm Breakdown", content: "left = 0, right = n-1\nwhile left < right:\n  while left < right and not isVowel(s[left]): left += 1\n  while left < right and not isVowel(s[right]): right -= 1\n  swap(s[left], s[right]); left += 1; right -= 1" }
    ],
    order: 2
  },

  // 3. Valid Parentheses Sequence (Stack - Easy)
  {
    id: "prob-3",
    title: "Balanced Bracket Sequence",
    slug: "balanced-bracket-sequence",
    difficulty: "Easy",
    topicSlug: "stack",
    description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.\n\nPrint `true` if valid, otherwise print `false`.",
    inputFormat: "A single line containing the bracket string.",
    outputFormat: "Print true or false.",
    constraints: "1 <= len(s) <= 10^5\ns consists of parentheses only '()[]{}'.",
    examples: [
      { input: "()", output: "true", explanation: "Matching pair." },
      { input: "()[]{}", output: "true", explanation: "All types match in order." },
      { input: "(]", output: "false", explanation: "Type mismatch." }
    ],
    starterCode: `import sys

def solve():
    s = sys.stdin.read().strip()
    if not s:
        print("true")
        return
    
    # Write your solution here:
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    
    for ch in s:
        if ch in pairs:
            if not stack or stack[-1] != pairs[ch]:
                print("false")
                return
            stack.pop()
        else:
            stack.append(ch)
            
    print("true" if len(stack) == 0 else "false")

if __name__ == "__main__":
    solve()
`,
    testCases: [
      { input: "()", expectedOutput: "true", isSample: true },
      { input: "()[]{}", expectedOutput: "true", isSample: true },
      { input: "(]", expectedOutput: "false", isSample: true },
      { input: "([)]", expectedOutput: "false", isSample: false },
      { input: "{[]}", expectedOutput: "true", isSample: false },
      { input: "]", expectedOutput: "false", isSample: false }
    ],
    hints: [
      { level: 1, title: "LIFO Property", content: "Which open bracket should be closed first when a closing bracket is encountered? The most recently opened one!" },
      { level: 2, title: "Ideal Data Structure", content: "What data structure operates under the Last-In-First-Out (LIFO) discipline?" },
      { level: 3, title: "Matching Mechanism", content: "Use a Stack. Push opening brackets `(`, `{`, `[`. When a closing bracket appears, check if the stack top matches." },
      { level: 4, title: "Edge Cases to Mind", content: "What happens if a closing bracket appears and the stack is empty? What happens if you reach the end of the string and the stack is not empty?" },
      { level: 5, title: "Pseudocode", content: "for char in s:\n  if char in '({[': stack.push(char)\n  else:\n    if not stack or stack.pop() != match[char]: return false\nreturn len(stack) == 0" }
    ],
    order: 3
  },

  // 4. Merge Two Sorted Number Sequences (Two Pointers / Arrays - Easy)
  {
    id: "prob-4",
    title: "Merge Sorted Sequences",
    slug: "merge-sorted-sequences",
    difficulty: "Easy",
    topicSlug: "two-pointers",
    description: "You are given two sorted integer sequences `A` and `B`. Merge them into a single sorted sequence and print the elements separated by space.",
    inputFormat: "First line: length of A and length of B.\nSecond line: space-separated integers of A.\nThird line: space-separated integers of B.",
    outputFormat: "Single line containing the merged sorted numbers separated by space.",
    constraints: "0 <= len(A), len(B) <= 10^5\nElements fit in 32-bit signed integer.",
    examples: [
      { input: "3 3\n1 2 4\n1 3 4", output: "1 1 2 3 4 4", explanation: "Merged in non-decreasing order." }
    ],
    starterCode: `import sys

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
    n, m = int(lines[0]), int(lines[1])
    idx = 2
    a = [int(lines[idx + i]) for i in range(n)]
    idx += n
    b = [int(lines[idx + i]) for i in range(m)]
    
    # Write your solution using two pointers:
    i, j = 0, 0
    res = []
    while i < n and j < m:
        if a[i] <= b[j]:
            res.append(a[i])
            i += 1
        else:
            res.append(b[j])
            j += 1
    res.extend(a[i:])
    res.extend(b[j:])
    print(" ".join(map(str, res)))

if __name__ == "__main__":
    solve()
`,
    testCases: [
      { input: "3 3\n1 2 4\n1 3 4", expectedOutput: "1 1 2 3 4 4", isSample: true },
      { input: "1 0\n1\n", expectedOutput: "1", isSample: false },
      { input: "0 2\n\n3 5", expectedOutput: "3 5", isSample: false }
    ],
    hints: [
      { level: 1, title: "Pre-existing Order", content: "Both lists are already sorted. How can you compare the heads of both lists one by one?" },
      { level: 2, title: "Pointer Traversal", content: "Maintain an index pointer `i` for list A and index `j` for list B." },
      { level: 3, title: "Pick the Smaller", content: "Append the smaller of A[i] and B[j] to the result list, and advance that list's pointer." },
      { level: 4, title: "Remaining Elements", content: "When one pointer reaches the end, don't forget to append the remainder of the other list." },
      { level: 5, title: "Linear Time", content: "This merge routine runs in O(N + M) time and O(N + M) space, which is the cornerstone of Merge Sort." }
    ],
    order: 4
  },

  // 5. Maximum Subarray Sum (Kadane's Algorithm) (Arrays / DP - Medium)
  {
    id: "prob-5",
    title: "Maximum Subarray Sum",
    slug: "maximum-subarray-sum",
    difficulty: "Medium",
    topicSlug: "arrays",
    description: "Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and print its sum.",
    inputFormat: "First line: number of elements N.\nSecond line: N space-separated integers.",
    outputFormat: "Print the maximum subarray sum.",
    constraints: "1 <= N <= 10^5\n-10^4 <= nums[i] <= 10^4",
    examples: [
      { input: "9\n-2 1 -3 4 -1 2 1 -5 4", output: "6", explanation: "Subarray [4, -1, 2, 1] has the largest sum = 6." }
    ],
    starterCode: `import sys

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
    n = int(lines[0])
    nums = [int(x) for x in lines[1:n+1]]
    
    # Implement Kadane's algorithm:
    max_so_far = nums[0]
    curr_max = nums[0]
    for x in nums[1:]:
        curr_max = max(x, curr_max + x)
        max_so_far = max(max_so_far, curr_max)
    print(max_so_far)

if __name__ == "__main__":
    solve()
`,
    testCases: [
      { input: "9\n-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6", isSample: true },
      { input: "1\n1", expectedOutput: "1", isSample: false },
      { input: "5\n5 4 -1 7 8", expectedOutput: "23", isSample: false },
      { input: "3\n-5 -2 -3", expectedOutput: "-2", isSample: false }
    ],
    hints: [
      { level: 1, title: "Subarray Continuity", content: "A subarray must be contiguous. If adding the previous sum makes the total worse than starting fresh at the current number, what should you do?" },
      { level: 2, title: "Local vs Global Optimum", content: "At each step `i`, do you extend the existing subarray or start a new subarray at `nums[i]`?" },
      { level: 3, title: "Kadane's Recurrence", content: "`curr_sum = max(nums[i], curr_sum + nums[i])`." },
      { level: 4, title: "All-Negative Arrays", content: "Be careful not to initialize your max sum to 0 if all numbers could be negative; initialize to `nums[0]`." },
      { level: 5, title: "Algorithm Breakdown", content: "max_global = max_curr = nums[0]\nfor x in nums[1:]:\n  max_curr = max(x, max_curr + x)\n  max_global = max(max_global, max_curr)\nreturn max_global" }
    ],
    order: 5
  },

  // 6. Longest Substring Without Repeating Characters (Sliding Window - Medium)
  {
    id: "prob-6",
    title: "Longest Unique Substring",
    slug: "longest-unique-substring",
    difficulty: "Medium",
    topicSlug: "sliding-window",
    description: "Given a string `s`, find the length of the longest substring without duplicate characters.",
    inputFormat: "A single line containing string s (can be empty).",
    outputFormat: "Print the integer length of the longest unique substring.",
    constraints: "0 <= len(s) <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces.",
    examples: [
      { input: "abcabcbb", output: "3", explanation: "The answer is 'abc', with length 3." },
      { input: "bbbbb", output: "1", explanation: "The answer is 'b', with length 1." },
      { input: "pwwkew", output: "3", explanation: "The answer is 'wke', with length 3." }
    ],
    starterCode: `import sys

def solve():
    s = sys.stdin.read().rstrip('\\r\\n')
    if not s:
        print(0)
        return
        
    # Write sliding window solution:
    char_index = {}
    max_len = 0
    start = 0
    
    for end, ch in enumerate(s):
        if ch in char_index and char_index[ch] >= start:
            start = char_index[ch] + 1
        char_index[ch] = end
        max_len = max(max_len, end - start + 1)
        
    print(max_len)

if __name__ == "__main__":
    solve()
`,
    testCases: [
      { input: "abcabcbb", expectedOutput: "3", isSample: true },
      { input: "bbbbb", expectedOutput: "1", isSample: true },
      { input: "pwwkew", expectedOutput: "3", isSample: true },
      { input: " ", expectedOutput: "1", isSample: false },
      { input: "abba", expectedOutput: "2", isSample: false }
    ],
    hints: [
      { level: 1, title: "Window Mechanics", content: "Can you maintain a contiguous window `[left, right]` where every character inside is unique?" },
      { level: 2, title: "When a Duplicate Arrives", content: "When `s[right]` was seen before within `[left, right]`, where must `left` jump to?" },
      { level: 3, title: "Last Seen Position Map", content: "Keep a dictionary mapping each character to its most recent index in the string." },
      { level: 4, title: "Left Pointer Jump Invariant", content: "Ensure `left = max(left, last_seen[ch] + 1)` so that `left` never moves backwards." },
      { level: 5, title: "Pseudocode", content: "last_seen = {}\nleft = 0, max_len = 0\nfor right, ch in enumerate(s):\n  if ch in last_seen and last_seen[ch] >= left:\n    left = last_seen[ch] + 1\n  last_seen[ch] = right\n  max_len = max(max_len, right - left + 1)" }
    ],
    order: 6
  },

  // 7. Container With Most Water (Two Pointers - Medium)
  {
    id: "prob-7",
    title: "Container With Most Water",
    slug: "container-with-most-water",
    difficulty: "Medium",
    topicSlug: "two-pointers",
    description: "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i-th` line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water. Print the maximum amount of water a container can store.",
    inputFormat: "First line: n.\nSecond line: n space-separated heights.",
    outputFormat: "Print the maximum area integer.",
    constraints: "2 <= n <= 10^5\n0 <= height[i] <= 10^4",
    examples: [
      { input: "9\n1 8 6 2 5 4 8 3 7", output: "49", explanation: "Lines at index 1 (height 8) and index 8 (height 7) give area min(8, 7) * (8 - 1) = 49." }
    ],
    starterCode: `import sys

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
    n = int(lines[0])
    heights = [int(x) for x in lines[1:n+1]]
    
    # Write two-pointer solution:
    left, right = 0, n - 1
    max_area = 0
    
    while left < right:
        h = min(heights[left], heights[right])
        w = right - left
        max_area = max(max_area, h * w)
        if heights[left] < heights[right]:
            left += 1
        else:
            right -= 1
            
    print(max_area)

if __name__ == "__main__":
    solve()
`,
    testCases: [
      { input: "9\n1 8 6 2 5 4 8 3 7", expectedOutput: "49", isSample: true },
      { input: "2\n1 1", expectedOutput: "1", isSample: false },
      { input: "5\n4 3 2 1 4", expectedOutput: "16", isSample: false }
    ],
    hints: [
      { level: 1, title: "Area Formula", content: "The area between line `left` and `right` is `(right - left) * min(height[left], height[right])`." },
      { level: 2, title: "Widest Possible Container", content: "Start with the maximum width: `left = 0` and `right = n - 1`." },
      { level: 3, title: "Which Pointer to Move?", content: "If you move the pointer with the taller line inward, the height is still bottlenecked by the shorter one, but width decreases, so area can never increase! Which pointer MUST move?" },
      { level: 4, title: "Greedy Shrinking", content: "Always move the pointer corresponding to the shorter height inward in search of a taller barrier." },
      { level: 5, title: "Complexity", content: "This reaches optimal O(N) time and O(1) space with guaranteed correctness." }
    ],
    order: 7
  },

  // 8. Binary Search in Rotated Array (Binary Search - Medium)
  {
    id: "prob-8",
    title: "Search in Rotated Sorted Array",
    slug: "search-in-rotated-sorted-array",
    difficulty: "Medium",
    topicSlug: "binary-search",
    description: "Given the array `nums` after possible unknown rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.",
    inputFormat: "First line: target.\nSecond line: space-separated integers nums.",
    outputFormat: "Print the 0-based index or -1.",
    constraints: "1 <= nums.length <= 10^5\nAll values of nums are unique.\nArray is originally sorted ascending then rotated.",
    examples: [
      { input: "0\n4 5 6 7 0 1 2", output: "4", explanation: "0 is at index 4." },
      { input: "3\n4 5 6 7 0 1 2", output: "-1", explanation: "3 does not exist." }
    ],
    starterCode: `import sys

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
    target = int(lines[0])
    nums = [int(x) for x in lines[1:]]
    
    # Binary search in O(log N):
    low, high = 0, len(nums) - 1
    ans = -1
    
    while low <= high:
        mid = (low + high) // 2
        if nums[mid] == target:
            ans = mid
            break
        # Left half is sorted
        if nums[low] <= nums[mid]:
            if nums[low] <= target < nums[mid]:
                high = mid - 1
            else:
                low = mid + 1
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[high]:
                low = mid + 1
            else:
                high = mid - 1
                
    print(ans)

if __name__ == "__main__":
    solve()
`,
    testCases: [
      { input: "0\n4 5 6 7 0 1 2", expectedOutput: "4", isSample: true },
      { input: "3\n4 5 6 7 0 1 2", expectedOutput: "-1", isSample: true },
      { input: "1\n1", expectedOutput: "0", isSample: false }
    ],
    hints: [
      { level: 1, title: "Halves Properties", content: "Even though the array is rotated, if you divide it in half at `mid`, at least ONE of the two halves will ALWAYS be strictly sorted." },
      { level: 2, title: "Identify the Sorted Half", content: "Compare `nums[low]` and `nums[mid]`. If `nums[low] <= nums[mid]`, the left half is sorted. Otherwise, the right half is sorted." },
      { level: 3, title: "Target Containment Check", content: "If the sorted half contains the target within its boundaries, narrow search to that half. Otherwise, search the other half." },
      { level: 4, title: "Boundary Invariant", content: "Check `nums[low] <= target < nums[mid]` carefully with strict/non-strict inequalities." },
      { level: 5, title: "Pseudocode", content: "while low <= high:\n  mid = (low + high) // 2\n  if nums[mid] == target: return mid\n  if nums[low] <= nums[mid]:\n    if nums[low] <= target < nums[mid]: high = mid - 1\n    else: low = mid + 1\n  else:\n    if nums[mid] < target <= nums[high]: low = mid + 1\n    else: high = mid - 1" }
    ],
    order: 8
  },

  // 9. Implement Queue using Stacks (Queue & Stack - Easy)
  {
    id: "prob-9",
    title: "Queue with Two Stacks",
    slug: "queue-with-two-stacks",
    difficulty: "Easy",
    topicSlug: "queue",
    description: "Implement a FIFO queue using only two LIFO stacks. You will process `Q` operations:\n- `PUSH x`: insert element x to the back of queue.\n- `POP`: remove element from front of queue and print it.\n- `PEEK`: print front element without removing.",
    inputFormat: "First line: Q (number of operations).\nNext Q lines: commands ('PUSH x', 'POP', or 'PEEK').",
    outputFormat: "Print the output of each POP and PEEK on a new line.",
    constraints: "1 <= Q <= 10^5\nAll operations are guaranteed valid.",
    examples: [
      { input: "5\nPUSH 1\nPUSH 2\nPEEK\nPOP\nPEEK", output: "1\n1\n2", explanation: "Pushed 1, 2. Front is 1. Popped 1. Front is 2." }
    ],
    starterCode: `import sys

class MyQueue:
    def __init__(self):
        self.in_stack = []
        self.out_stack = []
        
    def push(self, x):
        self.in_stack.append(x)
        
    def _shift(self):
        if not self.out_stack:
            while self.in_stack:
                self.out_stack.append(self.in_stack.pop())
                
    def pop(self):
        self._shift()
        return self.out_stack.pop()
        
    def peek(self):
        self._shift()
        return self.out_stack[-1]

def solve():
    lines = sys.stdin.read().splitlines()
    if not lines:
        return
    q = int(lines[0])
    queue = MyQueue()
    
    for i in range(1, q + 1):
        parts = lines[i].split()
        cmd = parts[0]
        if cmd == "PUSH":
            queue.push(int(parts[1]))
        elif cmd == "POP":
            print(queue.pop())
        elif cmd == "PEEK":
            print(queue.peek())

if __name__ == "__main__":
    solve()
`,
    testCases: [
      { input: "5\nPUSH 1\nPUSH 2\nPEEK\nPOP\nPEEK", expectedOutput: "1\n1\n2", isSample: true },
      { input: "3\nPUSH 42\nPEEK\nPOP", expectedOutput: "42\n42", isSample: false }
    ],
    hints: [
      { level: 1, title: "Two Inversions Equal Identity", content: "If reversing once inverts order, what happens if you reverse a second time?" },
      { level: 2, title: "Input Stack vs Output Stack", content: "Use `in_stack` strictly for new arrivals, and `out_stack` strictly for serving pops and peeks." },
      { level: 3, title: "Lazy Transfer", content: "Only dump elements from `in_stack` to `out_stack` when `out_stack` is empty!" },
      { level: 4, title: "Amortized Complexity", content: "Each element is pushed twice and popped twice across its lifecycle. The amortized time per operation is O(1)!" },
      { level: 5, title: "Implementation Structure", content: "def push(x): in_stack.append(x)\ndef pop(): if not out_stack: while in_stack: out_stack.append(in_stack.pop()); return out_stack.pop()" }
    ],
    order: 9
  },

  // 10. Detect Cycle in Linked List (Linked List - Easy)
  {
    id: "prob-10",
    title: "Linked List Cycle Detection",
    slug: "linked-list-cycle-detection",
    difficulty: "Easy",
    topicSlug: "linked-list",
    description: "Given a representation of a linked list with `n` nodes and a `pos` integer (-1 if no cycle, or 0-indexed position where the tail connects), determine if the linked list has a cycle.\n\nPrint `true` if cycle exists, else `false`.",
    inputFormat: "First line: n and pos.\nSecond line: n node values.",
    outputFormat: "Print true or false.",
    constraints: "0 <= n <= 10^5\n-1 <= pos < n",
    examples: [
      { input: "4 1\n3 2 0 -4", output: "true", explanation: "Tail connects to node index 1." },
      { input: "1 -1\n1", output: "false", explanation: "pos is -1, no cycle." }
    ],
    starterCode: `import sys

class ListNode:
    def __init__(self, val=0):
        self.val = val
        self.next = None

def has_cycle(head):
    # Implement Floyd's Tortoise and Hare algorithm
    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        print("false")
        return
    n, pos = int(lines[0]), int(lines[1])
    if n == 0:
        print("false")
        return
    vals = [int(x) for x in lines[2:2+n]]
    nodes = [ListNode(v) for v in vals]
    for i in range(n - 1):
        nodes[i].next = nodes[i + 1]
    if pos != -1:
        nodes[-1].next = nodes[pos]
    
    print("true" if has_cycle(nodes[0]) else "false")

if __name__ == "__main__":
    solve()
`,
    testCases: [
      { input: "4 1\n3 2 0 -4", expectedOutput: "true", isSample: true },
      { input: "1 -1\n1", expectedOutput: "false", isSample: true },
      { input: "2 0\n1 2", expectedOutput: "true", isSample: false },
      { input: "0 -1\n", expectedOutput: "false", isSample: false }
    ],
    hints: [
      { level: 1, title: "Memory Constraint", content: "Can you solve this with O(1) extra memory without storing visited nodes in a hash set?" },
      { level: 2, title: "Relative Speeds", content: "Imagine two runners on a circular track: one running at speed 1, the other at speed 2. Will the faster runner eventually lap the slower runner?" },
      { level: 3, title: "Floyd's Algorithm", content: "Maintain a `slow` pointer advancing 1 step and a `fast` pointer advancing 2 steps." },
      { level: 4, title: "Termination Condition", content: "If `fast` or `fast.next` reaches null, the list terminates with no cycle. If `slow == fast`, a cycle is detected." },
      { level: 5, title: "Invariant", content: "while fast and fast.next: slow = slow.next; fast = fast.next.next; if slow == fast: return true; return false" }
    ],
    order: 10
  },

  // 11. Invert Binary Tree (Trees - Easy)
  {
    id: "prob-11",
    title: "Invert Binary Tree",
    slug: "invert-binary-tree",
    difficulty: "Easy",
    topicSlug: "trees",
    description: "Given the root of a binary tree represented as level-order traversal values (with 'null' for missing nodes), invert the tree (mirror left and right subtrees) and print the new level-order traversal.",
    inputFormat: "A single line of space-separated node values in level order.",
    outputFormat: "Print the inverted tree in level order separated by space.",
    constraints: "The number of nodes in the tree is in the range [0, 1000].\nNode values fit in 32-bit signed integer.",
    examples: [
      { input: "4 2 7 1 3 6 9", output: "4 7 2 9 6 3 1", explanation: "Every left and right child is swapped." }
    ],
    starterCode: `import sys
from collections import deque

class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

def invert_tree(root):
    if not root:
        return None
    root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    root = TreeNode(tokens[0])
    q = deque([root])
    idx = 1
    while q and idx < len(tokens):
        curr = q.popleft()
        if idx < len(tokens) and tokens[idx] != "null":
            curr.left = TreeNode(tokens[idx])
            q.append(curr.left)
        idx += 1
        if idx < len(tokens) and tokens[idx] != "null":
            curr.right = TreeNode(tokens[idx])
            q.append(curr.right)
        idx += 1
        
    invert_tree(root)
    
    # Print level order
    out = []
    res_q = deque([root])
    while res_q:
        node = res_q.popleft()
        if node:
            out.append(str(node.val))
            res_q.append(node.left)
            res_q.append(node.right)
    # Trim trailing nulls
    while out and out[-1] == "null":
        out.pop()
    print(" ".join(out))

if __name__ == "__main__":
    solve()
`,
    testCases: [
      { input: "4 2 7 1 3 6 9", expectedOutput: "4 7 2 9 6 3 1", isSample: true },
      { input: "2 1 3", expectedOutput: "2 3 1", isSample: false }
    ],
    hints: [
      { level: 1, title: "Subproblem Nature", content: "To invert the tree at the root, what must happen to the left subtree and right subtree?" },
      { level: 2, title: "Swap and Recurse", content: "Swap `node.left` and `node.right`, and then recursively invert both subtrees." },
      { level: 3, title: "Base Case", content: "If `node is None`, return `None`." },
      { level: 4, title: "Iterative Alternative", content: "You can also do this with BFS/Queue by swapping children at each popped node." },
      { level: 5, title: "Recursive Pattern", content: "root.left, root.right = invert(root.right), invert(root.left)" }
    ],
    order: 11
  },

  // 12. Binary Tree Level Order Traversal (Trees & Queue - Medium)
  {
    id: "prob-12",
    title: "Binary Tree Level Order Traversal",
    slug: "binary-tree-level-order-traversal",
    difficulty: "Medium",
    topicSlug: "trees",
    description: "Given the root of a binary tree in serialized level order, return the level order traversal of its nodes' values (i.e., from left to right, level by level).\n\nPrint each level on a separate line.",
    inputFormat: "Space-separated serialized node values ('null' for missing).",
    outputFormat: "Print each level's values space-separated on a new line.",
    constraints: "Number of nodes is in range [0, 2000].",
    examples: [
      { input: "3 9 20 null null 15 7", output: "3\n9 20\n15 7", explanation: "Level 1: [3], Level 2: [9, 20], Level 3: [15, 7]." }
    ],
    starterCode: `import sys
from collections import deque

class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

def solve():
    tokens = sys.stdin.read().split()
    if not tokens or tokens[0] == "null":
        return
    root = TreeNode(tokens[0])
    q = deque([root])
    idx = 1
    while q and idx < len(tokens):
        curr = q.popleft()
        if idx < len(tokens) and tokens[idx] != "null":
            curr.left = TreeNode(tokens[idx])
            q.append(curr.left)
        idx += 1
        if idx < len(tokens) and tokens[idx] != "null":
            curr.right = TreeNode(tokens[idx])
            q.append(curr.right)
        idx += 1
        
    # BFS Level Order:
    bfs_q = deque([root])
    while bfs_q:
        level_size = len(bfs_q)
        level_vals = []
        for _ in range(level_size):
            node = bfs_q.popleft()
            level_vals.append(str(node.val))
            if node.left:
                bfs_q.append(node.left)
            if node.right:
                bfs_q.append(node.right)
        print(" ".join(level_vals))

if __name__ == "__main__":
    solve()
`,
    testCases: [
      { input: "3 9 20 null null 15 7", expectedOutput: "3\n9 20\n15 7", isSample: true },
      { input: "1", expectedOutput: "1", isSample: false }
    ],
    hints: [
      { level: 1, title: "BFS Exploration", content: "Breadth-First Search naturally visits nodes in order of their distance (depth) from the root." },
      { level: 2, title: "Level Delimitation", content: "How do you know where one level ends and the next begins in a queue?" },
      { level: 3, title: "Batch by Queue Size", content: "At the start of each level loop, capture `level_size = len(queue)`. Pop exactly that many nodes!" },
      { level: 4, title: "Enqueue Children", content: "As you pop each of the `level_size` nodes, push their children into the queue for the NEXT level." },
      { level: 5, title: "Complexity", content: "Time: O(N) since every node is processed once. Space: O(W) where W is the maximum width of the tree." }
    ],
    order: 12
  },

  // 13. Validate Binary Search Tree (Trees - Medium)
  {
    id: "prob-13",
    title: "Validate Binary Search Tree",
    slug: "validate-binary-search-tree",
    difficulty: "Medium",
    topicSlug: "trees",
    description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).\n\nA valid BST is defined as:\n- The left subtree contains only nodes with keys strictly less than the node's key.\n- The right subtree contains only nodes with keys strictly greater than the node's key.\n- Both left and right subtrees must also be binary search trees.\n\nPrint `true` if valid, otherwise `false`.",
    inputFormat: "Space-separated serialized node values.",
    outputFormat: "Print true or false.",
    constraints: "Number of nodes is between 1 and 10^4.",
    examples: [
      { input: "2 1 3", output: "true", explanation: "1 < 2 < 3." },
      { input: "5 1 4 null null 3 6", output: "false", explanation: "Root is 5, but right child 4 has child 3 which violates BST rule." }
    ],
    starterCode: `import sys
from collections import deque

class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

def is_valid_bst(root, low=float("-inf"), high=float("inf")):
    if not root:
        return True
    if not (low < root.val < high):
        return False
    return is_valid_bst(root.left, low, root.val) and is_valid_bst(root.right, root.val, high)

def solve():
    tokens = sys.stdin.read().split()
    if not tokens or tokens[0] == "null":
        print("true")
        return
    root = TreeNode(int(tokens[0]))
    q = deque([root])
    idx = 1
    while q and idx < len(tokens):
        curr = q.popleft()
        if idx < len(tokens) and tokens[idx] != "null":
            curr.left = TreeNode(int(tokens[idx]))
            q.append(curr.left)
        idx += 1
        if idx < len(tokens) and tokens[idx] != "null":
            curr.right = TreeNode(int(tokens[idx]))
            q.append(curr.right)
        idx += 1
        
    print("true" if is_valid_bst(root) else "false")

if __name__ == "__main__":
    solve()
`,
    testCases: [
      { input: "2 1 3", expectedOutput: "true", isSample: true },
      { input: "5 1 4 null null 3 6", expectedOutput: "false", isSample: true },
      { input: "2 2 2", expectedOutput: "false", isSample: false }
    ],
    hints: [
      { level: 1, title: "Global vs Local Constraint", content: "Is it sufficient to check only that a node's left child is smaller and right child is larger? What if a descendant deep on the left is larger than the root?" },
      { level: 2, title: "Range Inheritance", content: "Every node must satisfy a valid range `[low, high]` passed down from all its ancestors." },
      { level: 3, title: "In-Order Traversal Property", content: "Notice that an in-order traversal of a valid BST must produce a strictly increasing sequence." },
      { level: 4, title: "Recursive Boundaries", content: "When going left: `high = node.val`. When going right: `low = node.val`." },
      { level: 5, title: "Pseudocode", content: "def validate(node, low, high):\n  if not node: return true\n  if not (low < node.val < high): return false\n  return validate(node.left, low, node.val) and validate(node.right, node.val, high)" }
    ],
    order: 13
  },

  // 14. Number of Connected Islands (Graphs - Medium)
  {
    id: "prob-14",
    title: "Number of Connected Islands",
    slug: "number-of-connected-islands",
    difficulty: "Medium",
    topicSlug: "graphs",
    description: "Given an `m x n` 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are surrounded by water.",
    inputFormat: "First line: m and n.\nNext m lines: n space-separated characters ('0' or '1').",
    outputFormat: "Print the total count of islands.",
    constraints: "1 <= m, n <= 300\ngrid[i][j] is '0' or '1'.",
    examples: [
      { input: "4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0", output: "1", explanation: "All 1s are connected into one island." },
      { input: "4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1", output: "3", explanation: "Three disconnected groups of land." }
    ],
    starterCode: `import sys
sys.setrecursionlimit(200000)

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        print(0)
        return
    m, n = int(lines[0]), int(lines[1])
    grid = []
    idx = 2
    for _ in range(m):
        grid.append(lines[idx:idx+n])
        idx += n
        
    def dfs(r, c):
        if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] != '1':
            return
        grid[r][c] = '0' # mark visited
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
        
    islands = 0
    for r in range(m):
        for c in range(n):
            if grid[r][c] == '1':
                islands += 1
                dfs(r, c)
                
    print(islands)

if __name__ == "__main__":
    solve()
`,
    testCases: [
      { input: "4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0", expectedOutput: "1", isSample: true },
      { input: "4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1", expectedOutput: "3", isSample: true },
      { input: "1 1\n0", expectedOutput: "0", isSample: false }
    ],
    hints: [
      { level: 1, title: "Graph View of Grids", content: "Think of each cell `(r, c)` containing '1' as a vertex, connected to its 4 cardinal neighbors." },
      { level: 2, title: "Connected Components", content: "The number of islands is simply the number of connected components in this graph." },
      { level: 3, title: "Flood Fill Traversal", content: "When you encounter an unvisited '1', increment the island count, and launch a DFS or BFS to mark all connected land cells as visited." },
      { level: 4, title: "In-Place Modification", content: "To avoid extra O(m*n) memory for a visited set, you can mutate visited '1' cells to '0'." },
      { level: 5, title: "Complexity", content: "Every cell is visited a constant number of times: Time O(m*n), Space O(m*n) for recursion stack." }
    ],
    order: 14
  },

  // 15. Course Schedule (Cycle Detection) (Graphs - Medium)
  {
    id: "prob-15",
    title: "Course Schedule Prerequisite Check",
    slug: "course-schedule-prerequisite-check",
    difficulty: "Medium",
    topicSlug: "graphs",
    description: "There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [a, b]` indicates that you must take course `b` first if you want to take course `a`.\n\nPrint `true` if you can finish all courses, otherwise print `false`.",
    inputFormat: "First line: numCourses and P (number of prerequisite pairs).\nNext P lines: two integers a and b.",
    outputFormat: "Print true or false.",
    constraints: "1 <= numCourses <= 2000\n0 <= prerequisites.length <= 5000",
    examples: [
      { input: "2 1\n1 0", output: "true", explanation: "Take course 0 then course 1." },
      { input: "2 2\n1 0\n0 1", output: "false", explanation: "Circular dependency between 0 and 1." }
    ],
    starterCode: `import sys
from collections import deque, defaultdict

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
    num_courses = int(lines[0])
    p = int(lines[1])
    
    adj = defaultdict(list)
    indegree = [0] * num_courses
    
    idx = 2
    for _ in range(p):
        a = int(lines[idx])
        b = int(lines[idx+1])
        adj[b].append(a)
        indegree[a] += 1
        idx += 2
        
    # Kahn's Algorithm (BFS Topological Sort)
    q = deque([i for i in range(num_courses) if indegree[i] == 0])
    visited = 0
    
    while q:
        curr = q.popleft()
        visited += 1
        for nxt in adj[curr]:
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                q.append(nxt)
                
    print("true" if visited == num_courses else "false")

if __name__ == "__main__":
    solve()
`,
    testCases: [
      { input: "2 1\n1 0", expectedOutput: "true", isSample: true },
      { input: "2 2\n1 0\n0 1", expectedOutput: "false", isSample: true },
      { input: "1 0\n", expectedOutput: "true", isSample: false }
    ],
    hints: [
      { level: 1, title: "Directed Graph Representation", content: "Model courses as vertices and prerequisite relationships `b -> a` as directed edges." },
      { level: 2, title: "Cycle Impossibility", content: "Can you finish all courses if there is a cycle `0 -> 1 -> 0`? No! The graph must be a Directed Acyclic Graph (DAG)." },
      { level: 3, title: "Kahn's Algorithm", content: "Compute the in-degree (number of incoming prerequisites) for each course. Which courses can you take immediately?" },
      { level: 4, title: "Zero In-degree Queue", content: "Add all courses with in-degree 0 to a queue. As you complete each course, decrement the in-degree of dependent courses." },
      { level: 5, title: "Verdict Condition", content: "If the total number of courses processed equals `numCourses`, return true; otherwise a cycle exists." }
    ],
    order: 15
  },

  // 16. Climbing Stairs (Dynamic Programming - Easy)
  {
    id: "prob-16",
    title: "Climbing Stairs Combinations",
    slug: "climbing-stairs-combinations",
    difficulty: "Easy",
    topicSlug: "dynamic-programming",
    description: "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?",
    inputFormat: "A single integer n.",
    outputFormat: "Print the total number of distinct ways.",
    constraints: "1 <= n <= 45",
    examples: [
      { input: "2", output: "2", explanation: "1 step + 1 step, or 2 steps." },
      { input: "3", output: "3", explanation: "1+1+1, 1+2, 2+1." }
    ],
    starterCode: `import sys

def solve():
    s = sys.stdin.read().strip()
    if not s:
        return
    n = int(s)
    if n <= 2:
        print(n)
        return
    
    # DP: ways(n) = ways(n-1) + ways(n-2)
    prev2, prev1 = 1, 2
    for _ in range(3, n + 1):
        curr = prev1 + prev2
        prev2, prev1 = prev1, curr
    print(prev1)

if __name__ == "__main__":
    solve()
`,
    testCases: [
      { input: "2", expectedOutput: "2", isSample: true },
      { input: "3", expectedOutput: "3", isSample: true },
      { input: "5", expectedOutput: "8", isSample: false },
      { input: "1", expectedOutput: "1", isSample: false }
    ],
    hints: [
      { level: 1, title: "Step Arrival Choices", content: "To reach step `n`, what was your immediately preceding position? Either step `n-1` or step `n-2`." },
      { level: 2, title: "Recurrence Relation", content: "Total ways to reach `n` = `ways(n-1) + ways(n-2)`." },
      { level: 3, title: "Fibonacci Sequence", content: "This is mathematically equivalent to the Fibonacci recurrence sequence." },
      { level: 4, title: "Memory Optimization", content: "Instead of allocating an array of size `n`, you only need to store the previous two values: O(1) space." },
      { level: 5, title: "Pseudocode", content: "a, b = 1, 2\nfor i from 3 to n:\n  a, b = b, a + b\nreturn b" }
    ],
    order: 16
  },

  // 17. Coin Change Problem (Dynamic Programming - Medium)
  {
    id: "prob-17",
    title: "Minimum Coin Change",
    slug: "minimum-coin-change",
    difficulty: "Medium",
    topicSlug: "dynamic-programming",
    description: "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, print `-1`.\n\nYou may assume that you have an infinite number of each kind of coin.",
    inputFormat: "First line: amount and number of coins C.\nSecond line: C space-separated coin denominations.",
    outputFormat: "Print the minimum number of coins, or -1.",
    constraints: "1 <= coins.length <= 12\n1 <= coins[i] <= 2^31 - 1\n0 <= amount <= 10^4",
    examples: [
      { input: "11 3\n1 2 5", output: "3", explanation: "11 = 5 + 5 + 1 (3 coins)." },
      { input: "3 1\n2", output: "-1", explanation: "Amount 3 cannot be formed with denomination 2." }
    ],
    starterCode: `import sys

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
    amount = int(lines[0])
    c = int(lines[1])
    coins = [int(x) for x in lines[2:2+c]]
    
    dp = [float("inf")] * (amount + 1)
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if i - coin >= 0:
                dp[i] = min(dp[i], dp[i - coin] + 1)
                
    print(dp[amount] if dp[amount] != float("inf") else -1)

if __name__ == "__main__":
    solve()
`,
    testCases: [
      { input: "11 3\n1 2 5", expectedOutput: "3", isSample: true },
      { input: "3 1\n2", expectedOutput: "-1", isSample: true },
      { input: "0 1\n1", expectedOutput: "0", isSample: false }
    ],
    hints: [
      { level: 1, title: "Greedy Flaw", content: "Does picking the largest coin always work? Consider coins [1, 3, 4] and amount 6: Greedy gives 4 + 1 + 1 (3 coins), but optimal is 3 + 3 (2 coins)!" },
      { level: 2, title: "Subproblem Formulation", content: "Let `dp[x]` be the fewest coins required to make amount `x`." },
      { level: 3, title: "State Transition", content: "For each coin in `coins`: `dp[x] = min(dp[x], dp[x - coin] + 1)`." },
      { level: 4, title: "Base Cases & Sentinel", content: "Initialize `dp[0] = 0` and all other entries `dp[1...amount] = infinity`." },
      { level: 5, title: "Time Complexity", content: "Time: O(amount * len(coins)). Space: O(amount)." }
    ],
    order: 17
  },

  // 18. Longest Increasing Subsequence (Dynamic Programming - Medium)
  {
    id: "prob-18",
    title: "Longest Increasing Subsequence",
    slug: "longest-increasing-subsequence",
    difficulty: "Medium",
    topicSlug: "dynamic-programming",
    description: "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.\n\nA subsequence is a sequence that can be derived from an array by deleting some or no elements without changing the order of the remaining elements.",
    inputFormat: "First line: n.\nSecond line: n space-separated integers.",
    outputFormat: "Print the length integer.",
    constraints: "1 <= nums.length <= 2500\n-10^4 <= nums[i] <= 10^4",
    examples: [
      { input: "8\n10 9 2 5 3 7 101 18", output: "4", explanation: "The longest increasing subsequence is [2, 3, 7, 101], therefore the length is 4." }
    ],
    starterCode: `import sys
import bisect

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
    n = int(lines[0])
    nums = [int(x) for x in lines[1:n+1]]
    
    # Patience sorting / Binary search O(N log N)
    tails = []
    for x in nums:
        idx = bisect.bisect_left(tails, x)
        if idx == len(tails):
            tails.append(x)
        else:
            tails[idx] = x
            
    print(len(tails))

if __name__ == "__main__":
    solve()
`,
    testCases: [
      { input: "8\n10 9 2 5 3 7 101 18", expectedOutput: "4", isSample: true },
      { input: "6\n0 1 0 3 2 3", expectedOutput: "4", isSample: false },
      { input: "7\n7 7 7 7 7 7 7", expectedOutput: "1", isSample: false }
    ],
    hints: [
      { level: 1, title: "Subsequence vs Subarray", content: "Subsequences do not need to be contiguous, but their relative order must be preserved." },
      { level: 2, title: "O(N^2) Dynamic Programming", content: "Let `dp[i]` be the length of the LIS ending at index `i`. Then `dp[i] = 1 + max(dp[j])` for all `j < i` where `nums[j] < nums[i]`." },
      { level: 3, title: "Optimal O(N log N) Approach", content: "Can you maintain an array `tails` where `tails[i]` stores the smallest tail of all increasing subsequences of length `i + 1`?" },
      { level: 4, title: "Binary Search Insertion", content: "For each element `x`, binary search (`bisect_left`) the position in `tails`. If it is greater than all elements, append it. Otherwise overwrite!" },
      { level: 5, title: "Result", content: "The length of `tails` at the end gives the length of the LIS." }
    ],
    order: 18
  },

  // 19. Word Break (DP & Strings - Medium)
  {
    id: "prob-19",
    title: "Word Break Segmentability",
    slug: "word-break-segmentability",
    difficulty: "Medium",
    topicSlug: "dynamic-programming",
    description: "Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words, else `false`.\n\nYou may reuse the same word in the dictionary multiple times.",
    inputFormat: "First line: string s.\nSecond line: number of words W.\nThird line: W space-separated dictionary words.",
    outputFormat: "Print true or false.",
    constraints: "1 <= s.length <= 300\n1 <= wordDict.length <= 1000\n1 <= wordDict[i].length <= 20",
    examples: [
      { input: "leetcode\n2\nleet code", output: "true", explanation: "'leetcode' can be segmented as 'leet code'." },
      { input: "catsandog\n5\ncats dog sand and cat", output: "false", explanation: "No valid segmentation exists." }
    ],
    starterCode: `import sys

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
    s = lines[0]
    w = int(lines[1])
    words = set(lines[2:2+w])
    
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
                
    print("true" if dp[n] else "false")

if __name__ == "__main__":
    solve()
`,
    testCases: [
      { input: "leetcode\n2\nleet code", expectedOutput: "true", isSample: true },
      { input: "catsandog\n5\ncats dog sand and cat", expectedOutput: "false", isSample: true },
      { input: "applepenapple\n2\napple pen", expectedOutput: "true", isSample: false }
    ],
    hints: [
      { level: 1, title: "Subproblem Definition", content: "Can we know whether prefix `s[0...i]` is valid if we know validity of smaller prefixes?" },
      { level: 2, title: "DP Array Boolean", content: "Let `dp[i]` be `True` if `s[0...i]` can be segmented using dictionary words." },
      { level: 3, title: "Transition Condition", content: "`dp[i] = True` if there exists some split `j < i` where `dp[j] == True` and `s[j...i]` is in `wordDict`." },
      { level: 4, title: "Hash Set Lookup", content: "Convert `wordDict` to a set for O(1) membership lookups." },
      { level: 5, title: "Complexity", content: "Time: O(n^2 * k) where k is string slice cost. Space: O(n)." }
    ],
    order: 19
  },

  // 20. Trapping Rain Water (Two Pointers - Hard)
  {
    id: "prob-20",
    title: "Trapping Rain Water Capacity",
    slug: "trapping-rain-water-capacity",
    difficulty: "Hard",
    topicSlug: "two-pointers",
    description: "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    inputFormat: "First line: n.\nSecond line: n space-separated non-negative elevations.",
    outputFormat: "Print the total trapped water units integer.",
    constraints: "n == height.length\n1 <= n <= 2 * 10^4\n0 <= height[i] <= 10^5",
    examples: [
      { input: "12\n0 1 0 2 1 0 1 3 2 1 2 1", output: "6", explanation: "The elevation map traps 6 units of rain water." }
    ],
    starterCode: `import sys

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        print(0)
        return
    n = int(lines[0])
    height = [int(x) for x in lines[1:n+1]]
    
    if n <= 2:
        print(0)
        return
        
    left, right = 0, n - 1
    left_max, right_max = 0, 0
    water = 0
    
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max:
                left_max = height[left]
            else:
                water += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                water += right_max - height[right]
            right -= 1
            
    print(water)

if __name__ == "__main__":
    solve()
`,
    testCases: [
      { input: "12\n0 1 0 2 1 0 1 3 2 1 2 1", expectedOutput: "6", isSample: true },
      { input: "6\n4 2 0 3 2 5", expectedOutput: "9", isSample: false },
      { input: "3\n2 0 2", expectedOutput: "2", isSample: false }
    ],
    hints: [
      { level: 1, title: "Water Trapped at Position i", content: "How much water can sit on top of bar `i`? `water[i] = max(0, min(max_left, max_right) - height[i])`." },
      { level: 2, title: "Prefix & Suffix Approach", content: "You could precompute `max_left` and `max_right` arrays in O(N) time and O(N) space." },
      { level: 3, title: "Two Pointers Space Optimization", content: "Can we reduce space to O(1)? If `height[left] < height[right]`, we know that the bottleneck for `left` is `left_max` because `right` has a taller wall!" },
      { level: 4, title: "Pointer Invariant", content: "If `height[left] < height[right]`: process `left`. If `height[left] >= left_max`, update `left_max`; otherwise add `left_max - height[left]`. Vice versa for `right`." },
      { level: 5, title: "Optimal Performance", content: "Runs in O(N) single pass and O(1) auxiliary space." }
    ],
    order: 20
  },

  // 21. Sliding Window Maximum (Sliding Window & Queue - Hard)
  {
    id: "prob-21",
    title: "Sliding Window Maximum",
    slug: "sliding-window-maximum",
    difficulty: "Hard",
    topicSlug: "sliding-window",
    description: "You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position.\n\nPrint the max sliding window values space-separated.",
    inputFormat: "First line: n and k.\nSecond line: n space-separated integers.",
    outputFormat: "Print the maximum of each sliding window separated by space.",
    constraints: "1 <= nums.length <= 10^5\n1 <= k <= nums.length",
    examples: [
      { input: "8 3\n1 3 -1 -3 5 3 6 7", output: "3 3 5 5 6 7", explanation: "Window max for each position of size 3." }
    ],
    starterCode: `import sys
from collections import deque

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
    n, k = int(lines[0]), int(lines[1])
    nums = [int(x) for x in lines[2:2+n]]
    
    dq = deque() # stores indices, monotonic decreasing values
    res = []
    
    for i in range(n):
        # Remove elements out of window
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        # Remove smaller elements from back
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()
        dq.append(i)
        
        if i >= k - 1:
            res.append(str(nums[dq[0]]))
            
    print(" ".join(res))

if __name__ == "__main__":
    solve()
`,
    testCases: [
      { input: "8 3\n1 3 -1 -3 5 3 6 7", expectedOutput: "3 3 5 5 6 7", isSample: true },
      { input: "1 1\n1", expectedOutput: "1", isSample: false }
    ],
    hints: [
      { level: 1, title: "Why Heaps are O(N log K)", content: "A heap allows finding the maximum in O(1) or O(log K), but removing elements that fall outside the window takes O(K) unless amortized. Can we achieve O(N)?" },
      { level: 2, title: "Monotonic Queue", content: "What if we use a Double-Ended Queue (deque) that only keeps elements that have a chance of being the maximum?" },
      { level: 3, title: "Useless Candidates", content: "If `nums[i] >= nums[j]` and `i > j`, element `j` can NEVER be the maximum in any future window containing `i`!" },
      { level: 4, title: "Deque Invariant", content: "Maintain indices in the deque such that values are strictly non-increasing. The front `dq[0]` is always the current window maximum." },
      { level: 5, title: "Pseudocode", content: "while dq and dq[0] <= i - k: dq.popleft()\nwhile dq and nums[dq[-1]] < nums[i]: dq.pop()\ndq.append(i)\nif i >= k - 1: res.append(nums[dq[0]])" }
    ],
    order: 21
  },

  // 22. Median of Two Sorted Arrays (Binary Search - Hard)
  {
    id: "prob-22",
    title: "Median of Two Sorted Sequences",
    slug: "median-of-two-sorted-sequences",
    difficulty: "Hard",
    topicSlug: "binary-search",
    description: "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be `O(log (m+n))`.\nPrint the median formatted with up to 1 decimal place (e.g. 2.0 or 2.5).",
    inputFormat: "First line: m and n.\nSecond line: m integers of nums1.\nThird line: n integers of nums2.",
    outputFormat: "Print the median float/integer.",
    constraints: "nums1.length == m\nnums2.length == n\n0 <= m <= 1000\n0 <= n <= 1000\n1 <= m + n <= 2000",
    examples: [
      { input: "2 1\n1 3\n2", output: "2.0", explanation: "Merged array = [1, 2, 3] and median is 2.0." },
      { input: "2 2\n1 2\n3 4", output: "2.5", explanation: "Merged array = [1, 2, 3, 4] and median is (2 + 3) / 2 = 2.5." }
    ],
    starterCode: `import sys

def solve():
    lines = sys.stdin.read().split()
    if not lines:
        return
    m, n = int(lines[0]), int(lines[1])
    idx = 2
    a = [int(lines[idx + i]) for i in range(m)]
    idx += m
    b = [int(lines[idx + i]) for i in range(n)]
    
    # Ensure a is the shorter array
    if len(a) > len(b):
        a, b = b, a
        m, n = n, m
        
    low, high = 0, m
    total_left = (m + n + 1) // 2
    
    while low <= high:
        i = (low + high) // 2
        j = total_left - i
        
        a_left = float("-inf") if i == 0 else a[i - 1]
        a_right = float("inf") if i == m else a[i]
        b_left = float("-inf") if j == 0 else b[j - 1]
        b_right = float("inf") if j == n else b[j]
        
        if a_left <= b_right and b_left <= a_right:
            if (m + n) % 2 == 1:
                print(f"{float(max(a_left, b_left)):.1f}")
            else:
                med = (max(a_left, b_left) + min(a_right, b_right)) / 2.0
                print(f"{med:.1f}")
            return
        elif a_left > b_right:
            high = i - 1
        else:
            low = i + 1

if __name__ == "__main__":
    solve()
`,
    testCases: [
      { input: "2 1\n1 3\n2", expectedOutput: "2.0", isSample: true },
      { input: "2 2\n1 2\n3 4", expectedOutput: "2.5", isSample: true },
      { input: "0 1\n\n1", expectedOutput: "1.0", isSample: false }
    ],
    hints: [
      { level: 1, title: "Partitioning Principle", content: "The median divides a sorted collection into two equal halves where every element on the left is <= every element on the right." },
      { level: 2, title: "Binary Search on Shorter Array", content: "Binary search the partition cut `i` on the smaller array `A`. The partition cut `j` on `B` is fixed: `j = (m + n + 1) // 2 - i`." },
      { level: 3, title: "Valid Partition Condition", content: "A partition is valid if `A[i-1] <= B[j]` and `B[j-1] <= A[i]`." },
      { level: 4, title: "Edge Cases & Sentinels", content: "Handle boundary cuts using `-infinity` when `i == 0` and `+infinity` when `i == m`." },
      { level: 5, title: "Median Extraction", content: "Odd total length: `max(A[i-1], B[j-1])`. Even total length: `(max(lefts) + min(rights)) / 2.0`." }
    ],
    order: 22
  }
];
