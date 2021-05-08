// var chromedriver = require('chromedriver');
import chromedriver from 'chromedriver';

const global = {
  before: async () => {
    chromedriver.start();
  },

  after: async () => {
    chromedriver.stop();
  },
};

export default global;
