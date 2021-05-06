import { action, computed, observable, makeObservable } from 'mobx';
import Router from 'next/router';

import { cms } from '../common/cms';

class Store {
  constructor() {
    this.userData = {
      email: undefined,
      amount: undefined,
    };
    this.currentProject = null;
    this.projects = [];
    this.isDataSent = false;

    makeObservable(this, {
      userData: observable,
      currentProject: observable,
      isDataSent: observable,
      setUserData: action,
      setProjects: action,
      setProject: action,
      nextPage: action,
      reset: action,
      updateCurrentPage: action,
      getCurrentPageInfo: action,
      setDataSent: action,
      currentProjectInfo: computed,
    });
  }

  setDataSent(isDataSent) {
    this.isDataSent = isDataSent;
  }

  get currentProjectInfo() {
    return this.currentProject;
  }

  setProject(currentProject) {
    this.currentProject = currentProject;
  }

  setProjects(projects) {
    this.projects = projects ?? [];
  }

  setUserData(userData) {
    this.userData = userData;
  }

  getCurrentPageInfo(url) {
    const currentPageIndex = this.#getCurrentPageIndex(url);
    if (currentPageIndex !== -1) {
      return cms[currentPageIndex];
    }
    return null;
  }

  reset() {
    this.userData = {
      email: undefined,
      amount: undefined,
    };
    this.currentProject = null;
  }

  nextPage(url) {
    const currentPageIndex = this.#getCurrentPageIndex(url);
    const maxAllowedIndex = this.#validatePages();
    if (currentPageIndex !== -1 && currentPageIndex <= maxAllowedIndex + 1) {
      const { page } = cms[currentPageIndex + 1];
      Router.push(page);
    }
    // used to prevent navigation before the all data are provided
  }

  updateCurrentPage(url) {
    const currentPageIndex = this.#getCurrentPageIndex(url);
    const visitedPageMaxIndex = this.#validatePages();
    if (currentPageIndex > visitedPageMaxIndex) {
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
    let maxIndex = 0;
    if (!this.currentProject) {
      return maxIndex;
    }
    maxIndex += 1;
    if (this.userData.amount !== undefined && this.userData.email !== undefined) {
      maxIndex += 1;
    }
    if (!this.isDataSent) {
      return maxIndex;
    }
    maxIndex += 1;
    return maxIndex;
  }
}

export default Store;
