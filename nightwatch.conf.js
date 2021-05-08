// github.com/nightwatchjs/nightwatch/issues/2038

// eslint-disable-next-line import/no-extraneous-dependencies
require('@babel/register')();

module.exports = {
  src_folders: ['e2e/specs'],
  page_objects_path: ['e2e/pages'],
  globals_path: './globals.js',
  output_folder: 'e2e/output',

  selenium: {
    start_process: false,
  },

  webdriver: {
    start_process: true,
    server_path: 'node_modules/.bin/chromedriver',
    port: 9515,
  },

  test_settings: {
    default: {
      desiredCapabilities: {
        browserName: 'chrome',
      },
    },
  },
};
