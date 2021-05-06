import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { getMockStore } from '../test/mockStore';
import TestWrapper from '../test/TestWrapper';
import ConfirmInfo from './ConfirmInfo';
import mockFetch from '../test/mockFetch';

describe('ConfirmInfo', () => {
  let store;

  beforeEach(() => {
    jest.useFakeTimers();
    mockFetch(() =>
      Promise.resolve({
        status: 200,
        ok: true,
        async json() {
          return { success: true };
        },
      }),
    );
    store = getMockStore();
  });

  it('should show the user inputs', () => {
    store.currentProjectInfo = {
      name: 'My project',
    };
    store.userData = { email: 'mail@example.com', amount: 1500000 };

    const { getByText } = render(
      <TestWrapper store={store}>
        <ConfirmInfo />
      </TestWrapper>,
    );

    expect(getByText('My project')).toBeDefined();
  });

  it('submit should be disabled is consent is not given', () => {
    const { queryByTestId } = render(
      <TestWrapper store={store}>
        <ConfirmInfo />
      </TestWrapper>,
    );

    const button = queryByTestId('button').querySelector('button');
    const checkbox = queryByTestId('checkbox').querySelector('input[type="checkbox"]');

    expect(checkbox).not.toBeChecked();
    expect(button).not.toBeEnabled();

    userEvent.click(checkbox);

    expect(button).toBeEnabled();
    expect(checkbox).toBeChecked();
  });

  it('should show loader during the data fetching', async () => {
    window.fetch.mockResolvedValueOnce(
      Promise.resolve({
        status: 200,
        ok: true,
        async json() {
          return { success: true };
        },
      }),
    );

    const { queryByTestId } = render(
      <TestWrapper store={store}>
        <ConfirmInfo />
      </TestWrapper>,
    );

    const button = queryByTestId('button').querySelector('button');
    const checkbox = queryByTestId('checkbox').querySelector('input[type="checkbox"]');

    userEvent.click(checkbox);

    await act(async () => {
      await userEvent.click(button);
      expect(queryByTestId('spinner')).toBeTruthy();
    });

    expect(queryByTestId('spinner')).toBeNull();
  });

  it('should fetch data', async () => {
    window.fetch = jest.fn().mockReturnValue(
      Promise.resolve({
        status: 200,
      }),
    );

    const { queryByTestId } = render(
      <TestWrapper store={store}>
        <ConfirmInfo />
      </TestWrapper>,
    );

    const button = queryByTestId('button').querySelector('button');
    const checkbox = queryByTestId('checkbox').querySelector('input[type="checkbox"]');

    userEvent.click(checkbox);

    await act(async () => {
      await userEvent.click(button);
    });

    expect(window.fetch).toBeCalled();
    expect(store.nextPage).toBeCalled();
  });

  it('should show alert if fetch fails', async () => {
    window.fetch = jest.fn().mockReturnValue(
      Promise.resolve({
        on: false,
        status: 500,
      }),
    );

    const { queryByTestId } = render(
      <TestWrapper store={store}>
        <ConfirmInfo />
      </TestWrapper>,
    );

    const button = queryByTestId('button').querySelector('button');
    const checkbox = queryByTestId('checkbox').querySelector('input[type="checkbox"]');

    userEvent.click(checkbox);

    await act(async () => {
      userEvent.click(button);
      jest.runOnlyPendingTimers();
    });

    act(() => {
      expect(queryByTestId('alert')).toBeTruthy();
      jest.runOnlyPendingTimers();
    });

    expect(queryByTestId('alert')).toBeNull();

    expect(window.fetch).toBeCalled();
    expect(store.nextPage).not.toBeCalled();
  });
});
