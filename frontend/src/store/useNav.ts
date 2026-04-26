import { create } from 'zustand';
import { log_i } from '@/lib/logger';

interface NavState {
  active_q: string | null; // Active Question ID
  active_sec: string | null; // Active Section ID
  set_nav: (sec_id: string, q_id: string) => void;
}

// Navigation does NOT need to be persisted to local storage
// Because if they refresh, it's fine to start at the top, or we can restore it,
// but usually it's better to keep localStorage clean.
export const useNav = create<NavState>()((set) => ({
  active_q: null,
  active_sec: null,
  set_nav: (sec_id, q_id) => {
    log_i('nav_set', { sec_id, q_id });
    set({ active_sec: sec_id, active_q: q_id });
  },
}));
