export type StreakFilterMode = 'all' | 'github' | 'leetcode';

export interface DailyContribution {
  date: string; // YYYY-MM-DD
  githubCount: number;
  leetcodeCount: number;
  totalCount: number;
  intensity: {
    github: number; // 0 to 4 scale
    leetcode: number; // 0 to 4 scale
    total: number; // 0 to 4 scale
  };
}

export interface LeetCodeDifficulty {
  easy: number;
  medium: number;
  hard: number;
}

export interface StreakStats {
  githubUsername: string;
  leetcodeUsername: string;
  githubCurrentStreak: number;
  githubMaxStreak: number;
  githubTotalCommits: number;
  leetcodeCurrentStreak: number;
  leetcodeMaxStreak: number;
  leetcodeTotalSolved: number;
  leetcodeDifficulty: LeetCodeDifficulty;
  combinedCurrentStreak: number;
  combinedMaxStreak: number;
  combinedTotalContributions: number;
  activeDaysCount: number;
  totalDaysCount: number;
  availableYears: number[];
  selectedYear: string;
}

export interface CombinedStreakData {
  stats: StreakStats;
  days: DailyContribution[];
}
