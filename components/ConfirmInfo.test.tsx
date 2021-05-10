import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { getMockStore } from '../test/mockStore';
import TestWrapper from '../test/TestWrapper';
import ConfirmInfo from './ConfirmInfo';
import mockFetch from '../test/mockFetch';
import { IStore, IProject, IInvestorData } from '../common/types';

describe('ConfirmInfo', () => {
  let store: IStore;
  let mockProject: IProject;
  let mockInvestor: IInvestorData;

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
    mockProject = {
      name: 'My project',
      id: 1,
      location: 'location',
    };
    mockInvestor = { email: 'mail@example.com', amount: 1500000, reset: jest.fn() };
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
    (window.fetch as jest.Mock).mockResolvedValueOnce(
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
    expect(store.navigation.nextPage).toBeCalled();
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
    expect(store.navigation.nextPage).not.toBeCalled();
  });
});
