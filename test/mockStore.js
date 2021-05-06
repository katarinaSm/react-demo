export const getMockStore = () => ({
  currentProject: null,
  projects: [],
  isDataSent: false,
  userData: {
    email: undefined,
    amount: undefined,
  },
  setUserData: jest.fn(),
  setProjects: jest.fn(),
  setProject: jest.fn(),
  nextPage: jest.fn(),
  reset: jest.fn(),
  updateCurrentPage: jest.fn(),
  getCurrentPageInfo: jest.fn(),
  setDataSent: jest.fn(),
  currentProjectInfo: jest.fn(),
});
