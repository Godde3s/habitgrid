import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Habit, completionRatio, lastNDays } from '../lib/habits'

type Props = {
  habit: Habit
  streak: number
  onToggle: () => void
  onRemove: () => void
  testID?: string
}

export default function HabitCard({ habit, streak, onToggle, onRemove, testID }: Props) {
  const days = lastNDays(14)
  const doneSet = new Set(habit.done)
  const ratio = completionRatio(habit, 30)

  return (
    <View style={[s.card, { borderLeftColor: habit.color }]} testID={testID}>
      <View style={s.top}>
        <Text style={s.name}>{habit.name}</Text>
        <Pressable hitSlop={10} onPress={onRemove} accessibilityLabel="delete habit">
          <Text style={s.remove}>✕</Text>
        </Pressable>
      </View>

      {/* 14-day dot grid — tap any row to toggle today */}
      <View style={s.grid}>
        {days.map((day) => (
          <View
            key={day}
            style={[s.dot, { backgroundColor: doneSet.has(day) ? habit.color : '#232c44' }]}
          />
        ))}
      </View>

      <View style={s.bottom}>
        <Text style={s.streak}>
          🔥 {streak} day{streak === 1 ? '' : 's'}
        </Text>
        <View style={s.barWrap}>
          <View style={[s.bar, { width: `${Math.round(ratio * 100)}%`, backgroundColor: habit.color }]} />
        </View>
        <Text style={s.pct}>{Math.round(ratio * 100)}%</Text>
      </View>

      <Pressable style={s.todayBtn} onPress={onToggle} accessibilityLabel="toggle today">
        <Text style={s.todayText}>
          {doneSet.has(days[days.length - 1]) ? '✓ done today — tap to undo' : 'mark today ✓'}
        </Text>
      </Pressable>
    </View>
  )
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#161d2f', borderRadius: 16, padding: 16,
    borderLeftWidth: 4, gap: 12,
  },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { color: '#e8ecf5', fontSize: 17, fontWeight: '700' },
  remove: { color: '#64748b', fontSize: 15, paddingHorizontal: 6 },
  grid: { flexDirection: 'row', gap: 5 },
  dot: { width: 16, height: 16, borderRadius: 5 },
  bottom: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  streak: { color: '#f59e0b', fontWeight: '700', fontSize: 13, minWidth: 74 },
  barWrap: { flex: 1, height: 6, borderRadius: 3, backgroundColor: '#232c44', overflow: 'hidden' },
  bar: { height: '100%', borderRadius: 3 },
  pct: { color: '#8494b8', fontSize: 12, minWidth: 34, textAlign: 'right' },
  todayBtn: {
    alignSelf: 'flex-start', borderColor: '#2c3854', borderWidth: 1,
    borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6,
  },
  todayText: { color: '#9fb0d0', fontSize: 12 },
})
