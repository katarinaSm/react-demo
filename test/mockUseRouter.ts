jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
    };
  },
  push: jest.fn(),
  replace: jest.fn(),
}));

// Add an import, export, or an empty 'export {}' statement to make it a module.
export {};
