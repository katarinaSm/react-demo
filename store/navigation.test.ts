import { push, replace } from 'next/router';
import Store, { ProjectData } from './store';
import Navigation from './navigation';
import InvestorData from './investorData';
import { getMockStore } from '../test/mockStore';
import { IStore, INavigation } from '../common/types';

describe('Navigation', () => {
  let navigation: INavigation;
  let store: IStore;
  let mockInvestorData: InvestorData;
  let mockProject: ProjectData;

  beforeEach(() => {
    store = new Store();
    navigation = store.navigation;
    mockInvestorData = { email: 'email', amount: 1, reset: jest.fn() };
    mockProject = { id: 1, location: 'location', name: 'name' };
  });

  describe('Page info', () => {
    it('should return meta data of page', () => {
      expect(navigation.getCurrentPageInfo('/')).toBeDefined();
    });

    it('should return null if page doesnt exist', () => {
      expect(navigation.getCurrentPageInfo('/wrong')).toBeNull();
    });
  });

  describe('Page traversal and page order', () => {
    it('shouldnt move to 2nd step if project is not defined', () => {
      navigation.nextPage('/');
      expect(push).toBeCalledTimes(0);
    });

    it('should move to 2nd step if project is defined', () => {
      store.currentProject = mockProject;
      navigation.nextPage('/');

      expect(push).toBeCalledTimes(1);
      expect(push).toBeCalledWith('/enter_information');
    });

    it('should move to 3rd step if project and user data exists', () => {
      store.currentProject = mockProject;
      navigation.nextPage('/enter_information');

      expect(push).toBeCalledTimes(0);

      store.investorData = mockInvestorData;

      navigation.nextPage('/enter_information');

      expect(push).toBeCalledTimes(1);
      expect(push).toBeCalledWith('/confirm_information');
    });

    it('should move to 4th step if all data and user consent are provided', () => {
      store.currentProject = mockProject;
      store.investorData = mockInvestorData;

      navigation.nextPage('/confirm_information');

      expect(push).toBeCalledTimes(0);

      navigation.isDataSent = true;

      navigation.nextPage('/confirm_information');

      expect(push).toBeCalledTimes(1);
      expect(push).toBeCalledWith('/final_step');
    });
  });

  describe('Redirection to last populated page', () => {
    it('should redirect to 1st step', () => {
      navigation.updateCurrentPage('/final_step');

      expect(replace).toBeCalledTimes(1);
      expect(replace).toBeCalledWith('/');
    });
  });
});
