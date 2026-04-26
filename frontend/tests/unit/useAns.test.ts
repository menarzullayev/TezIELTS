import { useAns } from '@/store/useAns';

describe('useAns store', () => {
  beforeEach(() => {
    useAns.getState().clear_ans();
  });

  it('stores and retrieves answers by question id', () => {
    useAns.getState().set_ans('q1', 'Answer A');

    expect(useAns.getState().get_ans('q1')).toBe('Answer A');
  });

  it('clears all answers', () => {
    useAns.getState().set_ans('q1', 'Answer A');
    useAns.getState().clear_ans();

    expect(useAns.getState().ans).toEqual({});
  });
});
