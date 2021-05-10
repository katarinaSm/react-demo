import { action, computed, observable, makeObservable } from 'mobx';
import Navigation from './navigation';
import InvestorData from './investorData';
import { IStore, INavigation } from '../common/types';

export interface ProjectData {
  id: number;
  location: string;
  name: string;
}

class Store implements IStore {
  investorData: InvestorData;

  currentProject: ProjectData | null;

  projects: ProjectData[];

  navigation: INavigation;

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
      reset: action,
      setCurrentProjectInfo: action,
    });
  }

  getCurrentProjectInfo(): ProjectData {
    return this.currentProject;
  }

  setCurrentProjectInfo(currentProject: ProjectData) {
    this.currentProject = currentProject;
  }

  setProjects(projects: ProjectData[]): void {
    this.projects = projects;
  }

  setInvestorData(investorData: InvestorData) {
    this.investorData = investorData;
  }

  reset() {
    this.investorData.reset();
    this.currentProject = null;
  }
}

export default Store;
