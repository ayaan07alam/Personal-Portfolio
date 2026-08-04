import { NextResponse } from 'next/server';
import { CODING_CONFIG } from '@/lib/coding-config';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || CODING_CONFIG.defaultLeetcodeUsername;
  const yearParam = searchParams.get('year') || 'rolling';

  try {
    // Initial GraphQL query for user statistics and activeYears
    const initialQuery = `
      query userProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
          userCalendar {
            activeYears
            streak
            totalActiveDays
          }
        }
      }
    `;

    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': `https://leetcode.com/u/${username}/`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: JSON.stringify({ query: initialQuery, variables: { username } }),
      next: { revalidate: 3600 },
    });

    const dateMap: Record<string, number> = {};
    let streak = 0;
    let totalActiveDays = 0;
    let totalSolved = 0;
    let activeYears: number[] = [];
    const difficulty = { easy: 0, medium: 0, hard: 0 };

    if (res.ok) {
      const data = await res.json();
      const matchedUser = data?.data?.matchedUser;

      if (matchedUser) {
        streak = matchedUser.userCalendar?.streak || 0;
        totalActiveDays = matchedUser.userCalendar?.totalActiveDays || 0;
        activeYears = matchedUser.userCalendar?.activeYears || [];

        const submitNum = matchedUser.submitStats?.acSubmissionNum || [];
        submitNum.forEach((s: { difficulty: string; count: number }) => {
          if (s.difficulty === 'All') totalSolved = s.count;
          if (s.difficulty === 'Easy') difficulty.easy = s.count;
          if (s.difficulty === 'Medium') difficulty.medium = s.count;
          if (s.difficulty === 'Hard') difficulty.hard = s.count;
        });
      }
    }

    // GraphQL query for specific year submission calendar
    const yearQuery = `
      query userProfileCalendar($username: String!, $year: Int) {
        matchedUser(username: $username) {
          userCalendar(year: $year) {
            submissionCalendar
          }
        }
      }
    `;

    const currentYear = new Date().getFullYear();
    let yearsToFetch: (number | undefined)[] = [];

    if (yearParam === 'rolling') {
      yearsToFetch = Array.from(new Set([currentYear, ...activeYears]));
    } else {
      const parsedY = parseInt(yearParam, 10);
      yearsToFetch = [isNaN(parsedY) ? currentYear : parsedY];
    }

    await Promise.all(
      yearsToFetch.map(async (year) => {
        try {
          const yRes = await fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Referer': `https://leetcode.com/u/${username}/`,
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
            body: JSON.stringify({ query: yearQuery, variables: { username, year } }),
            next: { revalidate: 3600 },
          });

          if (yRes.ok) {
            const yData = await yRes.json();
            const subCalendarRaw = yData?.data?.matchedUser?.userCalendar?.submissionCalendar;
            if (subCalendarRaw) {
              const parsedCalendar: Record<string, number> = typeof subCalendarRaw === 'string'
                ? JSON.parse(subCalendarRaw)
                : subCalendarRaw;

              Object.entries(parsedCalendar).forEach(([timestampStr, count]) => {
                const timestampMs = parseInt(timestampStr, 10) * 1000;
                const dateStr = new Date(timestampMs).toISOString().split('T')[0];
                dateMap[dateStr] = (dateMap[dateStr] || 0) + count;
              });
            }
          }
        } catch (e) {
          console.error(`LeetCode year ${year} fetch error:`, e);
        }
      })
    );

    return NextResponse.json({
      success: true,
      username,
      year: yearParam,
      streak,
      totalActiveDays,
      totalSolved,
      difficulty,
      activeYears,
      contributions: dateMap,
    });
  } catch (error) {
    console.error('LeetCode stats fetch error:', error);
    return NextResponse.json({
      success: false,
      username,
      year: yearParam,
      streak: 0,
      totalActiveDays: 0,
      totalSolved: 0,
      difficulty: { easy: 0, medium: 0, hard: 0 },
      activeYears: [],
      contributions: {},
      error: 'Failed to fetch LeetCode data',
    });
  }
}
