import { act, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TestWrapper from '../test/TestWrapper';
import InvestorInformation from './InvestorInformation';
import { getMockStore } from '../test/mockStore';
import { IStore } from '../common/types';

describe('InvestorInformation', () => {
  let store: IStore;
  beforeEach(() => {
    store = getMockStore();
  });

  it('Should show placeholders', () => {
    const { queryByPlaceholderText } = render(
      <TestWrapper store={store}>
        <InvestorInformation />
      </TestWrapper>,
    );

    expect(queryByPlaceholderText('Your email address')).toBeInTheDocument();
    expect(queryByPlaceholderText('Investment amount')).toBeInTheDocument();
  });

  it('Should validate empty fields', async () => {
    const { queryByText, getByTestId } = render(
      <TestWrapper store={store}>
        <InvestorInformation />
      </TestWrapper>,
    );

    await act(async () => {
      // https://github.com/react-hook-form/react-hook-form/issues/532
      // fireEvent.submit(getByTestId('button').querySelector('button')); <== didn't work
      getByTestId('button').querySelector('button').click();
    });

    expect(queryByText('Email is a required field')).toBeInTheDocument();
    expect(queryByText('Expected a positive number')).toBeInTheDocument();
  });

  it('Shouldnt traverse to the next page if validation fails', async () => {
    const { queryByText } = render(
      <TestWrapper store={store}>
        <InvestorInformation />
      </TestWrapper>,
    );

    await act(async () => {
      await userEvent.click(queryByText('Continue'));
    });

    expect(store.navigation.nextPage).not.toBeCalled();
  });

  it('Should validate email and number', async () => {
    const { queryByText, getByTestId, queryByPlaceholderText } = await render(
      <TestWrapper store={store}>
        <InvestorInformation />
      </TestWrapper>,
    );

    userEvent.type(queryByPlaceholderText('Your email address'), 'example.com');
    userEvent.type(queryByPlaceholderText('Investment amount'), 'MMCLIII');

    await act(async () => {
      await getByTestId('button').querySelector('button').click();
    });

    expect(queryByText('Please provide a valid email address')).toBeInTheDocument();
    expect(queryByText('Please enter a valid positive number')).toBeInTheDocument();
  });

  it('Should travers to the next page on valid input', async () => {
    const { queryByText, getByTestId, queryByPlaceholderText } = await render(
      <TestWrapper store={store}>
        <InvestorInformation />
      </TestWrapper>,
    );

    userEvent.type(queryByPlaceholderText('Your email address'), 'mail@example.com');
    userEvent.type(queryByPlaceholderText('Investment amount'), '125000');

    await act(async () => {
      await getByTestId('button').querySelector('button').click();
    });

    expect(queryByText('Please provide a valid email address')).toBeNull();
    expect(queryByText('Please enter a valid positive number')).toBeNull();
    expect(store.navigation.nextPage).toBeCalled();
  });
});
