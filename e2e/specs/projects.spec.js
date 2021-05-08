import { PRIMARY_BUTTON_CSS } from '../constants';

export const navigateToInvestmentFormPage = (browser) =>
  browser
    .page
    .projects()
    .navigate()
    .click('@project1');

describe('Projects', () => {
  it('Should select a project', (browser) => {
    browser
      .page
      .projects()
      .navigate()
      .assert.not.cssClassPresent('@project1Button', PRIMARY_BUTTON_CSS)
      .click('@project1')
      .back()
      .assert.cssClassPresent('@project1Button', PRIMARY_BUTTON_CSS)
  });
});
