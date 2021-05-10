import { action, observable, makeObservable } from 'mobx';
import Router from 'next/router';
import { pagesConfig } from '../common/pagesConfig';

import { IStore, INavigation, IPage } from '../common/types';

class Navigation implements INavigation {
  isDataSent: boolean;

  parent: IStore;

  constructor(parent: IStore) {
    this.isDataSent = false;
    this.parent = parent;

    makeObservable(this, {
      isDataSent: observable,
      nextPage: action,
      updateCurrentPage: action,
      getCurrentPageInfo: action,
      setDataSent: action,
    });
  }

  setDataSent(isDataSent: boolean) {
    this.isDataSent = isDataSent;
  }

  getCurrentPageInfo(url: string): IPage | null {
    const currentPageIndex = this.getCurrentPageIndex(url);
    if (currentPageIndex !== -1) {
      return pagesConfig[currentPageIndex];
    }
    return null;
  }

  nextPage(url: string) {
    const currentPageIndex = this.getCurrentPageIndex(url);
    const maxAllowedIndex = this.validatePages();
    if (currentPageIndex < maxAllowedIndex) {
      const { page } = pagesConfig[currentPageIndex + 1];
      Router.push(page);
    }
    // used to prevent navigation before the all data are provided
  }

  updateCurrentPage(url: string) {
    const currentPageIndex = this.getCurrentPageIndex(url);
    const visitedPageMaxIndex = this.validatePages();
    if (currentPageIndex >= visitedPageMaxIndex + 1) {
      const { page } = pagesConfig[visitedPageMaxIndex];
      if (page !== url) {
        Router.replace(page);
      }
    }
  }

  getCurrentPageIndex(url: string) {
    return pagesConfig.findIndex((data) => data.page === url);
  }

  validatePages() {
    let i = 0;
    for (; /* intentionally empty */ i < pagesConfig.length; i += 1) {
      if (!pagesConfig[i].isPageFormValid(this.parent)) {
        break;
      }
    }
    return i;
  }
}

export default Navigation;
