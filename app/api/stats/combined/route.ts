import { NextResponse } from 'next/server';
import { CODING_CONFIG, getDatesForYear, getIntensity } from '@/lib/coding-config';
import { CombinedStreakData, DailyContribution, StreakStats } from '@/types/streak';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const githubUser = searchParams.get('github') || CODING_CONFIG.defaultGithubUsername;
  const leetcodeUser = searchParams.get('leetcode') || CODING_CONFIG.defaultLeetcodeUsername;
  const yearParam = searchParams.get('year') || 'rolling';

  try {
    const [ghRes, lcRes] = await Promise.all([
      fetch(`${origin}/api/stats/github?username=${encodeURIComponent(githubUser)}&year=${encodeURIComponent(yearParam)}`, { cache: 'no-store' }),
      fetch(`${origin}/api/stats/leetcode?username=${encodeURIComponent(leetcodeUser)}&year=${encodeURIComponent(yearParam)}`, { cache: 'no-store' }),
    ]);

    const ghData = ghRes.ok ? await ghRes.json() : { contributions: {} };
    const lcData = lcRes.ok ? await lcRes.json() : { contributions: {}, difficulty: { easy: 0, medium: 0, hard: 0 }, activeYears: [] };

    const ghMap: Record<string, number> = ghData.contributions || {};
    const lcMap: Record<string, number> = lcData.contributions || {};

    const dates = getDatesForYear(yearParam);
    const dailyContributions: DailyContribution[] = [];

    let totalGh = 0;
    let totalLc = 0;
    let totalCombined = 0;
    let activeDaysCount = 0;

    dates.forEach((dateStr) => {
      const ghCount = ghMap[dateStr] || 0;
      const lcCount = lcMap[dateStr] || 0;
      const totalCount = ghCount + lcCount;

      if (totalCount > 0) {
        activeDaysCount++;
      }

      totalGh += ghCount;
      totalLc += lcCount;
      totalCombined += totalCount;

      dailyContributions.push({
        date: dateStr,
        githubCount: ghCount,
        leetcodeCount: lcCount,
        totalCount,
        intensity: {
          github: getIntensity(ghCount),
          leetcode: getIntensity(lcCount),
          total: getIntensity(totalCount),
        },
      });
    });

    const calculateStreaks = (countExtractor: (day: DailyContribution) => number) => {
      let currentStreak = 0;
      let maxStreak = 0;
      let tempStreak = 0;

      const reversed = [...dailyContributions].reverse();
      let isCurrentStillActive = true;

      for (let i = 0; i < reversed.length; i++) {
        const count = countExtractor(reversed[i]);
        if (count > 0) {
          if (isCurrentStillActive) {
            currentStreak++;
          }
        } else {
          if (i === 0) continue;
          isCurrentStillActive = false;
        }
      }

      dailyContributions.forEach((day) => {
        const count = countExtractor(day);
        if (count > 0) {
          tempStreak++;
          if (tempStreak > maxStreak) {
            maxStreak = tempStreak;
          }
        } else {
          tempStreak = 0;
        }
      });

      return { currentStreak, maxStreak };
    };

    const ghStreaks = calculateStreaks((d) => d.githubCount);
    const lcStreaks = calculateStreaks((d) => d.leetcodeCount);
    const combinedStreaks = calculateStreaks((d) => d.totalCount);

    const currentYear = new Date().getFullYear();
    const availableYearsSet = new Set<number>([currentYear, currentYear - 1, currentYear - 2, currentYear - 3]);

    if (Array.isArray(lcData.activeYears)) {
      lcData.activeYears.forEach((y: number) => availableYearsSet.add(y));
    }

    const availableYears = Array.from(availableYearsSet).sort((a, b) => b - a);

    const stats: StreakStats = {
      githubUsername: githubUser,
      leetcodeUsername: leetcodeUser,
      githubCurrentStreak: ghStreaks.currentStreak,
      githubMaxStreak: ghStreaks.maxStreak,
      githubTotalCommits: Object.values(ghMap).reduce((a, b) => a + b, 0) || totalGh,
      leetcodeCurrentStreak: lcStreaks.currentStreak,
      leetcodeMaxStreak: lcStreaks.maxStreak,
      leetcodeTotalSolved: lcData.totalSolved !== undefined ? lcData.totalSolved : totalLc,
      leetcodeDifficulty: lcData.difficulty || { easy: 0, medium: 0, hard: 0 },
      combinedCurrentStreak: combinedStreaks.currentStreak,
      combinedMaxStreak: combinedStreaks.maxStreak,
      combinedTotalContributions: totalCombined,
      activeDaysCount,
      totalDaysCount: dates.length,
      availableYears,
      selectedYear: yearParam,
    };

    const responseData: CombinedStreakData = {
      stats,
      days: dailyContributions,
    };

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error('Combined stats fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to combine stats' }, { status: 500 });
  }
}
