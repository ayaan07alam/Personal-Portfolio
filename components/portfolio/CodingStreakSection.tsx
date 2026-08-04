'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, GitCommit, Code2, Trophy, RefreshCw, Calendar, Sparkles, Activity, Layers, ExternalLink } from 'lucide-react';
import { CombinedStreakData, DailyContribution, StreakFilterMode } from '@/types/streak';
import { CODING_CONFIG } from '@/lib/coding-config';

export default function CodingStreakSection() {
  const [streakData, setStreakData] = useState<CombinedStreakData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterMode, setFilterMode] = useState<StreakFilterMode>('all');
  const [selectedYear, setSelectedYear] = useState<string>('rolling');
  const [hoveredDay, setHoveredDay] = useState<DailyContribution | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const fetchStreakData = async (yearStr = selectedYear) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/stats/combined?github=${CODING_CONFIG.defaultGithubUsername}&leetcode=${CODING_CONFIG.defaultLeetcodeUsername}&year=${yearStr}`
      );
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
    fetchStreakData(selectedYear);
  }, [selectedYear]);

  // Organize days into 52-53 weeks array (each week is 7 days: Sun-Sat)
  const { weeks, monthLabels } = useMemo(() => {
    if (!streakData?.days) return { weeks: [], monthLabels: [] };
    const days = streakData.days;
    const weekGroups: DailyContribution[][] = [];
    let currentWeek: DailyContribution[] = [];

    // Pad first week if starting date is not Sunday (getDay() !== 0)
    if (days.length > 0) {
      const firstDate = new Date(days[0].date);
      const dayOfWeek = firstDate.getDay(); // 0 = Sun, 6 = Sat
      for (let i = 0; i < dayOfWeek; i++) {
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
      // Pad end of last week
      while (currentWeek.length < 7) {
        currentWeek.push({
          date: '',
          githubCount: 0,
          leetcodeCount: 0,
          totalCount: 0,
          intensity: { github: 0, leetcode: 0, total: 0 },
        });
      }
      weekGroups.push(currentWeek);
    }

    // Compute dynamic month label positions (weekIdx offset)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const calculatedLabels: { month: string; weekIdx: number }[] = [];
    let lastMonth = -1;

    weekGroups.forEach((week, weekIdx) => {
      // Find the first valid day in the week
      const validDay = week.find((d) => d.date);
      if (validDay) {
        const dateObj = new Date(validDay.date);
        const m = dateObj.getMonth(); // 0-11
        if (m !== lastMonth) {
          calculatedLabels.push({ month: monthNames[m], weekIdx });
          lastMonth = m;
        }
      }
    });

    return { weeks: weekGroups, monthLabels: calculatedLabels };
  }, [streakData]);

  // Color helper for matrix cell based on filter mode and count
  const getCellClassName = (day: DailyContribution) => {
    if (!day.date) return 'bg-transparent border-transparent opacity-0 pointer-events-none';

    if (filterMode === 'github') {
      const level = day.intensity.github;
      if (level === 0) return 'bg-zinc-900/60 border-zinc-800/40 hover:border-zinc-700';
      if (level === 1) return 'bg-emerald-950/80 border-emerald-800/50 shadow-sm shadow-emerald-950/50';
      if (level === 2) return 'bg-emerald-700 border-emerald-600';
      if (level === 3) return 'bg-emerald-500 border-emerald-400';
      return 'bg-emerald-400 border-emerald-300 shadow-md shadow-emerald-500/30';
    }

    if (filterMode === 'leetcode') {
      const level = day.intensity.leetcode;
      if (level === 0) return 'bg-zinc-900/60 border-zinc-800/40 hover:border-zinc-700';
      if (level === 1) return 'bg-amber-950/80 border-amber-800/50 shadow-sm shadow-amber-950/50';
      if (level === 2) return 'bg-amber-700 border-amber-600';
      if (level === 3) return 'bg-amber-500 border-amber-400';
      return 'bg-amber-400 border-amber-300 shadow-md shadow-amber-500/30';
    }

    // Filter Mode: ALL (Dual Platform Visual)
    const hasGh = day.githubCount > 0;
    const hasLc = day.leetcodeCount > 0;

    if (hasGh && hasLc) {
      // DUAL ACTIVE DAY! Luminous Neon Violet/Pink Gradient
      return 'bg-gradient-to-br from-emerald-400 via-purple-500 to-amber-400 border-purple-300 shadow-md shadow-purple-500/30 ring-1 ring-purple-400/50 animate-pulse-subtle';
    }

    if (hasGh) {
      const level = day.intensity.github;
      if (level <= 1) return 'bg-emerald-950/90 border-emerald-800/50';
      if (level === 2) return 'bg-emerald-700 border-emerald-600';
      if (level === 3) return 'bg-emerald-500 border-emerald-400';
      return 'bg-emerald-400 border-emerald-300 shadow-sm shadow-emerald-400/40';
    }

    if (hasLc) {
      const level = day.intensity.leetcode;
      if (level <= 1) return 'bg-amber-950/90 border-amber-800/50';
      if (level === 2) return 'bg-amber-700 border-amber-600';
      if (level === 3) return 'bg-amber-500 border-amber-400';
      return 'bg-amber-400 border-amber-300 shadow-sm shadow-amber-400/40';
    }

    return 'bg-zinc-900/50 border-zinc-800/40 hover:border-zinc-700';
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const stats = streakData?.stats;
  const availableYears = stats?.availableYears || [2026, 2025, 2024, 2023];
  const difficulty = stats?.leetcodeDifficulty || { easy: 0, medium: 0, hard: 0 };
  const totalLcSolved = stats?.leetcodeTotalSolved || (difficulty.easy + difficulty.medium + difficulty.hard);

  return (
    <section id="streak-matrix" className="py-24 relative overflow-hidden bg-[#000000] text-white">
      {/* Background Cyberpunk Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800/90 text-xs font-mono text-emerald-400 mb-3 shadow-inner">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              REAL-TIME DEV TELEMETRY
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              GitHub & LeetCode <span className="bg-gradient-to-r from-emerald-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">Streak Terminal</span>
            </h2>
            <p className="text-zinc-400 mt-2 text-sm sm:text-base max-w-2xl">
              Live automated feed tracking daily commit streams and problem-solving activity with precision multi-year telemetry.
            </p>
          </div>

          {/* View Mode Filters & Year Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1.5 bg-zinc-950/90 border border-zinc-800/90 rounded-2xl backdrop-blur-xl shadow-lg">
              <button
                onClick={() => setFilterMode('all')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  filterMode === 'all'
                    ? 'bg-gradient-to-r from-emerald-500 via-purple-500 to-amber-500 text-white shadow-md shadow-purple-500/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Combined
              </button>
              <button
                onClick={() => setFilterMode('github')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  filterMode === 'github'
                    ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
                    : 'text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800/50'
                }`}
              >
                <GitCommit className="w-3.5 h-3.5" />
                GitHub Only
              </button>
              <button
                onClick={() => setFilterMode('leetcode')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  filterMode === 'leetcode'
                    ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                    : 'text-zinc-400 hover:text-amber-400 hover:bg-zinc-800/50'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                LeetCode Only
              </button>
            </div>

            {/* Year Selector Tabs */}
            <div className="flex items-center gap-1 p-1.5 bg-zinc-950/90 border border-zinc-800/90 rounded-2xl backdrop-blur-xl shadow-lg">
              <button
                onClick={() => setSelectedYear('rolling')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 ${
                  selectedYear === 'rolling'
                    ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Rolling 365d
              </button>
              {availableYears.map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(String(yr))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 ${
                    selectedYear === String(yr)
                      ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Combined Streak */}
          <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300 shadow-xl">
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
            <div className="mt-2 text-[11px] text-zinc-500 flex items-center gap-1 font-mono">
              <span>GH: {stats?.githubCurrentStreak || 0}d</span>
              <span>•</span>
              <span>LC: {stats?.leetcodeCurrentStreak || 0}d</span>
            </div>
          </div>

          {/* Card 2: Max Streak */}
          <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 backdrop-blur-md relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300 shadow-xl">
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
            <div className="mt-2 text-[11px] text-zinc-500 font-mono">
              Active Days: {stats?.activeDaysCount || 0} / {stats?.totalDaysCount || 365}
            </div>
          </div>

          {/* Card 3: GitHub Total */}
          <div className="p-5 rounded-2xl bg-zinc-950/70 border border-emerald-950/60 border-zinc-800/80 backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-300 shadow-xl">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider flex items-center gap-1">
                <GitCommit className="w-3.5 h-3.5" /> GitHub
              </span>
              <a
                href={`https://github.com/${stats?.githubUsername || CODING_CONFIG.defaultGithubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800/40 hover:bg-emerald-900 transition-colors flex items-center gap-1"
              >
                @{stats?.githubUsername || CODING_CONFIG.defaultGithubUsername}
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
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
            <div className="mt-2 text-[11px] text-emerald-400/80 font-mono">
              Emerald Spectrum
            </div>
          </div>

          {/* Card 4: LeetCode Total */}
          <div className="p-5 rounded-2xl bg-zinc-950/70 border border-amber-950/60 border-zinc-800/80 backdrop-blur-md relative overflow-hidden group hover:border-amber-500/50 transition-all duration-300 shadow-xl">
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5" /> LeetCode
              </span>
              <a
                href={`https://leetcode.com/u/${stats?.leetcodeUsername || CODING_CONFIG.defaultLeetcodeUsername}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800/40 hover:bg-amber-900 transition-colors flex items-center gap-1"
              >
                @{stats?.leetcodeUsername || CODING_CONFIG.defaultLeetcodeUsername}
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white flex items-baseline gap-1">
              {loading ? (
                <div className="h-8 w-20 bg-zinc-800 animate-pulse rounded" />
              ) : (
                <>
                  {totalLcSolved}
                  <span className="text-xs font-normal text-zinc-400">solved</span>
                </>
              )}
            </div>
            <div className="mt-2 text-[11px] text-amber-400/80 font-mono flex items-center gap-2">
              <span className="text-emerald-400">E:{difficulty.easy}</span>
              <span className="text-amber-400">M:{difficulty.medium}</span>
              <span className="text-rose-400">H:{difficulty.hard}</span>
            </div>
          </div>
        </div>

        {/* LeetCode Difficulty Breakdown Bar (Shown when LeetCode is selected or active) */}
        {filterMode === 'leetcode' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 rounded-2xl bg-zinc-950/80 border border-amber-500/20 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-3">
              <span className="flex items-center gap-2 text-amber-400 font-bold">
                <Code2 className="w-4 h-4" /> LEETCODE DIFFICULTY DISTRIBUTION
              </span>
              <span>TOTAL SOLVED: {totalLcSolved}</span>
            </div>
            <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-zinc-800">
              {totalLcSolved > 0 ? (
                <>
                  <div
                    style={{ width: `${(difficulty.easy / totalLcSolved) * 100}%` }}
                    className="h-full bg-emerald-500 rounded-l-full"
                    title={`Easy: ${difficulty.easy}`}
                  />
                  <div
                    style={{ width: `${(difficulty.medium / totalLcSolved) * 100}%` }}
                    className="h-full bg-amber-500"
                    title={`Medium: ${difficulty.medium}`}
                  />
                  <div
                    style={{ width: `${(difficulty.hard / totalLcSolved) * 100}%` }}
                    className="h-full bg-rose-500 rounded-r-full"
                    title={`Hard: ${difficulty.hard}`}
                  />
                </>
              ) : (
                <div className="h-full w-full bg-zinc-800 rounded-full" />
              )}
            </div>
            <div className="flex justify-between items-center mt-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-zinc-300">Easy: <strong className="text-white">{difficulty.easy}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-zinc-300">Medium: <strong className="text-white">{difficulty.medium}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="text-zinc-300">Hard: <strong className="text-white">{difficulty.hard}</strong></span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Matrix Main Container Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/90 border border-zinc-800/90 backdrop-blur-2xl relative shadow-2xl">
          
          {/* Matrix Bar Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>
                ACTIVITY MATRIX — {selectedYear === 'rolling' ? 'ROLLING 365 DAYS' : `YEAR ${selectedYear}`}
              </span>
            </div>
            <button
              onClick={() => fetchStreakData(selectedYear)}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-zinc-800"
              title="Refresh Activity Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>
          </div>

          {/* Matrix Scroll Area */}
          <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {loading ? (
              <div className="flex gap-1.5 justify-between py-6">
                {Array.from({ length: 52 }).map((_, w) => (
                  <div key={w} className="flex flex-col gap-1.5">
                    {Array.from({ length: 7 }).map((_, d) => (
                      <div key={d} className="w-3.5 h-3.5 rounded-sm bg-zinc-800/60 animate-pulse" />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="inline-flex flex-col gap-1.5 min-w-[760px] pt-2">
                
                {/* DYNAMIC MONTH LABELS ROW (Calculated 1-to-1 above exact starting week column) */}
                <div className="relative h-5 mb-1 pl-7 text-[11px] font-mono text-zinc-400 select-none">
                  {monthLabels.map((lbl, idx) => (
                    <span
                      key={idx}
                      className="absolute"
                      style={{ left: `calc(1.75rem + ${lbl.weekIdx * 1.25}rem)` }}
                    >
                      {lbl.month}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  {/* Day of Week Labels */}
                  <div className="flex flex-col justify-between py-0.5 text-[9px] font-mono text-zinc-500 select-none">
                    <span>Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                  </div>

                  {/* Weeks Grid Columns */}
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
                className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full mb-3 px-4 py-3 rounded-2xl bg-zinc-900/95 border border-zinc-700 text-white shadow-2xl backdrop-blur-xl text-xs font-sans min-w-[220px]"
                style={{ left: mousePos.x, top: mousePos.y }}
              >
                <div className="font-semibold border-b border-zinc-800 pb-1.5 mb-2 text-zinc-300 flex items-center justify-between">
                  <span>{formatDate(hoveredDay.date)}</span>
                  <span className="font-mono text-[10px] text-zinc-500">{hoveredDay.date}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-emerald-400">
                    <span className="flex items-center gap-1">
                      <GitCommit className="w-3.5 h-3.5" /> GitHub Commits:
                    </span>
                    <span className="font-mono font-bold text-sm">{hoveredDay.githubCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-amber-400">
                    <span className="flex items-center gap-1">
                      <Code2 className="w-3.5 h-3.5" /> LeetCode Solved:
                    </span>
                    <span className="font-mono font-bold text-sm">{hoveredDay.leetcodeCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-purple-300 pt-1.5 border-t border-zinc-800/80 font-bold">
                    <span>Total Contributions:</span>
                    <span className="font-mono text-sm">{hoveredDay.totalCount}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend & Color Matrix Key */}
          <div className="mt-8 pt-5 border-t border-zinc-900 flex flex-wrap items-center justify-between text-xs text-zinc-500 gap-4">
            <div className="flex items-center gap-5 flex-wrap">
              <span className="font-mono text-[11px] text-zinc-400">COLOR MATRIX KEY:</span>
              
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-sm bg-emerald-500 inline-block"></span>
                <span className="text-zinc-300">GitHub Only</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-sm bg-amber-500 inline-block"></span>
                <span className="text-zinc-300">LeetCode Only</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-sm bg-gradient-to-br from-emerald-400 via-purple-500 to-amber-400 inline-block"></span>
                <span className="text-purple-300 font-bold">Dual-Active Day!</span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span>Less</span>
              <div className="flex gap-1.5">
                <div className="w-3.5 h-3.5 rounded-sm bg-zinc-900 border border-zinc-800" />
                <div className="w-3.5 h-3.5 rounded-sm bg-emerald-950/80 border border-emerald-800/50" />
                <div className="w-3.5 h-3.5 rounded-sm bg-emerald-700 border border-emerald-600" />
                <div className="w-3.5 h-3.5 rounded-sm bg-emerald-500 border border-emerald-400" />
                <div className="w-3.5 h-3.5 rounded-sm bg-emerald-400 border border-emerald-300" />
              </div>
              <span>More</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
