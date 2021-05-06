jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn().mockReturnValue('path'),
}));
