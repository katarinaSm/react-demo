import { renderHook, act } from '@testing-library/react-hooks';
import useAlert from './useAlert';

const IS_ALERT_SHOWN = 0;
const SET_ERROR = 1;

describe('useAlert', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runAllTimers();
    jest.useRealTimers();
  });

  it('should hide alert initially', () => {
    const { result } = renderHook(() => useAlert());

    expect(result.current[IS_ALERT_SHOWN]).toBeFalsy();
  });

  it('should hide shown alert', () => {
    const { result } = renderHook(() => useAlert());

    act(() => {
      result.current[SET_ERROR](true);
    });

    expect(result.current[IS_ALERT_SHOWN]).toBeTruthy();

    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(result.current[IS_ALERT_SHOWN]).toBeFalsy();
  });

  it('should extend shown time on incoming error when alert is shown', () => {
    const { result } = renderHook(() => useAlert());

    // show alert
    act(() => {
      result.current[SET_ERROR](true);
    });

    expect(result.current[IS_ALERT_SHOWN]).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(2800);
    });

    expect(result.current[IS_ALERT_SHOWN]).toBeTruthy();

    // new error happened before alarm was hidden
    act(() => {
      result.current[SET_ERROR](true);
    });

    act(() => {
      jest.advanceTimersByTime(2800);
    });

    act(() => {
      result.current[SET_ERROR](true);
    });

    act(() => {
      jest.advanceTimersByTime(2800);
    });

    expect(result.current[IS_ALERT_SHOWN]).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current[IS_ALERT_SHOWN]).toBeFalsy();
  });
});
