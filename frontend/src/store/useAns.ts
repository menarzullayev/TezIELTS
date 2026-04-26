import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { log_i } from '@/lib/logger';

// qid -> answer string
type AnsMap = Record<string, string>;

interface AnsState {
  ans: AnsMap;
  set_ans: (qid: string, val: string) => void;
  get_ans: (qid: string) => string;
  clear_ans: () => void;
}

export const useAns = create<AnsState>()(
  persist(
    (set, get) => ({
      ans: {},
      set_ans: (qid, val) => {
        log_i('ans_set', { qid, val });
        set((state) => ({
          ans: { ...state.ans, [qid]: val },
        }));
      },
      get_ans: (qid) => get().ans[qid] || '',
      clear_ans: () => {
        log_i('ans_clear');
        set({ ans: {} });
      },
    }),
    {
      name: 'sim_ans_st',
    }
  )
);
