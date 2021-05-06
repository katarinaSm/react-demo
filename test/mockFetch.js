const mockFetch = (fn) => {
  // https://github.com/jsdom/jsdom/issues/1724#issuecomment-675486907
  // beforeAll(() => jest.spyOn(window, 'fetch')); <== won't work in jsdom
  global.fetch = jest.fn().mockImplementation(fn());
};

export default mockFetch;
