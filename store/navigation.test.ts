import { push, replace } from 'next/router';
import Store from './store';

describe('Navigation', () => {
  let navigation;
  let store;

  beforeEach(() => {
    store = new Store();
    navigation = store.navigation;
  });

  describe('Page info', () => {
    it('should return meta data of page', () => {
      expect(navigation.getCurrentPageInfo('/')).toBeDefined();
    });

    it('should return null if page doesnt exist', () => {
      expect(navigation.getCurrentPageInfo('/wrong')).toBeDefined();
    });
  });

  describe('Page traversal and page order', () => {
    it('shouldnt move to 2nd step if project is not defined', () => {
      navigation.nextPage('/');
      expect(push).toBeCalledTimes(0);
    });

    it('should move to 2nd step if project is defined', () => {
      store.currentProject = {};
      navigation.nextPage('/');

      expect(push).toBeCalledTimes(1);
      expect(push).toBeCalledWith('/enter_information');
    });

    it('should move to 3rd step if project and user data exists', () => {
      store.currentProject = {};
      navigation.nextPage('/enter_information');

      expect(push).toBeCalledTimes(0);

      store.investorData = { email: 'email', amount: 1 };

      navigation.nextPage('/enter_information');

      expect(push).toBeCalledTimes(1);
      expect(push).toBeCalledWith('/confirm_information');
    });

    it('should move to 4th step if all data and user consent are provided', () => {
      store.currentProject = {};
      store.investorData = { email: 'email', amount: 1 };

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
