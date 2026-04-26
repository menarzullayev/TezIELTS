import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TestState {
  tid: string | null;
  ans: Record<string, string>;
  setA: (qid: string, v: string) => void;
  setTid: (tid: string) => void;
  clear: () => void;
}

export const useTst = create<TestState>()(
  persist(
    (set) => ({
      tid: null,
      ans: {},
      setA: (qid, v) => set((s) => ({ ans: { ...s.ans, [qid]: v } })),
      setTid: (tid) => set({ tid }),
      clear: () => set({ tid: null, ans: {} }),
    }),
    {
      name: 'tez-ielts-test-storage', // name of the item in the storage (must be unique)
    }
  )
);
