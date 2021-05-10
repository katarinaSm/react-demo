import { PropsWithChildren } from 'react';
import { Provider } from 'mobx-react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Layout from '../components/Layout';
import { IStore } from '../common/types';

const client = new QueryClient();

const TestWrapper = ({ children, store }: PropsWithChildren<{ store: IStore }>) => (
  <Provider rootStore={store}>
    <QueryClientProvider client={client}>
      <Layout>{children}</Layout>
    </QueryClientProvider>
  </Provider>
);

export default TestWrapper;
