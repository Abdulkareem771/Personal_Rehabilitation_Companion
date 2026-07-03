import type { WorkoutSession, RecoveryEntry } from "@/types";
import { todayISO } from "./formatters";

export interface StreakStats {
  currentStreakDays: number;
  longestStreakDays: number;
  lastActiveDate?: string;
  isActiveToday: boolean;
}

/**
 * Calculates current and longest activity streak based on workout sessions and recovery entries.
 */
export function calculateStreak(
  sessions: WorkoutSession[],
  recoveryEntries: RecoveryEntry[]
): StreakStats {
  const activeDates = new Set<string>();

  for (const s of sessions) {
    if (s.status === "completed" && s.completedAt) {
      activeDates.add(s.completedAt.split("T")[0]);
    } else if (s.startedAt) {
      activeDates.add(s.startedAt.split("T")[0]);
    }
  }

  for (const r of recoveryEntries) {
    activeDates.add(r.date);
  }

  const sortedDates = Array.from(activeDates).sort((a, b) => b.localeCompare(a));
  const today = todayISO();
  
  if (sortedDates.length === 0) {
    return {
      currentStreakDays: 0,
      longestStreakDays: 0,
      isActiveToday: false,
    };
  }

  const isActiveToday = sortedDates.includes(today);
  
  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // For current streak calculation, check if active today or yesterday
  const yesterdayObj = new Date();
  yesterdayObj.setDate(yesterdayObj.getDate() - 1);
  const yesterday = yesterdayObj.toISOString().split("T")[0];

  let checkDateObj = new Date();
  if (!isActiveToday && !sortedDates.includes(yesterday)) {
    currentStreak = 0;
  } else {
    if (!isActiveToday) {
      checkDateObj.setDate(checkDateObj.getDate() - 1);
    }
    while (true) {
      const dateStr = checkDateObj.toISOString().split("T")[0];
      if (activeDates.has(dateStr)) {
        currentStreak++;
        checkDateObj.setDate(checkDateObj.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Longest streak calculation
  const ascendingDates = Array.from(activeDates).sort();
  for (let i = 0; i < ascendingDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = new Date(ascendingDates[i - 1]);
      const currDate = new Date(ascendingDates[i]);
      const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }

  return {
    currentStreakDays: currentStreak,
    longestStreakDays: Math.max(longestStreak, currentStreak),
    lastActiveDate: sortedDates[0],
    isActiveToday,
  };
}
