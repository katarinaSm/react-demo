import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'mobx-react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Layout from '../components/Layout';

const queryClient = new QueryClient();

const TestWrapper = ({ children, store }) => (
  <Provider rootStore={store}>
    <QueryClientProvider client={queryClient}>
      <Layout>{children}</Layout>
    </QueryClientProvider>
  </Provider>
);

TestWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  store: PropTypes.shape({}),
};

export default TestWrapper;
