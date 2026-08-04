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
 * Generates array of date strings (YYYY-MM-DD) for a specified year or rolling 365 days
 */
export function getDatesForYear(yearInput: string | number = 'rolling'): string[] {
  const dates: string[] = [];
  const yearStr = String(yearInput);

  if (yearStr === 'rolling') {
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  }

  const numericYear = parseInt(yearStr, 10);
  const currentYear = new Date().getFullYear();

  // If selecting current year (2026), generate Jan 1 up to today (or end of year)
  const isCurrentYear = numericYear === currentYear;
  const startDate = new Date(Date.UTC(numericYear, 0, 1));
  const endDate = isCurrentYear ? new Date() : new Date(Date.UTC(numericYear, 11, 31));

  const cur = new Date(startDate);
  while (cur <= endDate) {
    dates.push(cur.toISOString().split('T')[0]);
    cur.setUTCDate(cur.getUTCDate() + 1);
  }

  return dates;
}

export function getLastNDaysDates(daysCount = 365): string[] {
  return getDatesForYear('rolling');
}
