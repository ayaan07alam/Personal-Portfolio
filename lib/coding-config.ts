export const CODING_CONFIG = {
  defaultGithubUsername: process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'ayaan07alam',
  defaultLeetcodeUsername: process.env.NEXT_PUBLIC_LEETCODE_USERNAME || 'ayaan07alam',
  daysInWindow: 365,
};

/**
 * Calculates intensity level (0-4) based on contribution count
 */
export function getIntensity(count: number): number {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

/**
 * Generates an array of dates for the last N days up to today (YYYY-MM-DD format)
 */
export function getLastNDaysDates(daysCount = 365): string[] {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  
  return dates;
}
