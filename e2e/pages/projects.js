import backCommand from '../commands/backCommand';

const page = {
  url: 'http://localhost:3000',
  commands: [backCommand],
  elements: {
    project1: {
      selector: '[data-testid="project_1"]',
    },
    project1Button: {
      selector: '[data-testid="project_1"] button',
    },
    project2: {
      selector: '[data-testid="project_2"]',
    },
    project2Button: {
      selector: '[data-testid="project_2"] button',
    },
    project3: {
      selector: '[data-testid="project_3"]',
    },
    project3Button: {
      selector: '[data-testid="project_3"] button',
    },
  },
};

export default page;
