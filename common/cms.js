export const cms = [
  {
    title: 'Select the project you want to invest in',
    page: '/',
    id: 'step1',
    number: 1,
    isPageFormValid: (store) => !!store.currentProject,
  },
  {
    title: 'Enter your information',
    page: '/enter_information',
    id: 'step2',
    number: 2,
    isPageFormValid: (store) =>
      !!(store.userData.amount !== undefined && store.userData.email !== undefined),
  },
  {
    title: 'Confirm your information',
    page: '/confirm_information',
    id: 'step3',
    number: 3,
    isPageFormValid: (store) => !!store.navigation.isDataSent,
  },
  {
    title: 'Well done',
    page: '/final_step',
    id: 'step4',
    number: 4,
    isPageFormValid: () => false,
  },
];

/*

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
 */
