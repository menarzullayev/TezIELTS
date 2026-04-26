import { useTst } from '@/store/useTst';

describe('useTst store', () => {
  beforeEach(() => {
    useTst.getState().clear();
  });

  it('tracks the active test id', () => {
    useTst.getState().setTid('test-42');

    expect(useTst.getState().tid).toBe('test-42');
  });

  it('stores answers and clears state', () => {
    useTst.getState().setA('q1', 'B');

    expect(useTst.getState().ans).toEqual({ q1: 'B' });

    useTst.getState().clear();

    expect(useTst.getState().tid).toBeNull();
    expect(useTst.getState().ans).toEqual({});
  });
});
