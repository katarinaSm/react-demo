import { Provider } from 'mobx-react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Layout from '../components/Layout';
import { PropsWithChildren } from 'react';
import Store from '../store/store';

const client = new QueryClient();

const TestWrapper = ({ children, store }: PropsWithChildren<{ store: Store }>) => (
  <Provider rootStore={store}>
    <QueryClientProvider client={client}>
      <Layout>{children}</Layout>
    </QueryClientProvider>
  </Provider>
);

export default TestWrapper;
