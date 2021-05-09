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
  investorData: {
    email: null,
    amount: 0,
  },
  setInvestorData: jest.fn(),
  setProjects: jest.fn(),
  setProject: jest.fn(),
  currentProjectInfo: jest.fn(), // getter
});
