import Logger from './logger';

const log = Logger('tracking');

export const tracking = {
  // eslint-disable-next-line no-unused-vars
  write: (type: string, email: string) => {
    // TODO: implement me
    log.debug(`Tracking log type=${type} mail=${email}`);
  },
};
