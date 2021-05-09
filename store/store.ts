import { action, computed, observable, makeObservable } from 'mobx';
import Navigation from './navigation';

class Store {
  constructor() {
    this.userData = {
      email: undefined,
      amount: undefined,
    };
    this.currentProject = null;
    this.projects = [];
    this.navigation = new Navigation(this);

    makeObservable(this, {
      userData: observable,
      currentProject: observable,
      setUserData: action,
      setProjects: action,
      setProject: action,
      reset: action,
      currentProjectInfo: computed,
    });
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

  reset() {
    this.userData = {
      email: undefined,
      amount: undefined,
    };
    this.currentProject = null;
  }
}

export default Store;
