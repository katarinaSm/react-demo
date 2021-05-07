import { action, observable, makeObservable } from 'mobx';
import Router from 'next/router';
import { cms } from '../common/cms';

class Navigation {
  constructor(parent) {
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

  setDataSent(isDataSent) {
    this.isDataSent = isDataSent;
  }

  getCurrentPageInfo(url) {
    const currentPageIndex = this.#getCurrentPageIndex(url);
    if (currentPageIndex !== -1) {
      return cms[currentPageIndex];
    }
    return null;
  }

  nextPage(url) {
    const currentPageIndex = this.#getCurrentPageIndex(url);
    const maxAllowedIndex = this.#validatePages();
    if (currentPageIndex < maxAllowedIndex) {
      const { page } = cms[currentPageIndex + 1];
      Router.push(page);
    }
    // used to prevent navigation before the all data are provided
  }

  updateCurrentPage(url) {
    const currentPageIndex = this.#getCurrentPageIndex(url);
    const visitedPageMaxIndex = this.#validatePages();
    if (currentPageIndex >= visitedPageMaxIndex + 1) {
      const { page } = cms[visitedPageMaxIndex];
      if (page !== url) {
        Router.replace(page);
      }
    }
  }

  #getCurrentPageIndex(url) {
    return cms.findIndex((data) => data.page === url);
  }

  // TODO: this won't scale for dynamical forms - move the condition to "cms" file
  #validatePages() {
    let i = 0;
    for (; /* intentionally empty */ i < cms.length; i += 1) {
      if (!cms[i].isPageFormValid(this.parent)) {
        break;
      }
    }
    return i;
  }
}

export default Navigation;
