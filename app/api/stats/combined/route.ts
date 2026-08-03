import { NextResponse } from 'next/server';
import { CODING_CONFIG, getIntensity, getLastNDaysDates } from '@/lib/coding-config';
import { CombinedStreakData, DailyContribution, StreakStats } from '@/types/streak';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const githubUser = searchParams.get('github') || CODING_CONFIG.defaultGithubUsername;
  const leetcodeUser = searchParams.get('leetcode') || CODING_CONFIG.defaultLeetcodeUsername;

  try {
    // Fetch GitHub & LeetCode in parallel from internal API routes or external
    const [ghRes, lcRes] = await Promise.all([
      fetch(`${origin}/api/stats/github?username=${encodeURIComponent(githubUser)}`, { cache: 'no-store' }),
      fetch(`${origin}/api/stats/leetcode?username=${encodeURIComponent(leetcodeUser)}`, { cache: 'no-store' }),
    ]);

    const ghData = ghRes.ok ? await ghRes.json() : { contributions: {} };
    const lcData = lcRes.ok ? await lcRes.json() : { contributions: {} };

    const ghMap: Record<string, number> = ghData.contributions || {};
    const lcMap: Record<string, number> = lcData.contributions || {};

    const dates = getLastNDaysDates(CODING_CONFIG.daysInWindow);
    const dailyContributions: DailyContribution[] = [];

    let totalGh = 0;
    let totalLc = 0;
    let totalCombined = 0;
    let activeDaysCount = 0;

    // Build day objects
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

    // Helper to calculate streaks
    const calculateStreaks = (countExtractor: (day: DailyContribution) => number) => {
      let currentStreak = 0;
      let maxStreak = 0;
      let tempStreak = 0;

      // Reverse order (today back to 365 days ago) for current streak
      const reversed = [...dailyContributions].reverse();

      // Check current streak from today or yesterday
      let isCurrentStillActive = true;
      for (let i = 0; i < reversed.length; i++) {
        const count = countExtractor(reversed[i]);
        if (count > 0) {
          if (isCurrentStillActive) {
            currentStreak++;
          }
        } else {
          // If today (index 0) has 0, check if yesterday was active; if so, streak is still alive
          if (i === 0) {
            continue; // allow today to be 0 without breaking streak yet
          }
          isCurrentStillActive = false;
        }
      }

      // Chronological order for max streak
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

    const stats: StreakStats = {
      githubUsername: githubUser,
      leetcodeUsername: leetcodeUser,
      githubCurrentStreak: ghStreaks.currentStreak,
      githubMaxStreak: ghStreaks.maxStreak,
      githubTotalCommits: totalGh,
      leetcodeCurrentStreak: lcStreaks.currentStreak,
      leetcodeMaxStreak: lcStreaks.maxStreak,
      leetcodeTotalSolved: totalLc,
      combinedCurrentStreak: combinedStreaks.currentStreak,
      combinedMaxStreak: combinedStreaks.maxStreak,
      combinedTotalContributions: totalCombined,
      activeDaysCount,
      totalDaysCount: dates.length,
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
