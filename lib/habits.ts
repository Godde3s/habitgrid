/** Habit domain: types, streak math and completion grid — all pure, all tested. */

export type Habit = {
  id: string
  name: string
  color: string
  /** ISO dates (YYYY-MM-DD) on which the habit was completed */
  done: string[]
  createdAt: string
}

export const COLORS = ['#4c6fff', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#14b8a6']

export function todayISO(now: Date = new Date()): string {
  return now.toISOString().slice(0, 10)
}

export function lastNDays(n: number, now: Date = new Date()): string[] {
  const days: string[] = []
  for (let i = 0; i < n; i++) {
    const d = new Date(now)
    d.setUTCDate(d.getUTCDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days.reverse()               // oldest → newest
}

/** Current streak: consecutive completed days ending today (or yesterday). */
export function currentStreak(done: string[], now: Date = new Date()): number {
  const set = new Set(done)
  const cursor = new Date(now)
  if (!set.has(todayISO(cursor))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1)
    if (!set.has(todayISO(cursor))) return 0
  }
  let streak = 0
  while (set.has(todayISO(cursor))) {
    streak++
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }
  return streak
}

/** Toggle today's completion and return the updated habit (immutable). */
export function toggleToday(habit: Habit, day: string = todayISO()): Habit {
  const has = habit.done.includes(day)
  return {
    ...habit,
    done: has ? habit.done.filter((d) => d !== day) : [...habit.done, day],
  }
}

/** 0..1 progress over the last `window` days, for the progress bar. */
export function completionRatio(habit: Habit, window = 30, now: Date = new Date()): number {
  const days = lastNDays(window, now)
  const set = new Set(habit.done)
  const hits = days.filter((d) => set.has(d)).length
  return days.length === 0 ? 0 : hits / days.length
}
