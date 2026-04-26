import { useTmr } from '@/store/useTmr';

describe('useTmr store', () => {
  beforeEach(() => {
    useTmr.getState().reset_t();
  });

  it('starts the timer with an end timestamp', () => {
    const now = 1_700_000_000_000;
    vi.spyOn(Date, 'now').mockReturnValue(now);

    useTmr.getState().set_t(60_000);

    expect(useTmr.getState().is_running).toBe(true);
    expect(useTmr.getState().end_t).toBe(now + 60_000);
  });

  it('stops and resets the timer', () => {
    useTmr.getState().set_t(60_000);
    useTmr.getState().stop_t();
    expect(useTmr.getState().is_running).toBe(false);

    useTmr.getState().reset_t();
    expect(useTmr.getState().end_t).toBeNull();
    expect(useTmr.getState().is_running).toBe(false);
  });
});
