'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, GitCommit, Code2, Trophy, RefreshCw, Calendar, Sparkles, Filter, Activity } from 'lucide-react';
import { CombinedStreakData, DailyContribution, StreakFilterMode } from '@/types/streak';
import { CODING_CONFIG } from '@/lib/coding-config';

export default function CodingStreakSection() {
  const [streakData, setStreakData] = useState<CombinedStreakData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterMode, setFilterMode] = useState<StreakFilterMode>('all');
  const [hoveredDay, setHoveredDay] = useState<DailyContribution | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const fetchStreakData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/stats/combined?github=${CODING_CONFIG.defaultGithubUsername}&leetcode=${CODING_CONFIG.defaultLeetcodeUsername}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setStreakData(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to load streak matrix:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreakData();
  }, []);

  // Organize 365 days into 52/53 weeks for grid rendering
  const weeks = useMemo(() => {
    if (!streakData?.days) return [];
    const days = streakData.days;
    const weekGroups: DailyContribution[][] = [];
    let currentWeek: DailyContribution[] = [];

    // Pad first week if starting day is not Sunday (index 0)
    if (days.length > 0) {
      const firstDate = new Date(days[0].date);
      const dayOfWeek = firstDate.getDay(); // 0 = Sun, 6 = Sat
      for (let i = 0; i < dayOfWeek; i++) {
        // Dummy pad for empty alignment
        currentWeek.push({
          date: '',
          githubCount: 0,
          leetcodeCount: 0,
          totalCount: 0,
          intensity: { github: 0, leetcode: 0, total: 0 },
        });
      }
    }

    days.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weekGroups.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      weekGroups.push(currentWeek);
    }

    return weekGroups;
  }, [streakData]);

  // Color helper for matrix cell based on filter mode and count
  const getCellClassName = (day: DailyContribution) => {
    if (!day.date) return 'bg-transparent border-transparent opacity-0 pointer-events-none';

    if (filterMode === 'github') {
      const level = day.intensity.github;
      if (level === 0) return 'bg-zinc-900/60 border-zinc-800/40 hover:border-zinc-700';
      if (level === 1) return 'bg-emerald-950/80 border-emerald-800/40 text-emerald-300 shadow-sm shadow-emerald-950/50';
      if (level === 2) return 'bg-emerald-800/90 border-emerald-600/50 text-emerald-200';
      if (level === 3) return 'bg-emerald-600 border-emerald-400 text-white';
      return 'bg-emerald-400 border-emerald-300 text-black shadow-md shadow-emerald-500/30';
    }

    if (filterMode === 'leetcode') {
      const level = day.intensity.leetcode;
      if (level === 0) return 'bg-zinc-900/60 border-zinc-800/40 hover:border-zinc-700';
      if (level === 1) return 'bg-amber-950/80 border-amber-800/40 text-amber-300 shadow-sm shadow-amber-950/50';
      if (level === 2) return 'bg-amber-800/90 border-amber-600/50 text-amber-200';
      if (level === 3) return 'bg-amber-600 border-amber-400 text-white';
      return 'bg-amber-400 border-amber-300 text-black shadow-md shadow-amber-500/30';
    }

    // Filter Mode: ALL (Dual Platform Visualization)
    const hasGh = day.githubCount > 0;
    const hasLc = day.leetcodeCount > 0;

    if (hasGh && hasLc) {
      // DUAL DAY! Luminous Neon Violet/Pink gradient
      return 'bg-gradient-to-br from-emerald-500 via-purple-500 to-amber-500 border-purple-300/80 shadow-md shadow-purple-500/30 ring-1 ring-purple-400/50';
    }

    if (hasGh) {
      const level = day.intensity.github;
      if (level <= 1) return 'bg-emerald-900/70 border-emerald-800/40';
      if (level === 2) return 'bg-emerald-700 border-emerald-600';
      if (level === 3) return 'bg-emerald-500 border-emerald-400';
      return 'bg-emerald-400 border-emerald-300 shadow-sm shadow-emerald-400/40';
    }

    if (hasLc) {
      const level = day.intensity.leetcode;
      if (level <= 1) return 'bg-amber-900/70 border-amber-800/40';
      if (level === 2) return 'bg-amber-700 border-amber-600';
      if (level === 3) return 'bg-amber-500 border-amber-400';
      return 'bg-amber-400 border-amber-300 shadow-sm shadow-amber-400/40';
    }

    return 'bg-zinc-900/50 border-zinc-855/40 hover:border-zinc-700';
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const stats = streakData?.stats;

  return (
    <section id="streak-matrix" className="py-20 relative overflow-hidden bg-black text-white">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-emerald-400 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              REAL-TIME CODING MATRIX
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              GitHub & LeetCode <span className="bg-gradient-to-r from-emerald-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">Streak Terminal</span>
            </h2>
            <p className="text-zinc-400 mt-2 text-sm sm:text-base max-w-xl">
              Live automated feed tracking activity across repositories & problem solving streaks with dual-color matrix telemetry.
            </p>
          </div>

          {/* Filter Toggles */}
          <div className="flex items-center gap-2 p-1.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl self-start md:self-auto">
            <button
              onClick={() => setFilterMode('all')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                filterMode === 'all'
                  ? 'bg-gradient-to-r from-emerald-500 via-purple-500 to-amber-500 text-white shadow-md shadow-purple-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              All Activity
            </button>
            <button
              onClick={() => setFilterMode('github')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                filterMode === 'github'
                  ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
                  : 'text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800/50'
              }`}
            >
              <GitCommit className="w-3.5 h-3.5" />
              GitHub
            </button>
            <button
              onClick={() => setFilterMode('leetcode')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                filterMode === 'leetcode'
                  ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-amber-400 hover:bg-zinc-800/50'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              LeetCode
            </button>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Combined Streak */}
          <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Current Streak</span>
              <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white flex items-baseline gap-1">
              {loading ? (
                <div className="h-8 w-16 bg-zinc-800 animate-pulse rounded" />
              ) : (
                <>
                  {stats?.combinedCurrentStreak || 0}
                  <span className="text-xs font-normal text-zinc-400">days</span>
                </>
              )}
            </div>
            <div className="mt-2 text-[11px] text-zinc-500 flex items-center gap-1">
              <span>GitHub: {stats?.githubCurrentStreak || 0}d</span>
              <span>•</span>
              <span>LeetCode: {stats?.leetcodeCurrentStreak || 0}d</span>
            </div>
          </div>

          {/* Card 2: Max Streak */}
          <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 backdrop-blur-md relative overflow-hidden group hover:border-purple-500/40 transition-colors">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Longest Streak</span>
              <Trophy className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white flex items-baseline gap-1">
              {loading ? (
                <div className="h-8 w-16 bg-zinc-800 animate-pulse rounded" />
              ) : (
                <>
                  {stats?.combinedMaxStreak || 0}
                  <span className="text-xs font-normal text-zinc-400">days</span>
                </>
              )}
            </div>
            <div className="mt-2 text-[11px] text-zinc-500">
              Active Days: {stats?.activeDaysCount || 0} / {stats?.totalDaysCount || 365}
            </div>
          </div>

          {/* Card 3: GitHub Total */}
          <div className="p-5 rounded-2xl bg-zinc-950/70 border border-emerald-950/60 border-zinc-800/80 backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider flex items-center gap-1">
                <GitCommit className="w-3.5 h-3.5" /> GitHub
              </span>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800/40">@{stats?.githubUsername}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white flex items-baseline gap-1">
              {loading ? (
                <div className="h-8 w-20 bg-zinc-800 animate-pulse rounded" />
              ) : (
                <>
                  {stats?.githubTotalCommits || 0}
                  <span className="text-xs font-normal text-zinc-400">commits</span>
                </>
              )}
            </div>
            <div className="mt-2 text-[11px] text-emerald-400/70 font-mono">
              Emerald Spectrum
            </div>
          </div>

          {/* Card 4: LeetCode Total */}
          <div className="p-5 rounded-2xl bg-zinc-950/70 border border-amber-950/60 border-zinc-800/80 backdrop-blur-md relative overflow-hidden group hover:border-amber-500/50 transition-colors">
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5" /> LeetCode
              </span>
              <span className="text-[10px] font-mono bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800/40">@{stats?.leetcodeUsername}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white flex items-baseline gap-1">
              {loading ? (
                <div className="h-8 w-20 bg-zinc-800 animate-pulse rounded" />
              ) : (
                <>
                  {stats?.leetcodeTotalSolved || 0}
                  <span className="text-xs font-normal text-zinc-400">solved</span>
                </>
              )}
            </div>
            <div className="mt-2 text-[11px] text-amber-400/70 font-mono">
              Amber Spectrum
            </div>
          </div>
        </div>

        {/* Matrix Container Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-xl relative">
          
          {/* Matrix Controls & Refresh */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>365-DAY CONTRIBS TELEMETRY</span>
            </div>
            <button
              onClick={fetchStreakData}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-zinc-800"
              title="Refresh Activity Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>
          </div>

          {/* Matrix Grid Scroll Area */}
          <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {loading ? (
              <div className="flex gap-1.5 justify-between py-6">
                {Array.from({ length: 52 }).map((_, w) => (
                  <div key={w} className="flex flex-col gap-1.5">
                    {Array.from({ length: 7 }).map((_, d) => (
                      <div key={d} className="w-3 h-3 rounded-sm bg-zinc-800/60 animate-pulse" />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="inline-flex flex-col gap-1 min-w-[720px]">
                {/* Month Row Labels */}
                <div className="flex gap-1.5 mb-1 pl-6 text-[10px] font-mono text-zinc-500">
                  <span className="w-12">Jan</span>
                  <span className="w-12">Feb</span>
                  <span className="w-12">Mar</span>
                  <span className="w-12">Apr</span>
                  <span className="w-12">May</span>
                  <span className="w-12">Jun</span>
                  <span className="w-12">Jul</span>
                  <span className="w-12">Aug</span>
                  <span className="w-12">Sep</span>
                  <span className="w-12">Oct</span>
                  <span className="w-12">Nov</span>
                  <span className="w-12">Dec</span>
                </div>

                <div className="flex gap-2">
                  {/* Day of Week Labels */}
                  <div className="flex flex-col justify-between py-0.5 text-[9px] font-mono text-zinc-600 select-none">
                    <span>Sun</span>
                    <span>Tue</span>
                    <span>Thu</span>
                    <span>Sat</span>
                  </div>

                  {/* Weeks Columns */}
                  <div className="flex gap-1.5">
                    {weeks.map((week, weekIdx) => (
                      <div key={weekIdx} className="flex flex-col gap-1.5">
                        {week.map((day, dayIdx) => (
                          <div
                            key={dayIdx}
                            onMouseEnter={(e) => {
                              if (day.date) {
                                setHoveredDay(day);
                                const rect = e.currentTarget.getBoundingClientRect();
                                setMousePos({ x: rect.left + rect.width / 2, y: rect.top });
                              }
                            }}
                            onMouseLeave={() => setHoveredDay(null)}
                            className={`w-3.5 h-3.5 rounded-sm border transition-all duration-150 cursor-pointer hover:scale-125 hover:z-20 ${getCellClassName(
                              day
                            )}`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Tooltip Card */}
          <AnimatePresence>
            {hoveredDay && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2.5 rounded-xl bg-zinc-900/95 border border-zinc-700 text-white shadow-2xl backdrop-blur-md text-xs font-sans min-w-[200px]"
                style={{ left: mousePos.x, top: mousePos.y }}
              >
                <div className="font-semibold border-b border-zinc-800 pb-1 mb-1.5 text-zinc-300 flex items-center justify-between">
                  <span>{formatDate(hoveredDay.date)}</span>
                  <span className="font-mono text-[10px] text-zinc-500">#{hoveredDay.date}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-emerald-400">
                    <span className="flex items-center gap-1">
                      <GitCommit className="w-3 h-3" /> GitHub Commits:
                    </span>
                    <span className="font-mono font-bold">{hoveredDay.githubCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-amber-400">
                    <span className="flex items-center gap-1">
                      <Code2 className="w-3 h-3" /> LeetCode Solved:
                    </span>
                    <span className="font-mono font-bold">{hoveredDay.leetcodeCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-purple-300 pt-1 border-t border-zinc-800/80 font-bold">
                    <span>Total Contributions:</span>
                    <span className="font-mono">{hoveredDay.totalCount}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend & Key */}
          <div className="mt-6 pt-4 border-t border-zinc-900 flex flex-wrap items-center justify-between text-xs text-zinc-500 gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-mono text-[11px]">COLOR MATRIX KEY:</span>
              
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span>
                <span className="text-zinc-400">GitHub Only</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block"></span>
                <span className="text-zinc-400">LeetCode Only</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-gradient-to-br from-emerald-500 via-purple-500 to-amber-500 inline-block"></span>
                <span className="text-purple-300 font-semibold">Dual-Active Day!</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-zinc-900 border border-zinc-800" />
                <div className="w-3 h-3 rounded-sm bg-emerald-950/80" />
                <div className="w-3 h-3 rounded-sm bg-emerald-700" />
                <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                <div className="w-3 h-3 rounded-sm bg-emerald-400" />
              </div>
              <span>More</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
