const backCommand = {
  back: function () {
    this.api.back(1000);
    return this;
  },
};

export default backCommand;
