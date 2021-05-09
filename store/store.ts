import { action, computed, observable, makeObservable } from 'mobx';
import Navigation from './navigation';
import InvestorData from './investorData';
import type IStore from './store.type';

export interface ProjectData {
  id: number;
  title: string;
  name: string;
}

class Store implements IStore {
  investorData: InvestorData;

  currentProject: ProjectData | null;

  projects: ProjectData[];

  navigation: Navigation;

  constructor() {
    this.currentProject = null;
    this.projects = [];
    this.navigation = new Navigation(this);
    this.investorData = new InvestorData();

    makeObservable(this, {
      investorData: observable,
      currentProject: observable,
      setInvestorData: action,
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

  setInvestorData(investorData) {
    this.investorData = investorData;
  }

  reset() {
    this.investorData.reset();
    this.currentProject = null;
  }
}

export default Store;
