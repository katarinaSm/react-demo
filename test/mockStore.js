export const getMockStore = () => ({
  navigation: {
    isDataSent: false,
    nextPage: jest.fn(),
    reset: jest.fn(),
    updateCurrentPage: jest.fn(),
    getCurrentPageInfo: jest.fn(),
    setDataSent: jest.fn(),
  },
  currentProject: null,
  projects: [],
  userData: {
    email: undefined,
    amount: undefined,
  },
  setUserData: jest.fn(),
  setProjects: jest.fn(),
  setProject: jest.fn(),
  currentProjectInfo: jest.fn(), // getter
});
