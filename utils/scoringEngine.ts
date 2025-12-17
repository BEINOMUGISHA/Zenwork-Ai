import { DailyLog, WellnessMetrics, NervousSystemState } from "../types";

// Helper to clamp values between min and max
const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

/**
 * Calculates the user's baselines based on the last 30 days of logs
 */
const calculateBaselines = (logs: DailyLog[]) => {
  if (logs.length === 0) return { avgHours: 8, avgStress: 5, avgMood: 3 };

  const totalHours = logs.reduce((sum, log) => sum + log.hoursWorked, 0);
  const totalStress = logs.reduce((sum, log) => sum + log.stressLevel, 0);
  const totalMood = logs.reduce((sum, log) => sum + log.mood, 0);

  return {
    avgHours: totalHours / logs.length,
    avgStress: totalStress / logs.length,
    avgMood: totalMood / logs.length
  };
};

/**
 * CORE LOGIC: Computes Wellness Metrics
 */
export const calculateWellnessMetrics = (
  todayLog: DailyLog | undefined, 
  previousLogs: DailyLog[], 
  waterGoal: number
): WellnessMetrics => {
  
  const baselines = calculateBaselines(previousLogs);
  const yesterdayLog = previousLogs.length > 0 ? previousLogs[previousLogs.length - 1] : null;

  // Defaults if no log today yet
  const currentMood = todayLog?.mood ?? 3;
  const currentStress = todayLog?.stressLevel ?? 3; // Assume low stress if not logged
  const currentHours = todayLog?.hoursWorked ?? 0;
  const currentWater = todayLog?.waterIntake ?? 0;

  const contributors: { positive: string[], negative: string[] } = {
    positive: [],
    negative: []
  };

  // ---------------------------------------------------------
  // 1. STRESS SCORE (0-100)
  // Higher = More Stressed
  // ---------------------------------------------------------
  
  // Base: Self-reported stress maps directly (1-10 -> 10-100)
  let stressScore = currentStress * 10;
  
  // Modifier: Work Load relative to baseline
  if (todayLog) {
    const hourDiff = currentHours - baselines.avgHours;
    if (hourDiff > 1) {
      stressScore += 10; // Penalty for working >1hr over average
      contributors.negative.push(`Work hours higher than average (+${hourDiff.toFixed(1)}h)`);
    } else if (hourDiff < -1) {
      stressScore -= 5; // Bonus for working less
      contributors.positive.push("Lighter work load today");
    }
  }

  // Modifier: Streak of high stress
  const recentHighStress = previousLogs.slice(-3).every(l => l.stressLevel >= 7);
  if (recentHighStress) {
    stressScore += 15; // Cumulative fatigue penalty
    contributors.negative.push("Accumulated stress from past 3 days");
  }

  stressScore = clamp(stressScore, 0, 100);


  // ---------------------------------------------------------
  // 2. ENERGY LEVEL (0-100)
  // Higher = More Energy
  // ---------------------------------------------------------
  
  // Base: Mood is the primary driver for mental energy (1-5 -> 20-100)
  let energyScore = currentMood * 20;

  // Modifier: Hydration Impact
  const hydrationRatio = currentWater / waterGoal;
  if (todayLog && hydrationRatio < 0.5) {
    energyScore -= 15;
    contributors.negative.push("Low hydration impacting focus");
  } else if (todayLog && hydrationRatio >= 1) {
    energyScore += 5;
    contributors.positive.push("Well hydrated");
  }

  // Modifier: Work Hangover (Impact of Yesterday)
  if (yesterdayLog) {
    if (yesterdayLog.hoursWorked > 10) {
      energyScore -= 20;
      contributors.negative.push("Fatigue from yesterday's long hours");
    }
    if (yesterdayLog.stressLevel >= 8) {
      energyScore -= 10;
      contributors.negative.push("Lingering stress from yesterday");
    }
  }

  energyScore = clamp(energyScore, 0, 100);


  // ---------------------------------------------------------
  // 3. RECOVERY READINESS (0-100)
  // How ready are you for today? Based PURELY on yesterday/history.
  // ---------------------------------------------------------
  
  let recoveryScore = 80; // Start at a healthy baseline

  if (yesterdayLog) {
    // Sleep proxy (Low stress + good mood usually implies decent sleep in MVP)
    if (yesterdayLog.mood >= 4 && yesterdayLog.stressLevel <= 4) {
      recoveryScore += 15;
      contributors.positive.push("High recovery state detected");
    }

    // Heavy Strain Penalty
    const strain = (yesterdayLog.stressLevel * 10) + (yesterdayLog.hoursWorked * 5);
    if (strain > 100) {
      recoveryScore -= 20;
    }

    // Weekend Recovery Effect (if today is Monday and no logs on weekend, assume rested)
    const dayOfWeek = new Date().getDay();
    if (dayOfWeek === 1 && previousLogs.length > 0) {
       // Simple logic: Mondays get a small boost if user didn't log work on Sunday
       recoveryScore += 5;
    }
  }

  recoveryScore = clamp(recoveryScore, 0, 100);


  // ---------------------------------------------------------
  // 4. NERVOUS SYSTEM STATE
  // Matrix: Stress vs. Energy
  // ---------------------------------------------------------
  
  let state: NervousSystemState = 'flow';
  let label = 'Balanced Flow';
  let description = 'You are in an optimal state for deep work.';

  if (stressScore > 60) {
    if (energyScore > 50) {
      state = 'activated';
      label = 'Sympathetic Activation';
      description = 'High energy but high pressure. Good for short sprints, but watch for burnout.';
    } else {
      state = 'overdrive';
      label = 'Sympathetic Overdrive';
      description = 'High stress and low energy. You are at risk of burnout. Prioritize rest immediately.';
    }
  } else {
    if (energyScore > 50) {
      state = 'flow';
      label = 'Parasympathetic Flow';
      description = 'Calm and energetic. This is your sweet spot for creative work.';
    } else {
      state = 'recharge';
      label = 'Rest & Digest';
      description = 'Low stress but low energy. Your body needs active recovery.';
    }
  }

  return {
    stressScore,
    energyScore,
    recoveryScore,
    nervousSystem: {
      state,
      label,
      description
    },
    contributors
  };
};