class CrmError extends Error {
  constructor(message) {
    super(message);

    this.name = 'CrmError';
    this.timeStamp = +new Date();
  }
}

export default CrmError;
