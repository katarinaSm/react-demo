import { IPage } from './types';

export const pagesConfig: IPage[] = [
  {
    title: 'Select the project you want to invest in',
    page: '/',
    id: 'step1',
    pageIndex: 1,
    isPageFormValid: (store) => !!store.currentProject,
  },
  {
    title: 'Enter your information',
    page: '/enter_information',
    id: 'step2',
    pageIndex: 2,
    isPageFormValid: (store) => store.investorData.amount > 0 && store.investorData.email !== '',
  },
  {
    title: 'Confirm your information',
    page: '/confirm_information',
    id: 'step3',
    pageIndex: 3,
    isPageFormValid: (store) => !!store.navigation.isDataSent,
  },
  {
    title: 'Well done',
    page: '/final_step',
    id: 'step4',
    pageIndex: 4,
    isPageFormValid: () => false,
  },
];
