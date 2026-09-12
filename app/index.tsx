import { useCallback, useEffect, useState } from 'react'
import {
  FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View,
} from 'react-native'
import { Habit, currentStreak, todayISO } from '../lib/habits'
import { loadHabits, newHabit, saveHabits } from '../lib/storage'
import HabitCard from '../components/HabitCard'

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [draft, setDraft] = useState('')

  useEffect(() => {
    loadHabits().then(setHabits)
  }, [])

  const persist = useCallback((next: Habit[]) => {
    setHabits(next)
    saveHabits(next).catch(() => {})
  }, [])

  function toggle(habitId: string) {
    persist(habits.map((h) => {
      if (h.id !== habitId) return h
      const done = h.done.includes(todayISO())
          ? h.done.filter((d) => d !== todayISO())
          : [...h.done, todayISO()]
      return { ...h, done }
    }))
  }

  function remove(habitId: string) {
    persist(habits.filter((h) => h.id !== habitId))
  }

  function add() {
    const name = draft.trim()
    if (!name) return
    persist([...habits, newHabit(name, habits.length)])
    setDraft('')
    setModalOpen(false)
  }

  const today = todayISO()
  const doneToday = habits.filter((h) => h.done.includes(today)).length

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <Text style={s.title}>HabitGrid</Text>
        <Text style={s.subtitle}>
          {doneToday}/{habits.length} done today
        </Text>
      </View>

      <FlatList
        data={habits}
        keyExtractor={(h) => h.id}
        contentContainerStyle={{ gap: 12, paddingBottom: 90 }}
        ListEmptyComponent={
          <Text style={s.empty}>
            No habits yet.{"\n"}Tap ＋ to start your first streak.
          </Text>
        }
        renderItem={({ item, index }) => (
          <HabitCard
            habit={item}
            streak={currentStreak(item.done)}
            onToggle={() => toggle(item.id)}
            onRemove={() => remove(item.id)}
            testID={`habit-${index}`}
          />
        )}
      />

      <Pressable style={s.fab} onPress={() => setModalOpen(true)} testID="add-habit">
        <Text style={s.fabText}>＋</Text>
      </Pressable>

      <Modal visible={modalOpen} animationType="slide" transparent>
        <View style={s.modalWrap}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>New habit</Text>
            <TextInput
              style={s.input}
              value={draft}
              onChangeText={setDraft}
              placeholder="e.g. Read 20 pages"
              placeholderTextColor="#64748b"
              maxLength={40}
              onSubmitEditing={add}
            />
            <View style={s.modalRow}>
              <Pressable style={[s.btn, s.btnGhost]} onPress={() => setModalOpen(false)}>
                <Text style={s.btnGhostText}>Cancel</Text>
              </Pressable>
              <Pressable style={s.btn} onPress={add}>
                <Text style={s.btnText}>Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0f1420', paddingHorizontal: 16, paddingTop: 60 },
  header: { marginBottom: 18 },
  title: { color: '#e8ecf5', fontSize: 28, fontWeight: '800' },
  subtitle: { color: '#8494b8', marginTop: 4 },
  empty: { color: '#64748b', textAlign: 'center', marginTop: 60, lineHeight: 22 },
  fab: {
    position: 'absolute', bottom: 28, right: 20, width: 58, height: 58,
    borderRadius: 29, backgroundColor: '#4c6fff', alignItems: 'center', justifyContent: 'center',
    elevation: 6, shadowColor: '#4c6fff', shadowOpacity: 0.4, shadowRadius: 10,
  },
  fabText: { color: '#fff', fontSize: 30, marginTop: -2 },
  modalWrap: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.55)' },
  modal: { backgroundColor: '#161d2f', padding: 22, borderTopLeftRadius: 22, borderTopRightRadius: 22, gap: 14 },
  modalTitle: { color: '#e8ecf5', fontSize: 18, fontWeight: '700' },
  input: {
    backgroundColor: '#0f1420', borderColor: '#2c3854', borderWidth: 1,
    borderRadius: 12, color: '#e8ecf5', padding: 12, fontSize: 16,
  },
  modalRow: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end' },
  btn: { backgroundColor: '#4c6fff', borderRadius: 12, paddingHorizontal: 22, paddingVertical: 11 },
  btnText: { color: '#fff', fontWeight: '700' },
  btnGhost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#2c3854' },
  btnGhostText: { color: '#9fb0d0' },
})
