import { push, replace } from 'next/router';
import Store from './store';

describe('Store', () => {
  let store;

  beforeEach(() => {
    store = new Store();
  });

  describe('Page info', () => {
    it('should return meta data of page', () => {
      expect(store.getCurrentPageInfo('/')).toBeDefined();
    });

    it('should return null if page doesnt exist', () => {
      expect(store.getCurrentPageInfo('/wrong')).toBeDefined();
    });
  });

  describe('Page traversal and page order', () => {
    it('shouldnt move to 2nd step if project is not defined', () => {
      store.nextPage('/');
      expect(push).toBeCalledTimes(0);
    });

    it('should move to 2nd step if project is defined', () => {
      store.currentProject = {};
      store.nextPage('/');

      expect(push).toBeCalledTimes(1);
      expect(push).toBeCalledWith('/enter_information');
    });

    it('should move to 3rd step if project and user data exists', () => {
      store.currentProject = {};
      store.nextPage('/enter_information');

      expect(push).toBeCalledTimes(0);

      store.userData = { email: 'email', amount: 1 };

      store.nextPage('/enter_information');

      expect(push).toBeCalledTimes(1);
      expect(push).toBeCalledWith('/confirm_information');
    });

    it('should move to 4th step if all data and user consent are provided', () => {
      store.currentProject = {};
      store.userData = { email: 'email', amount: 1 };

      store.nextPage('/confirm_information');

      expect(push).toBeCalledTimes(0);

      store.isDataSent = true;

      store.nextPage('/confirm_information');

      expect(push).toBeCalledTimes(1);
      expect(push).toBeCalledWith('/final_step');
    });
  });

  describe('Redirectoin to last populated page', () => {
    it('should redirect to 1st step', () => {
      store.updateCurrentPage('/final_step');

      expect(replace).toBeCalledTimes(1);
      expect(replace).toBeCalledWith('/');
    });
  });
});
