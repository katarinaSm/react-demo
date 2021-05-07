import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TestWrapper from '../test/TestWrapper';
import Projects from './Projects';
import { getMockStore } from '../test/mockStore';

const projects = [
  { id: 1, name: 'Project A', location: 'CityA' },
  { id: 2, name: 'Project B', location: 'CityB' },
  { id: 3, name: 'Project C', location: 'CityC' },
];

describe('Projects', () => {
  let store;

  beforeEach(() => {
    window.fetch = jest.fn().mockReturnValue(
      Promise.resolve({
        status: 200,
        ok: true,
        async json() {
          // NOTE: async will ensure that projects are wrapped by a promise
          return { projects };
        },
      }),
    );
    store = getMockStore();
  });

  it('should load projects and handle visibility of loader', async () => {
    const { queryByText, queryByTestId } = render(
      <TestWrapper store={store}>
        <Projects />
      </TestWrapper>,
    );

    expect(queryByTestId('loader')).toBeInTheDocument();

    await waitFor(() => expect(store.setProjects).toBeCalledWith(projects));

    expect(queryByText('Project A')).toBeInTheDocument();
    expect(queryByText('Project B')).toBeInTheDocument();
    expect(queryByText('Project C')).toBeInTheDocument();

    expect(queryByTestId('loader')).toBeNull();
  });

  it('shouldnt preselect a project', async () => {
    render(
      <TestWrapper store={store}>
        <Projects />
      </TestWrapper>,
    );

    await waitFor(() => expect(store.setProjects).toBeCalledWith(projects));

    expect(store.setProject).toBeCalledTimes(0);
  });

  it('should traverse to next page on selection', async () => {
    const { queryByTestId } = render(
      <TestWrapper store={store}>
        <Projects />
      </TestWrapper>,
    );

    await waitFor(() => expect(store.setProjects).toBeCalledWith(projects));

    await act(async () => {
      userEvent.click(queryByTestId('project_1').querySelector('button'));
    });

    expect(store.setProject).toBeCalledTimes(1);
    expect(store.navigation.nextPage).toBeCalledTimes(1);
  });
});
