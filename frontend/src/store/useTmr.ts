import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { log_i } from '@/lib/logger';

interface TmrState {
  end_t: number | null;
  is_running: boolean;
  set_t: (duration_ms: number) => void;
  stop_t: () => void;
  reset_t: () => void;
}

export const useTmr = create<TmrState>()(
  persist(
    (set) => ({
      end_t: null,
      is_running: false,
      set_t: (duration_ms) => {
        const end_time = Date.now() + duration_ms;
        log_i('tmr_set', { duration_ms, end_time });
        set({ end_t: end_time, is_running: true });
      },
      stop_t: () => {
        log_i('tmr_stop');
        set({ is_running: false });
      },
      reset_t: () => {
        log_i('tmr_reset');
        set({ end_t: null, is_running: false });
      }
    }),
    { 
      name: 'sim_tmr_st',
      // Only persist the end time, is_running can be reset or evaluated
      partialize: (state) => ({ end_t: state.end_t, is_running: state.is_running })
    }
  )
);
