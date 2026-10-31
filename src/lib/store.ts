import { useSyncExternalStore } from 'react'

// Penyimpanan di memori untuk data DEMO admin. Perubahan hilang saat halaman dimuat ulang.
export interface Store<T> { get: () => T[]; set: (next: T[]) => void; subscribe: (f: () => void) => () => void }

export function createStore<T>(initial: T[]): Store<T> {
  let items = initial
  const subs = new Set<() => void>()
  return {
    get: () => items,
    set: (next) => { items = next; subs.forEach((f) => f()) },
    subscribe: (f) => { subs.add(f); return () => { subs.delete(f) } },
  }
}
export const useStore = <T,>(s: Store<T>) => useSyncExternalStore(s.subscribe, s.get)
export const uid = () => Math.random().toString(36).slice(2, 8)
