import { NextResponse } from 'next/server';
import { CODING_CONFIG } from '@/lib/coding-config';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username') || CODING_CONFIG.defaultGithubUsername;

  try {
    const res = await fetch(`https://github.com/users/${username}/contributions`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      next: { revalidate: 3600 },
    });

    const dateMap: Record<string, number> = {};

    if (res.ok) {
      const html = await res.text();

      // Map element IDs (contribution-day-component-X-Y) to dates
      const idToDate = new Map<string, string>();
      const idMatches = [...html.matchAll(/id="(contribution-day-component-[^"]+)"[^>]*data-date="(\d{4}-\d{2}-\d{2})"/gi)];
      const idMatches2 = [...html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="(contribution-day-component-[^"]+)"/gi)];

      idMatches.forEach((m) => idToDate.set(m[1], m[2]));
      idMatches2.forEach((m) => idToDate.set(m[2], m[1]));

      // Parse tooltips for count
      const tooltips = [...html.matchAll(/<tool-tip[^>]*for="(contribution-day-component-[^"]+)"[^>]*>([^<]+)<\/tool-tip>/gi)];

      tooltips.forEach((m) => {
        const id = m[1];
        const text = m[2];
        const date = idToDate.get(id);
        if (date) {
          if (text.includes('No contributions')) {
            dateMap[date] = 0;
          } else {
            const countMatch = text.match(/^(\d+)\s+contribution/i);
            dateMap[date] = countMatch ? parseInt(countMatch[1], 10) : 1;
          }
        }
      });

      // Fallback parser if tooltips format changes
      if (Object.keys(dateMap).length === 0) {
        const dayMatches = html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*?(?:data-count="(\d+)"|>(\d+)\s+contribution|>No\s+contribution)/gi);
        for (const match of dayMatches) {
          const date = match[1];
          let count = 0;
          if (match[2] !== undefined) count = parseInt(match[2], 10);
          else if (match[3] !== undefined) count = parseInt(match[3], 10);
          if (date) dateMap[date] = count;
        }
      }
    }

    return NextResponse.json({
      success: true,
      username,
      contributions: dateMap,
    });
  } catch (error) {
    console.error('GitHub stats fetch error:', error);
    return NextResponse.json({
      success: false,
      username,
      contributions: {},
      error: 'Failed to fetch GitHub contributions',
    });
  }
}
