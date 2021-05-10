import { IStore } from '../common/types';

export const getMockStore: () => IStore = () => ({
  navigation: {
    parent: null,
    isDataSent: false,
    nextPage: jest.fn(),
    updateCurrentPage: jest.fn(),
    getCurrentPageInfo: jest.fn(),
    setDataSent: jest.fn(),
    getCurrentPageIndex: jest.fn(),
    validatePages: jest.fn(),
  },
  currentProject: null,
  projects: [],
  investorData: {
    email: '',
    amount: 0,
    reset: jest.fn(),
  },
  setInvestorData: jest.fn(),
  setProjects: jest.fn(),
  setCurrentProjectInfo: jest.fn(),
  getCurrentProjectInfo: jest.fn(),
  reset: jest.fn(),
});
