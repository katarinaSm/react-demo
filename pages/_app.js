import React, { useMemo, useEffect } from 'react';
import { Provider } from 'mobx-react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import '../styles/globals.css';

import ErrorBoundary from '../components/ErrorBoundary';
import Layout from '../components/Layout';

import Store from '../store/store';

const ROUTER_CHANGE_START = 'routeChangeStart';

const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();
  const store = useMemo(() => new Store(), []);

  useEffect(() => {
    const handleRouteChange = (url) => {
      store.updateCurrentPage(url);
    };
    router.events.on(ROUTER_CHANGE_START, handleRouteChange);
    store.updateCurrentPage(router.pathname);
    return () => {
      router.events.off(ROUTER_CHANGE_START, handleRouteChange);
    };
  }, [store, router.events, router.pathname]);

  return (
    <ErrorBoundary>
      <Provider rootStore={store}>
        <QueryClientProvider client={queryClient}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  );
};

MyApp.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  pageProps: PropTypes.shape({}),
};

export default MyApp;
