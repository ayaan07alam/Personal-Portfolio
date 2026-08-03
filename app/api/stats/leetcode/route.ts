import { NextResponse } from 'next/server';
import { CODING_CONFIG } from '@/lib/coding-config';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || CODING_CONFIG.defaultLeetcodeUsername;

  try {
    // 1. Initial query to fetch user submitStats & activeYears
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

    if (res.ok) {
      const data = await res.json();
      const matchedUser = data?.data?.matchedUser;

      if (matchedUser) {
        streak = matchedUser.userCalendar?.streak || 0;
        totalActiveDays = matchedUser.userCalendar?.totalActiveDays || 0;
        activeYears = matchedUser.userCalendar?.activeYears || [];

        const allSolvedObj = matchedUser.submitStats?.acSubmissionNum?.find(
          (s: { difficulty: string; count: number }) => s.difficulty === 'All'
        );
        totalSolved = allSolvedObj?.count || 0;
      }
    }

    // 2. Fetch submission calendar for each active year (e.g. 2023, etc.)
    const yearQuery = `
      query userProfileCalendar($username: String!, $year: Int) {
        matchedUser(username: $username) {
          userCalendar(year: $year) {
            submissionCalendar
          }
        }
      }
    `;

    // Query current year and all activeYears
    const currentYear = new Date().getFullYear();
    const yearsToQuery = Array.from(new Set([currentYear, ...activeYears]));

    await Promise.all(
      yearsToQuery.map(async (year) => {
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
      streak,
      totalActiveDays,
      totalSolved,
      contributions: dateMap,
    });
  } catch (error) {
    console.error('LeetCode stats fetch error:', error);
    return NextResponse.json({
      success: false,
      username,
      streak: 0,
      totalActiveDays: 0,
      totalSolved: 0,
      contributions: {},
      error: 'Failed to fetch LeetCode data',
    });
  }
}
