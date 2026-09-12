# HabitGrid

<p align="center">
  <strong>Offline-first habit tracker built with Expo &amp; React Native.<br>
  Streaks, 14-day dot grids, monthly progress — zero accounts, zero network.</strong>
</p>

<p align="center">
  Expo SDK 51 · expo-router · TypeScript · AsyncStorage · Jest
</p>

---

## Why

Habit apps want your email, then your money, then your attention.
HabitGrid is the opposite: a **single-screen, offline-first** tracker
where every byte stays on your device. It is also my reference project
for a modern Expo stack — typed routing, pure-domain testing and a UI
that works identically on Android, iOS and web.

## Features

- ✅ **One-tap tracking** — mark habits done; tap again to undo
- 🔥 **Streaks** — consecutive-day counting with a one-day grace rule
- 🟦 **14-day dot grid** — GitHub-style visual history per habit
- 📊 **30-day progress bars** — completion ratio at a glance
- 🎨 **Auto-colored habits** — six-color palette rotation
- 📴 **Fully offline** — AsyncStorage persistence, no server, no tracking
- 🧪 **Pure domain logic** — streaks, toggles and ratios live in tested,
  UI-free TypeScript modules

## Quick start

```bash
git clone https://github.com/Godde3s/habitgrid && cd habitgrid
npm install --legacy-peer-deps
npx expo start           # scan the QR with Expo Go, or press a/android/w
```

## Architecture

```
lib/habits.ts      ← pure domain: Habit type, streak math, grid helpers
lib/storage.ts     ← AsyncStorage adapter (load/save/new habit)
app/_layout.tsx    ← expo-router stack, dark theme
app/index.tsx      ← screen: list, FAB, add-habit modal
components/HabitCard.tsx  ← dot grid + streak + progress bar
```

The **domain/UI split is deliberate**: `lib/habits.ts` imports nothing
from React Native, so the interesting logic (streak edge cases, UTC day
boundaries, immutability) runs in plain Jest with no device required:

```bash
npx jest            # 10 tests: streaks, grace day, undo, window math
npx tsc --noEmit    # strict types
```

## Design decisions

- **UTC day keys** — habit days are `YYYY-MM-DD` strings; using ISO UTC
  keeps streak math deterministic across timezones and DST.
- **Immutability** — `toggleToday` returns a new habit; state updates
  stay predictable and testable.
- **Grace rule** — a streak survives until *yesterday*; missing today
  does not annihilate a 30-day run at 00:01.
- **No state library** — five screens of state is where libraries earn
  their weight; one screen is not.

## Roadmap

- [ ] Reminders via expo-notifications
- [ ] Weekly review screen with per-habit trends
- [ ] Export/import (JSON) for backup
- [ ] Widgets (android) / home-screen quick actions

## License

MIT © Reza Bazdar (Godde3s)
