export interface IInvestorData {
  email: string | null;
  amount: number;
  reset(): void;
}

export interface IStore {
  investorData: IInvestorData;
  currentProject: IProject | null;
  projects: IProject[];
  navigation: INavigation;
  getCurrentProjectInfo(): IProject;
  setCurrentProjectInfo(project: IProject);

  setProjects(projects: IProject[]): void;

  setInvestorData(investorData: IInvestorData): void;

  reset();
}

export interface INavigation {
  isDataSent: boolean;
  parent: IStore;
  setDataSent(isDataSent: boolean): void;
  getCurrentPageInfo(url: string): IPage | null;
  nextPage(url: string): void;
  updateCurrentPage(url: string): void;
  getCurrentPageIndex(url: string): void;
  validatePages(): void;
  getCurrentPageIndex(url: string): void;
  validatePages(): void;
}

export interface IPage {
  id: string;
  title: string;
  page: string;
  pageIndex: number;
  isPageFormValid: (store: IStore) => boolean;
}

export interface IProject {
  id: number;
  name: string;
  location: string;
}
