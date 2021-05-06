import { renderHook, act } from '@testing-library/react-hooks';
import useSubmitForm from './useSubmitForm';

// bad habit to expect a tuple from a hook instead of an object
const IS_LOADING = 0;
const IS_ALERT_SHOWN = 1;
const SUBMIT_FORM = 2;

jest.mock('../hooks/useStore', () => ({
  __esModule: true,
  default: () => ({
    userData: {
      email: undefined,
      amount: undefined,
    },
    nextPage: jest.fn(),
    updateCurrentPage: jest.fn(),
    setDataSent: jest.fn(),
  }),
}));

describe('useSubmitForm', () => {
  // https://github.com/jsdom/jsdom/issues/1724#issuecomment-675486907
  // beforeAll(() => jest.spyOn(window, 'fetch')); <== won't work in jsdom
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(),
    }),
  );

  it('should initially hide alert and loader', () => {
    const { result } = renderHook(() => useSubmitForm());

    expect(result.current[IS_LOADING]).toBeFalsy();

    expect(result.current[IS_ALERT_SHOWN]).toBeFalsy();
  });

  it('should show loader', async () => {
    const { result } = renderHook(() => useSubmitForm());

    window.fetch.mockResolvedValueOnce(
      Promise.resolve({
        status: 200,
        ok: true,
        async json() {
          return { success: true };
        },
      }),
    );

    await act(async () => {
      await result.current[SUBMIT_FORM](true);
      expect(result.current[IS_LOADING]).toBeTruthy();
    });

    expect(result.current[IS_LOADING]).toBeFalsy();

    expect(result.current[IS_ALERT_SHOWN]).toBeFalsy();
  });

  it('should show alert on error', async () => {
    const { result } = renderHook(() => useSubmitForm());

    window.fetch.mockResolvedValueOnce(
      Promise.resolve({
        status: 500,
        async json() {
          return { success: true };
        },
      }),
    );

    await act(async () => {
      await result.current[SUBMIT_FORM](true);
      expect(result.current[IS_LOADING]).toBeTruthy();
    });

    expect(result.current[IS_LOADING]).toBeFalsy();

    expect(result.current[IS_ALERT_SHOWN]).toBeTruthy();
  });

  it('should hide alert after error', async () => {
    jest.useFakeTimers();

    const { result } = renderHook(() => useSubmitForm());

    window.fetch.mockResolvedValueOnce(
      Promise.resolve({
        status: 500,
        async json() {
          return { success: true };
        },
      }),
    );

    await act(async () => {
      result.current[SUBMIT_FORM](true);
    });

    expect(result.current[IS_ALERT_SHOWN]).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current[IS_ALERT_SHOWN]).toBeFalsy();
  });
});
