/** Persistence layer — AsyncStorage-backed, offline-first by design. */

import AsyncStorage from '@react-native-async-storage/async-storage'
import { COLORS, Habit } from './habits'

const KEY = 'habitgrid/habits/v1'

export async function loadHabits(): Promise<Habit[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Habit[]
  } catch {
    /* corrupted storage: start clean rather than crash */
  }
  return []
}

export async function saveHabits(habits: Habit[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(habits))
}

export function newHabit(name: string, index: number): Habit {
  return {
    id: `h_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim().slice(0, 40),
    color: COLORS[index % COLORS.length],
    done: [],
    createdAt: new Date().toISOString(),
  }
}
