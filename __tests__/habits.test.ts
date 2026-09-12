/** Tests for the pure habit logic — streaks, toggles, grids. */

import {
  currentStreak,
  completionRatio,
  lastNDays,
  toggleToday,
  todayISO,
  Habit,
} from '../lib/habits'

const NOW = new Date('2026-09-13T10:00:00Z')

describe('todayISO / lastNDays', () => {
  it('formats UTC dates', () => {
    expect(todayISO(NOW)).toBe('2026-09-13')
  })
  it('builds an ordered window', () => {
    expect(lastNDays(3, NOW)).toEqual(['2026-09-11', '2026-09-12', '2026-09-13'])
  })
})

describe('currentStreak', () => {
  const mk = (days: string[]): Habit => ({
    id: 'h1', name: 'read', color: '#4c6fff', done: days, createdAt: '2026-01-01',
  })

  it('counts consecutive days ending today', () => {
    expect(currentStreak(['2026-09-11', '2026-09-12', '2026-09-13'], NOW)).toBe(3)
  })

  it('accepts a streak ending yesterday (grace)', () => {
    expect(currentStreak(['2026-09-10', '2026-09-11', '2026-09-12'], NOW)).toBe(3)
  })

  it('breaks on a gap', () => {
    expect(currentStreak(['2026-09-11', '2026-09-13'], NOW)).toBe(1)
  })

  it('is zero with nothing done', () => {
    expect(currentStreak([], NOW)).toBe(0)
  })
})

describe('toggleToday', () => {
  const base: Habit = {
    id: 'h1', name: 'gym', color: '#22c55e', done: ['2026-09-12'], createdAt: 'x',
  }

  it('adds a day', () => {
    const next = toggleToday(base, '2026-09-13')
    expect(next.done).toEqual(['2026-09-12', '2026-09-13'])
  })

  it('removes an existing day (undo)', () => {
    const next = toggleToday(toggleToday(base, '2026-09-13'), '2026-09-13')
    expect(next.done).toEqual(['2026-09-12'])
  })

  it('does not mutate the original', () => {
    toggleToday(base, '2026-09-13')
    expect(base.done).toEqual(['2026-09-12'])
  })
})

describe('completionRatio', () => {
  it('computes hits over window', () => {
    const habit: Habit = {
      id: 'h1', name: 'x', color: '#000',
      done: ['2026-08-15', '2026-09-01', '2026-09-13'],  // one outside window
      createdAt: 'x',
    }
    const ratio = completionRatio(habit, 30, NOW)
    // lastNDays(30) window covers Aug 15..Sep 13 inclusive
    expect(ratio).toBeCloseTo(3 / 30, 5)
  })
})
